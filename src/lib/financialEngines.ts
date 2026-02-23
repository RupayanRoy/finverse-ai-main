// ===== EMI Calculator =====
export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / tenureMonths;
  return (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
}

export function generateAmortization(principal: number, annualRate: number, tenureMonths: number) {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const r = annualRate / 12 / 100;
  let balance = principal;
  const schedule = [];

  for (let i = 1; i <= tenureMonths; i++) {
    const interest = balance * r;
    const principalPart = emi - interest;
    balance = Math.max(0, balance - principalPart);
    schedule.push({
      month: i,
      emi: Math.round(emi),
      principal: Math.round(principalPart),
      interest: Math.round(interest),
      balance: Math.round(balance),
    });
  }
  return { emi: Math.round(emi), totalPayment: Math.round(emi * tenureMonths), totalInterest: Math.round(emi * tenureMonths - principal), schedule };
}

// ===== SIP / Investment Projection =====
export function calculateSIPFutureValue(monthlySIP: number, annualReturn: number, years: number) {
  const r = annualReturn / 12 / 100;
  const n = years * 12;
  if (r === 0) return monthlySIP * n;
  return monthlySIP * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

export function generateInvestmentProjection(monthlySIP: number, annualReturn: number, years: number) {
  const r = annualReturn / 12 / 100;
  const data = [];
  let invested = 0;
  let value = 0;

  for (let m = 1; m <= years * 12; m++) {
    invested += monthlySIP;
    value = (value + monthlySIP) * (1 + r);
    if (m % 12 === 0) {
      data.push({ year: m / 12, invested: Math.round(invested), value: Math.round(value), gains: Math.round(value - invested) });
    }
  }
  return data;
}

// ===== Tax Calculator (Indian Regime) =====
interface TaxInput {
  salary: number;
  deductions80C: number;
  deductions80D: number;
  hra: number;
  otherDeductions: number;
}

function calcOldRegimeTax(input: TaxInput) {
  const taxableIncome = Math.max(0, input.salary - input.deductions80C - input.deductions80D - input.hra - input.otherDeductions - 50000);
  return calcSlabTax(taxableIncome, [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 5 },
    { limit: 1000000, rate: 20 },
    { limit: Infinity, rate: 30 },
  ]);
}

function calcNewRegimeTax(input: TaxInput) {
  const taxableIncome = Math.max(0, input.salary - 75000);
  return calcSlabTax(taxableIncome, [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 5 },
    { limit: 1200000, rate: 10 },
    { limit: 1600000, rate: 15 },
    { limit: 2000000, rate: 20 },
    { limit: 2400000, rate: 25 },
    { limit: Infinity, rate: 30 },
  ]);
}

function calcSlabTax(income: number, slabs: { limit: number; rate: number }[]) {
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (income <= prev) break;
    const taxable = Math.min(income, slab.limit) - prev;
    tax += taxable * slab.rate / 100;
    prev = slab.limit;
  }
  return Math.round(tax);
}

export function compareTaxRegimes(input: TaxInput) {
  const oldTax = calcOldRegimeTax(input);
  const newTax = calcNewRegimeTax(input);
  return {
    oldRegime: oldTax,
    newRegime: newTax,
    savings: Math.abs(oldTax - newTax),
    recommended: oldTax < newTax ? 'old' as const : 'new' as const,
  };
}

// ===== Credit Score =====
export interface CreditFactors {
  savingsConsistency: number; // 0-100
  investmentDiscipline: number; // 0-100
  emiHistory: number; // 0-100
  expenseStability: number; // 0-100
  subscriptionConsistency: number; // 0-100
}

export function calculateCreditScore(factors: CreditFactors): number {
  const weighted =
    factors.savingsConsistency * 0.25 +
    factors.investmentDiscipline * 0.2 +
    factors.emiHistory * 0.25 +
    factors.expenseStability * 0.15 +
    factors.subscriptionConsistency * 0.15;
  return Math.round(300 + (weighted / 100) * 600);
}

export function getCreditRating(score: number): { label: string; color: string } {
  if (score >= 750) return { label: 'Excellent', color: 'neon-emerald' };
  if (score >= 650) return { label: 'Good', color: 'primary' };
  if (score >= 550) return { label: 'Fair', color: 'neon-amber' };
  return { label: 'Needs Work', color: 'destructive' };
}

// ===== Financial Health Score =====
export interface HealthInput {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalDebt: number;
  totalSavings: number;
  investmentValue: number;
  emiAmount: number;
}

export function calculateHealthScore(input: HealthInput): number {
  const savingsRatio = Math.min(100, ((input.monthlyIncome - input.monthlyExpenses) / input.monthlyIncome) * 100 * 2);
  const debtRatio = Math.max(0, 100 - (input.totalDebt / (input.monthlyIncome * 12)) * 100);
  const emiRatio = Math.max(0, 100 - (input.emiAmount / input.monthlyIncome) * 200);
  const wealthRatio = Math.min(100, ((input.totalSavings + input.investmentValue) / (input.monthlyIncome * 6)) * 100);

  return Math.round(savingsRatio * 0.3 + debtRatio * 0.25 + emiRatio * 0.2 + wealthRatio * 0.25);
}

// ===== Cash Flow Forecast =====
export function forecastCashFlow(monthlyIncome: number, monthlyExpenses: number, monthlySavings: number, months: number) {
  const data = [];
  let cumSavings = 0;
  for (let i = 1; i <= months; i++) {
    const variance = (Math.random() - 0.5) * monthlyExpenses * 0.1;
    const expense = monthlyExpenses + variance;
    const net = monthlyIncome - expense;
    cumSavings += net;
    data.push({
      month: i,
      income: Math.round(monthlyIncome),
      expenses: Math.round(expense),
      net: Math.round(net),
      cumulative: Math.round(cumSavings),
    });
  }
  return data;
}

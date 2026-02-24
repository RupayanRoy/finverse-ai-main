/**
 * Virtual Treasury Store
 * Simulates a backend database using localStorage so User and Admin 
 * portals can communicate without a separate Node.js process.
 */

export interface Transaction {
  trace_id: string;
  destination: string;
  amount: number;
  energy_audit: string;
  timestamp: string;
}

export interface LoanRequest {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  purpose: string;
  income: number;
  tenure: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: string;
}

const LEDGER_KEY = 'finverse_ledger';
const LOANS_KEY = 'finverse_loans';

export const treasuryStore = {
  // Ledger Methods
  getLedger: (): Transaction[] => {
    const data = localStorage.getItem(LEDGER_KEY);
    return data ? JSON.parse(data) : [];
  },

  addTransaction: (tx: Omit<Transaction, 'energy_audit' | 'timestamp'>) => {
    const ledger = treasuryStore.getLedger();
    const newTx: Transaction = {
      ...tx,
      energy_audit: `${(Math.random() * 0.003 + 0.001).toFixed(5)} J`,
      timestamp: new Date().toLocaleTimeString(),
    };
    localStorage.setItem(LEDGER_KEY, JSON.stringify([newTx, ...ledger]));
    return newTx;
  },

  // Loan Methods
  getLoans: (): LoanRequest[] => {
    const data = localStorage.getItem(LOANS_KEY);
    return data ? JSON.parse(data) : [];
  },

  applyForLoan: (loan: Omit<LoanRequest, 'id' | 'status' | 'timestamp'>) => {
    const loans = treasuryStore.getLoans();
    const newLoan: LoanRequest = {
      ...loan,
      id: `LOAN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      status: 'PENDING',
      timestamp: new Date().toLocaleString(),
    };
    localStorage.setItem(LOANS_KEY, JSON.stringify([newLoan, ...loans]));
    return newLoan;
  },

  updateLoanStatus: (id: string, status: 'APPROVED' | 'REJECTED') => {
    const loans = treasuryStore.getLoans();
    const updated = loans.map(l => l.id === id ? { ...l, status } : l);
    localStorage.setItem(LOANS_KEY, JSON.stringify(updated));
    return updated.find(l => l.id === id);
  }
};
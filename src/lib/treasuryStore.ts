/**
 * Virtual Treasury Store
 * Simulates a backend database using localStorage.
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
  interestRate: number;
  emi: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  processed: boolean;
  timestamp: string;
}

const LEDGER_KEY = 'finverse_ledger';
const LOANS_KEY = 'finverse_loans';

export const treasuryStore = {
  getLedger: (): Transaction[] => {
    try {
      const data = localStorage.getItem(LEDGER_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
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

  getLoans: (): LoanRequest[] => {
    try {
      const data = localStorage.getItem(LOANS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  applyForLoan: (loan: Omit<LoanRequest, 'id' | 'status' | 'timestamp' | 'processed'>) => {
    const loans = treasuryStore.getLoans();
    const newLoan: LoanRequest = {
      ...loan,
      id: `LOAN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      status: 'PENDING',
      processed: false,
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
  },

  markLoanAsProcessed: (id: string) => {
    const loans = treasuryStore.getLoans();
    const updated = loans.map(l => l.id === id ? { ...l, processed: true } : l);
    localStorage.setItem(LOANS_KEY, JSON.stringify(updated));
  }
};
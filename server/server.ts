import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: ["http://localhost:8083", "http://localhost:5173", "http://localhost:8080"], 
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

interface Transaction {
  trace_id: string;
  destination: string;
  amount: number;
  energy_audit?: string;
  timestamp?: string;
}

interface LoanRequest {
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

let treasuryLedger: Transaction[] = [];
let loanRequests: LoanRequest[] = [];

app.post('/api/treasury/relay', (req, res) => {
  const relayEntry: Transaction = {
    ...req.body,
    energy_audit: `${(Math.random() * 0.003 + 0.001).toFixed(5)} J`,
    timestamp: new Date().toLocaleTimeString(),
  };
  treasuryLedger.unshift(relayEntry);
  res.status(200).json({ status: "SUCCESS" });
});

app.get('/api/treasury/ledger', (req, res) => {
  res.json(treasuryLedger);
});

// Loan Endpoints
app.post('/api/loans/apply', (req, res) => {
  const loan: LoanRequest = {
    ...req.body,
    id: `LOAN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    status: 'PENDING',
    timestamp: new Date().toLocaleString(),
  };
  loanRequests.unshift(loan);
  res.status(200).json(loan);
});

app.get('/api/loans/all', (req, res) => {
  res.json(loanRequests);
});

app.put('/api/loans/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const loan = loanRequests.find(l => l.id === id);
  if (loan) {
    loan.status = status;
    res.status(200).json(loan);
  } else {
    res.status(404).json({ error: "Loan not found" });
  }
});

const PORT = 8001; 
app.listen(PORT, () => {
  console.log(`🚀 Treasury Node online at http://localhost:${PORT}`);
});
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  // Port 8083 is your Vite port from the terminal screenshot
  origin: ["http://localhost:8083", "http://localhost:5173"], 
  methods: ["GET", "POST"],
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

let treasuryLedger: Transaction[] = [];

app.post('/api/treasury/relay', (req, res) => {
  const relayEntry: Transaction = {
    ...req.body,
    // Simulation for your Roy-eco-coder energy audit
    energy_audit: `${(Math.random() * 0.003 + 0.001).toFixed(5)} J`,
    timestamp: new Date().toLocaleTimeString(),
  };
  treasuryLedger.unshift(relayEntry);
  res.status(200).json({ status: "SUCCESS" });
});

app.get('/api/treasury/ledger', (req, res) => {
  res.json(treasuryLedger);
});

// Using 8001 to bypass the Windows 'Access Denied' error on 8000
const PORT = 8001; 
app.listen(PORT, () => {
  console.log(`🚀 Treasury Node online at http://localhost:${PORT}`);
});
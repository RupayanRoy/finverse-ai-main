import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { treasuryStore } from '@/lib/treasuryStore';
import { useAuth } from './AuthContext';

interface UserData {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalDebt: number;
  totalSavings: number;
  investmentValue: number;
  emiAmount: number;
  scholarshipClaimed: boolean;
}

interface UserContextType {
  userData: UserData;
  claimScholarship: (amount: number) => void;
  updateSavings: (amount: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('finverse_user_data');
    return saved ? JSON.parse(saved) : {
      monthlyIncome: 50000,
      monthlyExpenses: 28000,
      totalDebt: 500000,
      totalSavings: 120000,
      investmentValue: 85000,
      emiAmount: 10500,
      scholarshipClaimed: false,
    };
  });

  // Persist user data
  useEffect(() => {
    localStorage.setItem('finverse_user_data', JSON.stringify(userData));
  }, [userData]);

  // Poll for approved loans
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const checkLoans = () => {
      const loans = treasuryStore.getLoans();
      const myApprovedLoan = loans.find(l => 
        l.userEmail === user.email && 
        l.status === 'APPROVED' && 
        !l.processed
      );

      if (myApprovedLoan) {
        setUserData(prev => ({
          ...prev,
          totalSavings: prev.totalSavings + myApprovedLoan.amount,
          monthlyExpenses: prev.monthlyExpenses + myApprovedLoan.emi,
          emiAmount: prev.emiAmount + myApprovedLoan.emi,
          totalDebt: prev.totalDebt + myApprovedLoan.amount
        }));

        treasuryStore.markLoanAsProcessed(myApprovedLoan.id);
        
        toast({
          title: "Loan Disbursed!",
          description: `₹${myApprovedLoan.amount.toLocaleString()} added to savings. Monthly expenses updated with EMI.`,
        });
      }
    };

    const interval = setInterval(checkLoans, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const claimScholarship = (amount: number) => {
    if (userData.scholarshipClaimed) return;
    
    setUserData(prev => ({
      ...prev,
      totalSavings: prev.totalSavings + amount,
      scholarshipClaimed: true
    }));
    
    toast({
      title: "Scholarship Claimed!",
      description: `₹${amount.toLocaleString()} has been added to your savings.`,
    });
  };

  const updateSavings = (amount: number) => {
    setUserData(prev => ({
      ...prev,
      totalSavings: prev.totalSavings + amount
    }));
  };

  return (
    <DialogContext.Provider value={{ userData, claimScholarship, updateSavings }}>
      {children}
    </DialogContext.Provider>
  );
}

// Fix for the context provider name mismatch in the original file
const DialogContext = UserContext;

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
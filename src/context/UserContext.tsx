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

const DEFAULT_USER_DATA: UserData = {
  monthlyIncome: 50000,
  monthlyExpenses: 28000,
  totalDebt: 500000,
  totalSavings: 120000,
  investmentValue: 85000,
  emiAmount: 10500,
  scholarshipClaimed: false,
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserData>(() => {
    try {
      const saved = localStorage.getItem('finverse_user_data');
      if (!saved) return DEFAULT_USER_DATA;
      
      const parsed = JSON.parse(saved);
      // Ensure no null values creep in from corrupted storage
      return {
        monthlyIncome: parsed.monthlyIncome ?? DEFAULT_USER_DATA.monthlyIncome,
        monthlyExpenses: parsed.monthlyExpenses ?? DEFAULT_USER_DATA.monthlyExpenses,
        totalDebt: parsed.totalDebt ?? DEFAULT_USER_DATA.totalDebt,
        totalSavings: parsed.totalSavings ?? DEFAULT_USER_DATA.totalSavings,
        investmentValue: parsed.investmentValue ?? DEFAULT_USER_DATA.investmentValue,
        emiAmount: parsed.emiAmount ?? DEFAULT_USER_DATA.emiAmount,
        scholarshipClaimed: !!parsed.scholarshipClaimed,
      };
    } catch (e) {
      return DEFAULT_USER_DATA;
    }
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
          totalSavings: (prev.totalSavings || 0) + (myApprovedLoan.amount || 0),
          monthlyExpenses: (prev.monthlyExpenses || 0) + (myApprovedLoan.emi || 0),
          emiAmount: (prev.emiAmount || 0) + (myApprovedLoan.emi || 0),
          totalDebt: (prev.totalDebt || 0) + (myApprovedLoan.amount || 0)
        }));

        treasuryStore.markLoanAsProcessed(myApprovedLoan.id);
        
        toast({
          title: "Loan Disbursed!",
          description: `₹${(myApprovedLoan.amount || 0).toLocaleString()} added to savings. Monthly expenses updated with EMI.`,
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
      totalSavings: (prev.totalSavings || 0) + amount,
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
      totalSavings: (prev.totalSavings || 0) + amount
    }));
  };

  return (
    <UserContext.Provider value={{ userData, claimScholarship, updateSavings }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
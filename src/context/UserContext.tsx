import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

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
  const [userData, setUserData] = useState<UserData>({
    monthlyIncome: 50000,
    monthlyExpenses: 28000,
    totalDebt: 500000,
    totalSavings: 120000,
    investmentValue: 85000,
    emiAmount: 10500,
    scholarshipClaimed: false,
  });

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
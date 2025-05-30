import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type WorkEntry = {
  id: string;
  userId: string;
  date: string;
  regularDays: number;
  weekendDays: number;
  holidayDays: number;
  notes: string;
};

type WorkDataContextType = {
  entries: WorkEntry[];
  addEntry: (entry: Omit<WorkEntry, 'id' | 'userId'>) => void;
  updateEntry: (id: string, entry: Partial<Omit<WorkEntry, 'id' | 'userId'>>) => void;
  deleteEntry: (id: string) => void;
  calculateTotalSalary: () => number;
  calculateSalaryForEntry: (entry: WorkEntry) => number;
};

const WorkDataContext = createContext<WorkDataContextType | undefined>(undefined);

export const WorkDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<WorkEntry[]>([]);

  useEffect(() => {
    if (user) {
      // Load user's work entries
      const storedEntries = localStorage.getItem(`workEntries-${user.id}`);
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } else {
      setEntries([]);
    }
  }, [user]);

  // Save entries to local storage
  const saveEntries = (updatedEntries: WorkEntry[]) => {
    if (user) {
      localStorage.setItem(`workEntries-${user.id}`, JSON.stringify(updatedEntries));
    }
  };

  const addEntry = (entry: Omit<WorkEntry, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newEntry: WorkEntry = {
      id: `entry-${Date.now()}`,
      userId: user.id,
      ...entry
    };
    
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    saveEntries(updatedEntries);
  };

  const updateEntry = (id: string, entryData: Partial<Omit<WorkEntry, 'id' | 'userId'>>) => {
    const updatedEntries = entries.map(entry => {
      if (entry.id === id) {
        return { ...entry, ...entryData };
      }
      return entry;
    });
    
    setEntries(updatedEntries);
    saveEntries(updatedEntries);
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    saveEntries(updatedEntries);
  };

  const calculateSalaryForEntry = (entry: WorkEntry) => {
    if (!user) return 0;
    
    const regularRate = user.hourlyRate * 8; // Assuming 8 hours per day
    const weekendRate = regularRate * 1.5; // 1.5x for weekends
    const holidayRate = regularRate * 2; // 2x for holidays
    
    return (
      entry.regularDays * regularRate +
      entry.weekendDays * weekendRate +
      entry.holidayDays * holidayRate
    );
  };

  const calculateTotalSalary = () => {
    return entries.reduce((total, entry) => {
      return total + calculateSalaryForEntry(entry);
    }, 0);
  };

  return (
    <WorkDataContext.Provider 
      value={{ 
        entries, 
        addEntry, 
        updateEntry, 
        deleteEntry,
        calculateTotalSalary,
        calculateSalaryForEntry
      }}
    >
      {children}
    </WorkDataContext.Provider>
  );
};

export const useWorkData = () => {
  const context = useContext(WorkDataContext);
  if (context === undefined) {
    throw new Error('useWorkData must be used within a WorkDataProvider');
  }
  return context;
};
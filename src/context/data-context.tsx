
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { products as initialProducts, transactions as initialTransactions, Product, Transaction } from '@/lib/data';

interface DataContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addTransactions: (newTransactions: Transaction[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addTransactions = (newTransactions: Transaction[]) => {
    setTransactions(prev => [...prev, ...newTransactions]);
  };

  return (
    <DataContext.Provider value={{ products, setProducts, transactions, setTransactions, addTransactions }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

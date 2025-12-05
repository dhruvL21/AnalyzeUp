'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, PurchaseOrder, Supplier, Transaction } from '@/lib/types';
import { mockProducts } from '@/lib/mock-products';
import { mockOrders } from '@/lib/mock-orders';
import { mockSuppliers } from '@/lib/mock-suppliers';
import { mockTransactions } from '@/lib/mock-transactions';
import { useToast } from '@/hooks/use-toast';

interface DataContextProps {
  products: Product[];
  orders: PurchaseOrder[];
  suppliers: Supplier[];
  transactions: Transaction[];
  addProduct: (product: Omit<Product, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addOrder: (order: Omit<PurchaseOrder, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => void;
  deleteOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => void;
  deleteSupplier: (supplierId: string) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

// Helper functions to interact with localStorage
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return fallback;
  }
};

const saveToStorage = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const item = JSON.stringify(value);
    window.localStorage.setItem(key, item);
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};


export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setProducts(loadFromStorage('products', mockProducts));
    setOrders(loadFromStorage('orders', mockOrders));
    setSuppliers(loadFromStorage('suppliers', mockSuppliers));
    setTransactions(loadFromStorage('transactions', mockTransactions));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
        saveToStorage('products', products);
    }
  }, [products, isLoading]);

  useEffect(() => {
    if (!isLoading) {
        saveToStorage('orders', orders);
    }
  }, [orders, isLoading]);

  useEffect(() => {
     if (!isLoading) {
        saveToStorage('suppliers', suppliers);
    }
  }, [suppliers, isLoading]);
  
  useEffect(() => {
    if (!isLoading) {
       saveToStorage('transactions', transactions);
   }
 }, [transactions, isLoading]);


  const addProduct = (productData: Omit<Product, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      id: `PROD${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
      tenantId: 'tenant-1',
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      averageDailySales: Math.floor(Math.random() * 10) + 1, // Mock data
      leadTimeDays: Math.floor(Math.random() * 10) + 5, // Mock data
    };
    setProducts(prev => [newProduct, ...prev]);
    toast({ title: 'Product Added', description: `${newProduct.name} has been added.` });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    toast({ title: 'Product Updated', description: `${updatedProduct.name} has been updated.` });
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({ title: 'Product Deleted', description: 'The product has been removed.' });
  };

  const addOrder = (orderData: Omit<PurchaseOrder, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: PurchaseOrder = {
        id: `PO-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
        tenantId: 'tenant-1',
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    const supplierName = suppliers.find(s => s.id === newOrder.supplierId)?.name || 'the supplier';
    toast({ title: 'Order Created', description: `New purchase order for ${supplierName} has been created.` });
  }

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    toast({ title: 'Order Deleted', description: 'The purchase order has been removed.' });
  }

  const updateOrderStatus = (orderId: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    toast({ title: 'Order Status Updated', description: `Order ${orderId} has been marked as ${status}.` });
  }
  
  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
     if (suppliers.find((s) => s.name === supplierData.name)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'A supplier with this name already exists.',
      });
      return;
    }
    const newSupplier: Supplier = {
      id: `SUP${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
      tenantId: 'tenant-1',
      ...supplierData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    toast({ title: 'Supplier Added', description: `${newSupplier.name} has been added.` });
  }

  const deleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    toast({ title: 'Supplier Deleted', description: 'The supplier has been removed.' });
  }


  return (
    <DataContext.Provider value={{ 
        products, 
        orders, 
        suppliers, 
        transactions, 
        addProduct, 
        updateProduct, 
        deleteProduct,
        addOrder,
        deleteOrder,
        updateOrderStatus,
        addSupplier,
        deleteSupplier,
        isLoading
    }}>
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

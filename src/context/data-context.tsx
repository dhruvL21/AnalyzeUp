'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, PurchaseOrder, Supplier, Transaction, Category } from '@/lib/types';
import { mockProducts } from '@/lib/mock-products';
import { mockOrders } from '@/lib/mock-orders';
import { mockSuppliers } from '@/lib/mock-suppliers';
import { mockTransactions } from '@/lib/mock-transactions';
import { useToast } from '@/hooks/use-toast';

// Mock categories for the form dropdowns
const mockCategories: Category[] = [
    { id: 'tops', name: 'Tops', description: '' },
    { id: 'bottoms', name: 'Bottoms', description: '' },
    { id: 'accessories', name: 'Accessories', description: '' },
    { id: 'essentials', name: 'Essentials', description: '' },
];


interface DataContextProps {
  products: Product[];
  orders: PurchaseOrder[];
  suppliers: Supplier[];
  transactions: Transaction[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addOrder: (order: Omit<PurchaseOrder, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => void;
  deleteOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => void;
  deleteSupplier: (supplierId: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};


export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [products, setProducts] = useLocalStorage<Product[]>('products', mockProducts);
  const [orders, setOrders] = useLocalStorage<PurchaseOrder[]>('orders', mockOrders);
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('suppliers', mockSuppliers);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', mockTransactions);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', mockCategories);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for a bit to avoid flash of empty content
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      id: `CAT-${Date.now()}`,
      ...categoryData,
    };
    setCategories(prev => [newCategory, ...prev]);
  };


  const addProduct = (productData: Omit<Product, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      id: `PROD${Date.now()}`,
      tenantId: 'local-tenant',
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      averageDailySales: Math.floor(Math.random() * 10) + 1,
      leadTimeDays: Math.floor(Math.random() * 10) + 5,
    };
    setProducts(prev => [newProduct, ...prev]);
    toast({ title: 'Product Added', description: `${newProduct.name} has been added.` });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? { ...updatedProduct, updatedAt: new Date().toISOString()} : p));
    toast({ title: 'Product Updated', description: `${updatedProduct.name} has been updated.` });
  };
  
  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({ title: 'Product Deleted', description: 'The product has been removed.' });
  };

  const addOrder = (orderData: Omit<PurchaseOrder, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: PurchaseOrder = {
        id: `PO-${Date.now()}`,
        tenantId: 'local-tenant',
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);

     const newTransaction: Transaction = {
        id: `TRN-${Date.now()}`,
        tenantId: 'local-tenant',
        productId: newOrder.productId,
        locationId: 'MAIN-WAREHOUSE',
        type: 'Purchase',
        quantity: newOrder.quantity,
        transactionDate: newOrder.orderDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    const supplierName = suppliers.find(s => s.id === newOrder.supplierId)?.name || 'the supplier';
    toast({ title: 'Order Created', description: `New purchase order for ${supplierName} has been created.` });
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    toast({ title: 'Order Deleted', description: 'The purchase order has been removed.' });
  };

  const updateOrderStatus = (orderId: string, status: string) => {
     setOrders(prevOrders => {
        const orderToUpdate = prevOrders.find(o => o.id === orderId);
        if (!orderToUpdate) return prevOrders;

        const updatedOrders = prevOrders.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o);

        if (status === 'Fulfilled') {
            setProducts(prevProducts => {
                return prevProducts.map(p => {
                    if (p.id === orderToUpdate.productId) {
                        return { ...p, stock: p.stock + orderToUpdate.quantity };
                    }
                    return p;
                });
            });
            toast({ title: 'Order Fulfilled', description: `Order ${orderId} marked as fulfilled and stock updated.` });
        } else {
             toast({ title: 'Order Status Updated', description: `Order ${orderId} has been marked as ${status}.` });
        }
        
        return updatedOrders;
    });
  };

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
      id: `SUP-${Date.now()}`,
      tenantId: 'local-tenant',
      ...supplierData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    toast({ title: 'Supplier Added', description: `${newSupplier.name} has been added.` });
  };

  const deleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    toast({ title: 'Supplier Deleted', description: 'The supplier has been removed.' });
  };

  const value = {
    products,
    orders,
    suppliers,
    transactions,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    deleteOrder,
    updateOrderStatus,
    addSupplier,
    deleteSupplier,
    addCategory,
    isLoading,
  };

  return (
    <DataContext.Provider value={value}>
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

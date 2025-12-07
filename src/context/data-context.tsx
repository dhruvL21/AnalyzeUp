
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
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
  addSupplier: (supplier: Omit<Supplier, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => Supplier | undefined;
  deleteSupplier: (supplierId: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => Category;
  isLoading: boolean;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockOrders);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const isLoading = false;


  const addCategory = useCallback((categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      id: `CAT-${Date.now()}`,
      ...categoryData,
    };
    setCategories(prev => [newCategory, ...prev]);
    return newCategory;
  }, []);


  const addProduct = useCallback((productData: Omit<Product, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      id: `PROD-${Date.now()}`,
      tenantId: 'local-tenant',
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      averageDailySales: Math.floor(Math.random() * 10) + 1,
      leadTimeDays: Math.floor(Math.random() * 10) + 5,
    };
    setProducts(prev => [newProduct, ...prev]);
    toast({ title: 'Product Added', description: `${newProduct.name} has been added.` });
  }, [toast]);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? { ...updatedProduct, updatedAt: new Date().toISOString()} : p));
    toast({ title: 'Product Updated', description: `${updatedProduct.name} has been updated.` });
  }, [toast]);
  
  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({ title: 'Product Deleted', description: 'The product has been removed.' });
  }, [toast]);

  const addOrder = useCallback((orderData: Omit<PurchaseOrder, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
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
  }, [toast, suppliers]);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    toast({ title: 'Order Deleted', description: 'The purchase order has been removed.' });
  }, [toast]);

  const updateOrderStatus = useCallback((orderId: string, status: string) => {
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
  }, [toast]);

  const addSupplier = useCallback((supplierData: Omit<Supplier, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
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
    return newSupplier;
  }, [toast, suppliers]);

  const deleteSupplier = useCallback((supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    toast({ title: 'Supplier Deleted', description: 'The supplier has been removed.' });
  }, [toast]);

  const value = useMemo(() => ({
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
  }), [
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
    isLoading
  ]);

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

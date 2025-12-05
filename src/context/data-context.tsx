'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product, PurchaseOrder, Supplier, Transaction } from '@/lib/types';
import { useMemoFirebase, useCollection, useUser, useFirestore } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
    addDocumentNonBlocking,
    updateDocumentNonBlocking,
    deleteDocumentNonBlocking,
    setDocumentNonBlocking
} from '@/firebase';


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

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const tenantId = user?.uid;

  const productsRef = useMemoFirebase(
    () => (firestore && tenantId ? collection(firestore, 'tenants', tenantId, 'products') : null),
    [firestore, tenantId]
  );
  const { data: products = [], isLoading: productsLoading } = useCollection<Product>(productsRef);

  const ordersRef = useMemoFirebase(
    () => (firestore && tenantId ? collection(firestore, 'tenants', tenantId, 'purchaseOrders') : null),
    [firestore, tenantId]
  );
  const { data: orders = [], isLoading: ordersLoading } = useCollection<PurchaseOrder>(ordersRef);

  const suppliersRef = useMemoFirebase(
    () => (firestore && tenantId ? collection(firestore, 'tenants', tenantId, 'suppliers') : null),
    [firestore, tenantId]
  );
  const { data: suppliers = [], isLoading: suppliersLoading } = useCollection<Supplier>(suppliersRef);
  
  const transactionsRef = useMemoFirebase(
    () => (firestore && tenantId ? collection(firestore, 'tenants', tenantId, 'inventoryTransactions') : null),
    [firestore, tenantId]
  );
  const { data: transactions = [], isLoading: transactionsLoading } = useCollection<Transaction>(transactionsRef);

  const isLoading = isUserLoading || productsLoading || ordersLoading || suppliersLoading || transactionsLoading;

 const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    if (!firestore || !tenantId) return;
    const newDocRef = doc(collection(firestore, 'tenants', tenantId, 'products'));
    const newProduct: Product = {
      id: newDocRef.id,
      tenantId: tenantId,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      averageDailySales: Math.floor(Math.random() * 10) + 1,
      leadTimeDays: Math.floor(Math.random() * 10) + 5,
    };
    setDocumentNonBlocking(newDocRef, newProduct, {});
    toast({ title: 'Product Added', description: `${newProduct.name} has been added.` });
  }, [firestore, tenantId, toast]);

  const updateProduct = useCallback(async (updatedProduct: Product) => {
    if (!firestore || !tenantId) return;
    const docRef = doc(firestore, 'tenants', tenantId, 'products', updatedProduct.id);
    updateDocumentNonBlocking(docRef, {
        ...updatedProduct,
        updatedAt: new Date().toISOString(),
    });
    toast({ title: 'Product Updated', description: `${updatedProduct.name} has been updated.` });
  }, [firestore, tenantId, toast]);
  
  const deleteProduct = useCallback(async (productId: string) => {
    if (!firestore || !tenantId) return;
    const docRef = doc(firestore, 'tenants', tenantId, 'products', productId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: 'Product Deleted', description: 'The product has been removed.' });
  }, [firestore, tenantId, toast]);


  const addOrder = useCallback(async (orderData: Omit<PurchaseOrder, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    if (!firestore || !tenantId) return;

    const batch = writeBatch(firestore);
    
    // 1. Create the new purchase order
    const orderRef = doc(collection(firestore, 'tenants', tenantId, 'purchaseOrders'));
    const newOrder: PurchaseOrder = {
        id: orderRef.id,
        tenantId: tenantId,
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    batch.set(orderRef, newOrder);

    // 2. Create a corresponding inventory transaction
    const transactionRef = doc(collection(firestore, 'tenants', tenantId, 'inventoryTransactions'));
    const newTransaction: Transaction = {
        id: transactionRef.id,
        tenantId: tenantId,
        productId: newOrder.productId,
        locationId: 'MAIN-WAREHOUSE', // Assuming a default location
        type: 'Purchase',
        quantity: newOrder.quantity,
        transactionDate: newOrder.orderDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    batch.set(transactionRef, newTransaction);
    
    try {
        await batch.commit();
        const supplierName = suppliers.find(s => s.id === newOrder.supplierId)?.name || 'the supplier';
        toast({ title: 'Order Created', description: `New purchase order for ${supplierName} has been created.` });
    } catch(e) {
        console.error("Failed to create order and transaction: ", e);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not create order.' });
    }
  }, [firestore, tenantId, toast, suppliers]);

  const deleteOrder = useCallback(async (orderId: string) => {
    if (!firestore || !tenantId) return;
    const docRef = doc(firestore, 'tenants', tenantId, 'purchaseOrders', orderId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: 'Order Deleted', description: 'The purchase order has been removed.' });
  }, [firestore, tenantId, toast]);

  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    if (!firestore || !tenantId || status !== 'Fulfilled') {
        if(status !== 'Fulfilled') {
             const docRef = doc(firestore, 'tenants', tenantId, 'purchaseOrders', orderId);
            updateDocumentNonBlocking(docRef, { status: status, updatedAt: new Date().toISOString() });
            toast({ title: 'Order Status Updated', description: `Order ${orderId} has been marked as ${status}.` });
        }
        return;
    };
    
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;
    
    const batch = writeBatch(firestore);

    // 1. Update order status
    const orderRef = doc(firestore, 'tenants', tenantId, 'purchaseOrders', orderId);
    batch.update(orderRef, { status: 'Fulfilled', updatedAt: new Date().toISOString() });

    // 2. Update product stock
    const productRef = doc(firestore, 'tenants', tenantId, 'products', orderToUpdate.productId);
    const product = products.find(p => p.id === orderToUpdate.productId);
    if (product) {
        const newStock = product.stock + orderToUpdate.quantity;
        batch.update(productRef, { stock: newStock });
    }

    try {
        await batch.commit();
        toast({ title: 'Order Fulfilled', description: `Order ${orderId} marked as fulfilled and stock updated.` });
    } catch (e) {
        console.error("Failed to fulfill order: ", e);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fulfill order.' });
    }
  }, [firestore, tenantId, toast, orders, products]);

  const addSupplier = useCallback(async (supplierData: Omit<Supplier, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    if (!firestore || !tenantId) return;
    if (suppliers.find((s) => s.name === supplierData.name)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'A supplier with this name already exists.',
      });
      return;
    }
    const newDocRef = doc(collection(firestore, 'tenants', tenantId, 'suppliers'));
    const newSupplier: Supplier = {
      id: newDocRef.id,
      tenantId: tenantId,
      ...supplierData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDocumentNonBlocking(newDocRef, newSupplier, {});
    toast({ title: 'Supplier Added', description: `${newSupplier.name} has been added.` });
  }, [firestore, tenantId, toast, suppliers]);

  const deleteSupplier = useCallback(async (supplierId: string) => {
    if (!firestore || !tenantId) return;
    const docRef = doc(firestore, 'tenants', tenantId, 'suppliers', supplierId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: 'Supplier Deleted', description: 'The supplier has been removed.' });
  }, [firestore, tenantId, toast]);

  const value = {
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

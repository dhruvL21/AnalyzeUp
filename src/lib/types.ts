
import { FieldValue } from 'firebase/firestore';

export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
}

export interface Tenant {
  id: string;
  name: string;
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  sku: string;
  categoryId: string;
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
  stock: number;
  price: number;
  imageUrl: string;
  supplierId: string;
  averageDailySales: number;
  leadTimeDays: number;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
}

export interface Location {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  address: string;
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
}

export interface Transaction {
  id: string;
  tenantId: string;
  productId: string;
  locationId: string;
  type: 'Sale' | 'Purchase';
  quantity: number;
  transactionDate: FieldValue | Date;
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
}

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
}

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: string;
  productId: string;
a  quantity: number;
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
}

    
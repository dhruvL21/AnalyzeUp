
import { FieldValue, Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: FieldValue | Date | string;
  updatedAt: FieldValue | Date | string;
}

export interface Tenant {
  id: string;
  name: string;
  createdAt: FieldValue | Date | string;
  updatedAt: FieldValue | Date | string;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  sku: string;
  categoryId: string;
  createdAt: FieldValue | Date | string | Timestamp;
  updatedAt: FieldValue | Date | string | Timestamp;
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
  createdAt: FieldValue | Date | string | Timestamp;
  updatedAt: FieldValue | Date | string | Timestamp;
}

export interface Location {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  address: string;
  createdAt: FieldValue | Date | string | Timestamp;
  updatedAt: FieldValue | Date | string | Timestamp;
}

export interface Transaction {
  id: string;
  tenantId: string;
  productId: string;
  locationId: string;
  type: 'Sale' | 'Purchase';
  quantity: number;
  transactionDate: FieldValue | Date | string | Timestamp;
  createdAt: FieldValue | Date | string | Timestamp;
  updatedAt: FieldValue | Date | string | Timestamp;
}

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: FieldValue | Date | string | Timestamp;
  updatedAt: FieldValue | Date | string | Timestamp;
}

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: string;
  productId: string;
  quantity: number;
  createdAt: FieldValue | Date | string | Timestamp;
  updatedAt: FieldValue | Date | string | Timestamp;
}

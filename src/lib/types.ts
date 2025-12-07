
export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  sku: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  stock: number;
  price: number;
  imageUrl: string;
  supplierId: string;
  averageDailySales: number;
  leadTimeDays: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Location {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  tenantId: string;
  productId: string;
  locationId: string;
  type: 'Sale' | 'Purchase';
  quantity: number;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

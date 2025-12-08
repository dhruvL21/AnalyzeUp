
import { z } from 'zod';

// Base schema for document ID
const DocumentIdSchema = z.string().min(1, { message: "ID is required." });

// Zod schema for Product
export const ProductSchema = z.object({
  id: DocumentIdSchema,
  name: z.string().min(1, { message: "Product name is required." }),
  description: z.string().optional(),
  sku: z.string().optional(),
  categoryId: z.string().optional(),
  stock: z.number().min(0, { message: "Stock cannot be negative." }),
  price: z.number().min(0, { message: "Price cannot be negative." }),
  imageUrl: z.string().url({ message: "Invalid URL format." }).optional(),
  supplierId: z.string().optional(),
  averageDailySales: z.number().min(0).optional(),
  leadTimeDays: z.number().min(0).optional(),
  userId: z.string().optional(),
});

// Zod schema for Category
export const CategorySchema = z.object({
  id: DocumentIdSchema,
  name: z.string().min(1, { message: "Category name is required." }),
  description: z.string().optional(),
  userId: z.string().optional(),
});

// Zod schema for Transaction
export const TransactionSchema = z.object({
  id: DocumentIdSchema.optional(),
  productId: DocumentIdSchema,
  locationId: z.string().optional(),
  type: z.enum(['Sale', 'Purchase']),
  quantity: z.number().positive({ message: "Quantity must be positive." }),
  transactionDate: z.string().datetime({ message: "Invalid date format." }),
  userId: z.string().optional(),
});

// Zod schema for Supplier
export const SupplierSchema = z.object({
  id: DocumentIdSchema,
  name: z.string().min(1, { message: "Supplier name is required." }),
  contactName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
  address: z.string().optional(),
  userId: z.string().optional(),
});

// Zod schema for PurchaseOrder
export const PurchaseOrderSchema = z.object({
  id: DocumentIdSchema,
  supplierId: DocumentIdSchema,
  orderDate: z.string().datetime({ message: "Invalid date format." }),
  expectedDeliveryDate: z.string().datetime({ message: "Invalid date format." }).optional(),
  status: z.enum(['Pending', 'Fulfilled', 'Cancelled']),
  productId: DocumentIdSchema,
  quantity: z.number().positive({ message: "Quantity must be positive." }),
  userId: z.string().optional(),
});

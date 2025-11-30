export type Product = {
  id: string;
  name: string;
  stock: number;
  averageDailySales: number;
  leadTimeDays: number;
  category: string;
  supplier: string;
};

export const products: Product[] = [
  {
    id: "PROD001",
    name: "Classic T-Shirt",
    stock: 50,
    averageDailySales: 5,
    leadTimeDays: 10,
    category: "Apparel",
    supplier: "FashionHub",
  },
  {
    id: "PROD002",
    name: "Wireless Headphones",
    stock: 15,
    averageDailySales: 2,
    leadTimeDays: 14,
    category: "Electronics",
    supplier: "ElectroGadget",
  },
  {
    id: "PROD003",
    name: "Coffee Beans 1kg",
    stock: 100,
    averageDailySales: 10,
    leadTimeDays: 7,
    category: "Groceries",
    supplier: "BeanThere",
  },
  {
    id: "PROD004",
    name: "Leather Wallet",
    stock: 8,
    averageDailySales: 1,
    leadTimeDays: 20,
    category: "Accessories",
    supplier: "FineLeather",
  },
  {
    id: "PROD005",
    name: "Smartwatch SE",
    stock: 25,
    averageDailySales: 3,
    leadTimeDays: 12,
    category: "Electronics",
    supplier: "TechCorp",
  },
];

export const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
];

export const transactions = [
  {
    id: "TRN001",
    productName: "Classic T-Shirt",
    type: "Sale",
    quantity: 2,
    date: "2024-06-23",
  },
  {
    id: "TRN002",
    productName: "Coffee Beans 1kg",
    type: "Purchase",
    quantity: 50,
    date: "2024-06-22",
  },
  {
    id: "TRN003",
    productName: "Wireless Headphones",
    type: "Sale",
    quantity: 1,
    date: "2024-06-22",
  },
  {
    id: "TRN004",
    productName: "Leather Wallet",
    type: "Sale",
    quantity: 1,
    date: "2024-06-21",
  },
  {
    id: "TRN005",
    productName: "Smartwatch SE",
    type: "Purchase",
    quantity: 20,
    date: "2024-06-20",
  },
];

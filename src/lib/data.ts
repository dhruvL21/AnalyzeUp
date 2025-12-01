export type Product = {
  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  averageDailySales: number;
  leadTimeDays: number;
  category: string;
  supplier: string;
  imageUrl: string;
};

export type Transaction = {
  id: string;
  productName: string;
  type: 'Sale' | 'Purchase';
  quantity: number;
  date: string;
};

export const products: Product[] = [
  {
    id: "PROD001",
    name: "Organic Bananas",
    description: "A bunch of fresh, organic bananas. Perfect for a healthy snack or adding to smoothies. Rich in potassium and other essential nutrients.",
    stock: 150,
    price: 1.29,
    averageDailySales: 25,
    leadTimeDays: 2,
    category: "Fresh Produce",
    supplier: "FreshHarvest Co.",
    imageUrl: "https://images.unsplash.com/photo-1571771894824-269f8cbc8927?q=80&w=800",
  },
  {
    id: "PROD002",
    name: "Whole Milk, 1 Gallon",
    description: "Fresh whole milk, pasteurized and homogenized. A great source of calcium and vitamin D. Essential for any kitchen.",
    stock: 75,
    price: 3.49,
    averageDailySales: 15,
    leadTimeDays: 3,
    category: "Dairy & Eggs",
    supplier: "GreenPastures Dairy",
    imageUrl: "https://images.unsplash.com/photo-1620189507195-68309c04c4d8?q=80&w=800",
  },
  {
    id: "PROD003",
    name: "Artisan Sourdough Bread",
    description: "A freshly baked loaf of artisan sourdough bread with a crispy crust and a soft, chewy interior. Made with natural starter.",
    stock: 40,
    price: 5.99,
    averageDailySales: 20,
    leadTimeDays: 1,
    category: "Bakery",
    supplier: "The Millstone Bakery",
    imageUrl: "https://images.unsplash.com/photo-1533087352382-2e06ab62b88b?q=80&w=800",
  },
  {
    id: "PROD004",
    name: "Cage-Free Large Brown Eggs",
    description: "One dozen large brown eggs from cage-free hens. Ideal for baking, breakfast, or any meal. Farm-fresh quality you can taste.",
    stock: 120,
    price: 4.29,
    averageDailySales: 30,
    leadTimeDays: 4,
    category: "Dairy & Eggs",
    supplier: "HappyHen Farms",
    imageUrl: "https://images.unsplash.com/photo-1598965775869-239019218e8d?q=80&w=800",
  },
  {
    id: "PROD005",
    name: "Natural Creamy Peanut Butter",
    description: "A 16oz jar of all-natural creamy peanut butter. Made with just peanuts and a pinch of salt. No added sugar or oils.",
    stock: 90,
    price: 4.79,
    averageDailySales: 10,
    leadTimeDays: 10,
    category: "Pantry Staples",
    supplier: "Nuts & More",
    imageUrl: "https://images.unsplash.com/photo-1606313564202-5cf5b823c939?q=80&w=800",
  },
  {
    id: "PROD006",
    name: "Organic Hass Avocados",
    description: "A bag of three large, ripe organic Hass avocados. Creamy and delicious, perfect for toast, guacamole, or salads.",
    stock: 18,
    price: 6.99,
    averageDailySales: 18,
    leadTimeDays: 3,
    category: "Fresh Produce",
    supplier: "FreshHarvest Co.",
    imageUrl: "https://images.unsplash.com/photo-1601039641847-7857b994d704?q=80&w=800",
  },
  {
    id: "PROD007",
    name: "Greek Yogurt, Plain",
    description: "A 32oz tub of thick and creamy plain Greek yogurt. High in protein and perfect for breakfast bowls or as a sour cream substitute.",
    stock: 60,
    price: 5.49,
    averageDailySales: 12,
    leadTimeDays: 5,
    category: "Dairy & Eggs",
    supplier: "GreenPastures Dairy",
    imageUrl: "https://images.unsplash.com/photo-1562119422-5a522932005c?q=80&w=800",
  },
  {
    id: "PROD008",
    name: "Organic Baby Spinach",
    description: "A 5oz container of pre-washed organic baby spinach. Tender and flavorful, ready to use in salads, smoothies, or sautés.",
    stock: 50,
    price: 3.99,
    averageDailySales: 15,
    leadTimeDays: 2,
    category: "Fresh Produce",
    supplier: "FreshHarvest Co.",
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f21fb?q=80&w=800",
  },
  {
    id: "PROD009",
    name: "Fair-Trade Dark Roast Coffee",
    description: "A 12oz bag of whole bean fair-trade dark roast coffee. Bold and rich flavor with notes of chocolate and nuts.",
    stock: 80,
    price: 12.99,
    averageDailySales: 8,
    leadTimeDays: 14,
    category: "Pantry Staples",
    supplier: "The Daily Grind",
    imageUrl: "https://images.unsplash.com/photo-1599321612009-4b6770435311?q=80&w=800",
  },
  {
    id: "PROD010",
    name: "Organic Fuji Apples",
    description: "A 3lb bag of crisp and sweet organic Fuji apples. Excellent for snacking, baking, or adding to salads.",
    stock: 95,
    price: 4.99,
    averageDailySales: 10,
    leadTimeDays: 5,
    category: "Fresh Produce",
    supplier: "Orchard Fresh",
    imageUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800",
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

export const transactions: Transaction[] = [
  {
    id: "TRN001",
    productName: "Organic Bananas",
    type: "Sale",
    quantity: 5,
    date: "2024-06-23",
  },
  {
    id: "TRN002",
    productName: "Whole Milk, 1 Gallon",
    type: "Purchase",
    quantity: 30,
    date: "2024-06-22",
  },
  {
    id: "TRN003",
    productName: "Artisan Sourdough Bread",
    type: "Sale",
    quantity: 10,
    date: "2024-06-22",
  },
  {
    id: "TRN004",
    productName: "Cage-Free Large Brown Eggs",
    type: "Sale",
    quantity: 12,
    date: "2024-06-21",
  },
  {
    id: "TRN005",
    productName: "Natural Creamy Peanut Butter",
    type: "Purchase",
    quantity: 50,
    date: "2024-06-20",
  },
];

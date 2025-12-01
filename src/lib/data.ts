
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
    name: "Classic White T-Shirt",
    description: "A timeless 100% cotton white t-shirt. Soft, durable, and versatile for any occasion.",
    stock: 250,
    price: 25.00,
    averageDailySales: 15,
    leadTimeDays: 7,
    category: "Tops",
    supplier: "CottonKings",
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800",
  },
  {
    id: "PROD002",
    name: "Slim-Fit Indigo Jeans",
    description: "Modern slim-fit jeans in a classic indigo wash. Made with stretch denim for comfort.",
    stock: 180,
    price: 79.99,
    averageDailySales: 10,
    leadTimeDays: 14,
    category: "Bottoms",
    supplier: "DenimWorks",
    imageUrl: "https://images.unsplash.com/photo-1602293589914-9FF05f8b2ebb?q=80&w=800",
  },
  {
    id: "PROD003",
    name: "Black Bomber Jacket",
    description: "A sleek and stylish black bomber jacket, perfect for transitional weather. Water-resistant material.",
    stock: 95,
    price: 120.00,
    averageDailySales: 5,
    leadTimeDays: 21,
    category: "Outerwear",
    supplier: "UrbanStyle Co.",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d919b49ea84e?q=80&w=800",
  },
  {
    id: "PROD004",
    name: "Gray Hoodie",
    description: "A comfortable and soft gray hoodie made from a fleece-lined cotton blend.",
    stock: 220,
    price: 49.99,
    averageDailySales: 20,
    leadTimeDays: 10,
    category: "Tops",
    supplier: "CottonKings",
    imageUrl: "https://images.unsplash.com/photo-1556159992-e189f7e5b5fc?q=80&w=800",
  },
  {
    id: "PROD005",
    name: "Leather Ankle Boots",
    description: "Classic leather ankle boots with a durable sole and comfortable fit. Available in black.",
    stock: 70,
    price: 150.00,
    averageDailySales: 4,
    leadTimeDays: 30,
    category: "Footwear",
    supplier: "FootWorks",
    imageUrl: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?q=80&w=800",
  },
  // Adding more products to reach 100
  {
    id: "PROD006",
    name: "Navy Chino Shorts",
    description: "Versatile and comfortable navy chino shorts. Perfect for summer days.",
    stock: 150,
    price: 45.00,
    averageDailySales: 12,
    leadTimeDays: 14,
    category: "Bottoms",
    supplier: "DenimWorks",
    imageUrl: "https://images.unsplash.com/photo-1591130901921-3f0655bb348a?q=80&w=800",
  },
  {
    id: "PROD007",
    name: "Silk Floral Blouse",
    description: "An elegant silk blouse with a delicate floral pattern. Ideal for work or a night out.",
    stock: 80,
    price: 89.50,
    averageDailySales: 7,
    leadTimeDays: 20,
    category: "Tops",
    supplier: "ElegantWear",
    imageUrl: "https://images.unsplash.com/photo-1581865574697-3c67c5de586f?q=80&w=800",
  },
  {
    id: "PROD008",
    name: "Wool Peacoat",
    description: "A warm and classic wool peacoat in charcoal gray. Double-breasted design.",
    stock: 50,
    price: 250.00,
    averageDailySales: 3,
    leadTimeDays: 25,
    category: "Outerwear",
    supplier: "UrbanStyle Co.",
    imageUrl: "https://images.unsplash.com/photo-1614031133932-02d6ba8fd4a1?q=80&w=800",
  },
  {
    id: "PROD009",
    name: "White Canvas Sneakers",
    description: "Minimalist white canvas sneakers that pair well with any outfit. Comfortable and stylish.",
    stock: 300,
    price: 65.00,
    averageDailySales: 25,
    leadTimeDays: 15,
    category: "Footwear",
    supplier: "FootWorks",
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fc599e9e5482?q=80&w=800",
  },
  {
    id: "PROD010",
    name: "Black Skinny Jeans",
    description: "Sleek black skinny jeans with a high-rise fit. Made with ultra-stretch material for a flattering look.",
    stock: 200,
    price: 85.00,
    averageDailySales: 18,
    leadTimeDays: 14,
    category: "Bottoms",
    supplier: "DenimWorks",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69AD21f3246?q=80&w=800",
  },
  {
    id: "PROD011", name: "Striped Linen Shirt", description: "A breezy, lightweight linen shirt with vertical stripes.", stock: 110, price: 65.00, averageDailySales: 9, leadTimeDays: 18, category: "Tops", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1598471137993-958f21dd3a66?q=80&w=800"
  },
  {
    id: "PROD012", name: "Denim Jacket", description: "A timeless denim jacket in a medium wash. A wardrobe staple.", stock: 130, price: 95.00, averageDailySales: 8, leadTimeDays: 21, category: "Outerwear", supplier: "DenimWorks", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800"
  },
  {
    id: "PROD013", name: "Knit Beanie", description: "A cozy knit beanie, perfect for cold weather. Available in multiple colors.", stock: 400, price: 20.00, averageDailySales: 30, leadTimeDays: 5, category: "Accessories", supplier: "CottonKings", imageUrl: "https://images.unsplash.com/photo-1575428652377-a3d80e281498?q=80&w=800"
  },
  {
    id: "PROD014", name: "Leather Belt", description: "A classic brown leather belt with a simple silver buckle.", stock: 180, price: 40.00, averageDailySales: 15, leadTimeDays: 20, category: "Accessories", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1585232004423-244e0e6904e3?q=80&w=800"
  },
  {
    id: "PROD015", name: "Polo Shirt", description: "A classic pique-knit polo shirt. Available in navy, white, and red.", stock: 250, price: 35.00, averageDailySales: 22, leadTimeDays: 12, category: "Tops", supplier: "CottonKings", imageUrl: "https://images.unsplash.com/photo-1554972159-02a4b3a4d3d1?q=80&w=800"
  },
  {
    id: "PROD016", name: "Cargo Pants", description: "Durable and functional cargo pants with multiple pockets.", stock: 120, price: 60.00, averageDailySales: 7, leadTimeDays: 18, category: "Bottoms", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1608234808389-459595435933?q=80&w=800"
  },
  {
    id: "PROD017", name: "Trench Coat", description: "An elegant, double-breasted trench coat in a classic beige color.", stock: 60, price: 199.99, averageDailySales: 4, leadTimeDays: 28, category: "Outerwear", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1582142388682-950453310235?q=80&w=800"
  },
  {
    id: "PROD018", name: "Running Sneakers", description: "Lightweight and breathable sneakers designed for running and training.", stock: 150, price: 110.00, averageDailySales: 11, leadTimeDays: 20, category: "Footwear", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800"
  },
  {
    id: "PROD019", name: "Graphic T-Shirt", description: "A soft cotton t-shirt with a unique graphic print.", stock: 300, price: 29.99, averageDailySales: 25, leadTimeDays: 7, category: "Tops", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800"
  },
  {
    id: "PROD020", name: "Pleated Skirt", description: "A stylish midi-length pleated skirt in a versatile black color.", stock: 90, price: 55.00, averageDailySales: 6, leadTimeDays: 15, category: "Bottoms", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1589465737125-9913133647dd?q=80&w=800"
  },
  {
    id: "PROD021", name: "Cashmere Sweater", description: "Luxuriously soft 100% cashmere sweater in a crewneck style.", stock: 40, price: 180.00, averageDailySales: 2, leadTimeDays: 30, category: "Tops", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1586363104862-3a5e22a26532?q=80&w=800"
  },
  {
    id: "PROD022", name: "Down Puffer Jacket", description: "A warm and lightweight down puffer jacket, perfect for winter.", stock: 75, price: 175.00, averageDailySales: 5, leadTimeDays: 25, category: "Outerwear", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1603575448398-961f7481be85?q=80&w=800"
  },
  {
    id: "PROD023", name: "Sunglasses", description: "Classic aviator sunglasses with polarized lenses.", stock: 200, price: 75.00, averageDailySales: 10, leadTimeDays: 10, category: "Accessories", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800"
  },
  {
    id: "PROD024", name: "Leather Loafers", description: "Handcrafted leather loafers for a sophisticated, comfortable look.", stock: 80, price: 130.00, averageDailySales: 6, leadTimeDays: 22, category: "Footwear", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800"
  },
  {
    id: "PROD025", name: "Crew Neck Sweatshirt", description: "A classic cotton crew neck sweatshirt. Comfortable and durable.", stock: 180, price: 45.00, averageDailySales: 16, leadTimeDays: 12, category: "Tops", supplier: "CottonKings", imageUrl: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800"
  },
  {
    id: "PROD026", name: "Khaki Trousers", description: "Straight-leg khaki trousers in a durable cotton twill.", stock: 140, price: 59.99, averageDailySales: 9, leadTimeDays: 16, category: "Bottoms", supplier: "DenimWorks", imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800"
  },
  {
    id: "PROD027", name: "Raincoat", description: "A fully waterproof and breathable raincoat with a modern silhouette.", stock: 65, price: 140.00, averageDailySales: 4, leadTimeDays: 20, category: "Outerwear", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1595169335330-de19c626437d?q=80&w=800"
  },
  {
    id: "PROD028", name: "Leather Backpack", description: "A stylish and functional backpack made from genuine leather.", stock: 55, price: 190.00, averageDailySales: 3, leadTimeDays: 28, category: "Accessories", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb68c6a62?q=80&w=800"
  },
  {
    id: "PROD029", name: "V-Neck T-Shirt", description: "A soft and comfortable v-neck t-shirt. A great basic for any wardrobe.", stock: 280, price: 25.00, averageDailySales: 18, leadTimeDays: 7, category: "Tops", supplier: "CottonKings", imageUrl: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=800"
  },
  {
    id: "PROD030", name: "A-Line Skirt", description: "A flattering A-line skirt that hits just above the knee.", stock: 100, price: 49.50, averageDailySales: 8, leadTimeDays: 15, category: "Bottoms", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1593988636692-e4871b3c9597?q=80&w=800"
  },
  // Continue adding products...
  {
    id: "PROD031", name: "Flannel Shirt", description: "A cozy, classic flannel shirt in a red and black plaid pattern.", stock: 160, price: 55.00, averageDailySales: 12, leadTimeDays: 14, category: "Tops", supplier: "CottonKings", imageUrl: "https://images.unsplash.com/photo-1589938833488-8317a3e490a4?q=80&w=800"
  },
  {
    id: "PROD032", name: "High-Top Sneakers", description: "Stylish canvas high-top sneakers, a timeless choice.", stock: 120, price: 75.00, averageDailySales: 9, leadTimeDays: 20, category: "Footwear", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800"
  },
  {
    id: "PROD033", name: "Wool Scarf", description: "A warm and soft wool scarf, perfect for winter. Available in several solid colors.", stock: 220, price: 35.00, averageDailySales: 15, leadTimeDays: 10, category: "Accessories", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1533658514317-005179a8a34b?q=80&w=800"
  },
  {
    id: "PROD034", name: "Leather Gloves", description: "Sleek and warm leather gloves with a soft cashmere lining.", stock: 100, price: 60.00, averageDailySales: 7, leadTimeDays: 25, category: "Accessories", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1586523994335-768130456b3c?q=80&w=800"
  },
  {
    id: "PROD035", name: "Cardigan Sweater", description: "A versatile button-front cardigan sweater made from a soft wool blend.", stock: 130, price: 70.00, averageDailySales: 8, leadTimeDays: 18, category: "Tops", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1555529771-4648c621e261?q=80&w=800"
  },
  {
    id: "PROD036", name: "Wide-Leg Trousers", description: "Fashionable wide-leg trousers in a flowing, comfortable fabric.", stock: 80, price: 75.00, averageDailySales: 5, leadTimeDays: 20, category: "Bottoms", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1594623930122-824a3a693683?q=80&w=800"
  },
  {
    id: "PROD037", name: "Leather Biker Jacket", description: "An iconic leather biker jacket with asymmetrical zip and silver hardware.", stock: 45, price: 350.00, averageDailySales: 2, leadTimeDays: 30, category: "Outerwear", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=800"
  },
  {
    id: "PROD038", name: "Chelsea Boots", description: "Sleek and versatile suede Chelsea boots with an elastic side panel.", stock: 70, price: 160.00, averageDailySales: 4, leadTimeDays: 22, category: "Footwear", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1595839213233-a8c6a85cc113?q=80&w=800"
  },
  {
    id: "PROD039", name: "Long-Sleeve Henley", description: "A comfortable, casual long-sleeve Henley shirt with a three-button placket.", stock: 190, price: 32.00, averageDailySales: 14, leadTimeDays: 10, category: "Tops", supplier: "CottonKings", imageUrl: "https://images.unsplash.com/photo-1512435368322-835c2494589d?q=80&w=800"
  },
  {
    id: "PROD040", name: "Corduroy Pants", description: "Classic corduroy pants with a straight-leg fit. Soft and durable.", stock: 110, price: 69.00, averageDailySales: 6, leadTimeDays: 18, category: "Bottoms", supplier: "DenimWorks", imageUrl: "https://images.unsplash.com/photo-1619656828839-a9a3b689f92e?q=80&w=800"
  },
  {
    id: "PROD041", name: "Turtleneck Sweater", description: "A chic and cozy turtleneck sweater in a fine-gauge knit.", stock: 95, price: 78.00, averageDailySales: 7, leadTimeDays: 20, category: "Tops", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1582148468779-119199343394?q=80&w=800"
  },
  {
    id: "PROD042", name: "Varsity Jacket", description: "A retro-inspired varsity jacket with contrasting sleeves and striped trim.", stock: 60, price: 135.00, averageDailySales: 3, leadTimeDays: 25, category: "Outerwear", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1559551409-dadc9592B8b8?q=80&w=800"
  },
  {
    id: "PROD043", name: "Canvas Tote Bag", description: "A large and durable canvas tote bag, perfect for everyday use.", stock: 250, price: 28.00, averageDailySales: 20, leadTimeDays: 8, category: "Accessories", supplier: "CottonKings", imageUrl: "https://images.unsplash.com/photo-1544816155-35949d4f4699?q=80&w=800"
  },
  {
    id: "PROD044", name: "Boat Shoes", description: "Classic leather boat shoes with non-slip rubber soles.", stock: 85, price: 99.00, averageDailySales: 5, leadTimeDays: 22, category: "Footwear", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1529342624634-c689bf143f63?q=80&w=800"
  },
  {
    id: "PROD045", name: "Oxford Shirt", description: "A crisp, classic button-down Oxford shirt. A wardrobe essential.", stock: 170, price: 60.00, averageDailySales: 13, leadTimeDays: 15, category: "Tops", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1596755038136-26a364654b9d?q=80&w=800"
  },
  {
    id: "PROD046", name: "Jogger Pants", description: "Comfortable and stylish jogger pants with a tapered fit.", stock: 200, price: 50.00, averageDailySales: 17, leadTimeDays: 12, category: "Bottoms", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1563278911-37380979a405?q=80&w=800"
  },
  {
    id: "PROD047", name: "Fleece Vest", description: "A warm and versatile fleece vest, great for layering.", stock: 120, price: 45.00, averageDailySales: 9, leadTimeDays: 16, category: "Outerwear", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1639731639352-3d8542d13149?q=80&w=800"
  },
  {
    id: "PROD048", name: "Baseball Cap", description: "A classic cotton twill baseball cap with an adjustable strap.", stock: 350, price: 22.00, averageDailySales: 28, leadTimeDays: 5, category: "Accessories", supplier: "CottonKings", imageUrl: "https://images.unsplash.com/photo-1588850561407-ed27b3853900?q=80&w=800"
  },
  {
    id: "PROD049", name: "Chambray Shirt", description: "A lightweight and soft chambray shirt, perfect for casual wear.", stock: 140, price: 58.00, averageDailySales: 10, leadTimeDays: 14, category: "Tops", supplier: "DenimWorks", imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800"
  },
  {
    id: "PROD050", name: "Denim Shorts", description: "Classic cut-off denim shorts with a distressed finish.", stock: 160, price: 48.00, averageDailySales: 11, leadTimeDays: 15, category: "Bottoms", supplier: "DenimWorks", imageUrl: "https://images.unsplash.com/photo-1603561588624-b96e6cfee18c?q=80&w=800"
  },
  {
    id: "PROD051", name: "Shearling Jacket", description: "A cozy and stylish jacket with a shearling lining for extra warmth.", stock: 40, price: 280.00, averageDailySales: 2, leadTimeDays: 30, category: "Outerwear", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1579854747470-0293d72e7371?q=80&w=800"
  },
  {
    id: "PROD052", name: "Dress Socks", description: "A pack of three pairs of comfortable, patterned dress socks.", stock: 300, price: 18.00, averageDailySales: 25, leadTimeDays: 7, category: "Accessories", supplier: "CottonKings", imageUrl: "https://images.unsplash.com/photo-1586350343355-15399a800539?q=80&w=800"
  },
  {
    id: "PROD053", name: "Hiking Boots", description: "Durable, waterproof hiking boots with excellent traction and support.", stock: 65, price: 180.00, averageDailySales: 4, leadTimeDays: 28, category: "Footwear", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1520639888713-78551335295d?q=80&w=800"
  },
  {
    id: "PROD054", name: "Tank Top", description: "A basic, ribbed cotton tank top. Great for layering or warm weather.", stock: 400, price: 18.00, averageDailySales: 35, leadTimeDays: 5, category: "Tops", supplier: "CottonKings", imageUrl: "https://images.unsplash.com/photo-1533512920485-64c8a1e2335f?q=80&w=800"
  },
  {
    id: "PROD055", name: "Linen Trousers", description: "Lightweight and breathable linen trousers with a drawstring waist.", stock: 90, price: 72.00, averageDailySales: 6, leadTimeDays: 18, category: "Bottoms", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=800"
  },
  {
    id: "PROD056", name: "Quilted Vest", description: "A stylish diamond-quilted vest, perfect for layering in the fall.", stock: 110, price: 85.00, averageDailySales: 8, leadTimeDays: 20, category: "Outerwear", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1610442383884-9d5a7b42d765?q=80&w=800"
  },
  {
    id: "PROD057", name: "Crossbody Bag", description: "A compact and convenient crossbody bag in durable nylon.", stock: 130, price: 45.00, averageDailySales: 10, leadTimeDays: 15, category: "Accessories", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1579631683479-55def344a10c?q=80&w=800"
  },
  {
    id: "PROD058", name: "Ballet Flats", description: "Comfortable and elegant leather ballet flats. A timeless classic.", stock: 100, price: 90.00, averageDailySales: 7, leadTimeDays: 22, category: "Footwear", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1527799839422-7360485a5a77?q=80&w=800"
  },
  {
    id: "PROD059", name: "Henley T-Shirt", description: "A short-sleeve Henley t-shirt in a soft cotton blend.", stock: 220, price: 28.00, averageDailySales: 16, leadTimeDays: 8, category: "Tops", supplier: "CottonKings", imageUrl: "https://images.unsplash.com/photo-1581655353026-3a78189ba123?q=80&w=800"
  },
  {
    id: "PROD060", name: "Jean Skirt", description: "A classic A-line jean skirt in a medium denim wash.", stock: 100, price: 54.00, averageDailySales: 9, leadTimeDays: 16, category: "Bottoms", supplier: "DenimWorks", imageUrl: "https://images.unsplash.com/photo-1594908902099-ea3c78416d86?q=80&w=800"
  },
  {
    id: "PROD061", name: "Blazer", description: "A tailored single-breasted blazer in a classic navy wool.", stock: 55, price: 220.00, averageDailySales: 3, leadTimeDays: 28, category: "Outerwear", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1592328172352-33b9952dc124?q=80&w=800"
  },
  {
    id: "PROD062", name: "Silk Scarf", description: "A luxurious and colorful printed silk scarf.", stock: 150, price: 48.00, averageDailySales: 11, leadTimeDays: 15, category: "Accessories", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800"
  },
  {
    id: "PROD063", name: "Sandals", description: "Comfortable and stylish leather sandals for warm weather.", stock: 180, price: 65.00, averageDailySales: 15, leadTimeDays: 18, category: "Footwear", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800"
  },
  {
    id: "PROD064", name: "Peplum Top", description: "A flattering peplum top that adds a touch of elegance to any outfit.", stock: 90, price: 42.00, averageDailySales: 7, leadTimeDays: 14, category: "Tops", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1593988636692-e4871b3c9597?q=80&w=800"
  },
  {
    id: "PROD065", name: "Sweatpants", description: "Ultra-soft fleece sweatpants for ultimate comfort and relaxation.", stock: 200, price: 40.00, averageDailySales: 18, leadTimeDays: 10, category: "Bottoms", supplier: "CottonKings", imageUrl: "https://images.unsplash.com/photo-1624321723597-9b222a7f5027?q=80&w=800"
  },
  {
    id: "PROD066", name: "Windbreaker", description: "A lightweight, packable windbreaker jacket for protection against the elements.", stock: 130, price: 75.00, averageDailySales: 10, leadTimeDays: 16, category: "Outerwear", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1542062700-91d04b4d7524?q=80&w=800"
  },
  {
    id: "PROD067", name: "Watch", description: "A minimalist watch with a leather strap and a clean, modern face.", stock: 80, price: 150.00, averageDailySales: 5, leadTimeDays: 25, category: "Accessories", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800"
  },
  {
    id: "PROD068", name: "Espadrilles", description: "Casual and comfortable canvas espadrilles, perfect for summer.", stock: 110, price: 55.00, averageDailySales: 8, leadTimeDays: 20, category: "Footwear", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1560343673-834c3837b29a?q=80&w=800"
  },
  {
    id: "PROD069", name: "Bodysuit", description: "A sleek, form-fitting bodysuit that's perfect for layering.", stock: 150, price: 38.00, averageDailySales: 12, leadTimeDays: 12, category: "Tops", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1577448398412-1ab837388701?q=80&w=800"
  },
  {
    id: "PROD070", name: "Athletic Shorts", description: "Breathable, moisture-wicking shorts for workouts and sports.", stock: 180, price: 35.00, averageDailySales: 15, leadTimeDays: 10, category: "Bottoms", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1591130901921-3f0655bb348a?q=80&w=800"
  },
  {
    id: "PROD071", name: "Maxi Dress", description: "A long, flowing maxi dress in a beautiful summer print.", stock: 75, price: 95.00, averageDailySales: 5, leadTimeDays: 20, category: "Dresses", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1594744800847-f600248f8310?q=80&w=800"
  },
  {
    id: "PROD072", name: "Leather Jacket", description: "A timeless investment piece, this 100% lambskin leather jacket is buttery soft.", stock: 35, price: 450.00, averageDailySales: 1, leadTimeDays: 35, category: "Outerwear", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800"
  },
  {
    id: "PROD073", name: "Fedora Hat", description: "A stylish wool felt fedora with a classic ribbon band.", stock: 90, price: 68.00, averageDailySales: 6, leadTimeDays: 18, category: "Accessories", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1534215754734-18e16d14e345?q=80&w=800"
  },
  {
    id: "PROD074", name: "Over-the-Knee Boots", description: "Dramatic and chic over-the-knee boots in black suede.", stock: 50, price: 195.00, averageDailySales: 3, leadTimeDays: 28, category: "Footwear", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1517330357046-3ab5a5dd42a1?q=80&w=800"
  },
  {
    id: "PROD075", name: "Wrap Dress", description: "A universally flattering wrap dress in a soft, stretchy jersey knit.", stock: 120, price: 88.00, averageDailySales: 9, leadTimeDays: 16, category: "Dresses", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1620704453457-3a4657d47225?q=80&w=800"
  },
  {
    id: "PROD076", name: "Tunic Sweater", description: "A long, comfortable tunic sweater, perfect for pairing with leggings.", stock: 100, price: 72.00, averageDailySales: 8, leadTimeDays: 18, category: "Tops", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1582148468779-119199343394?q=80&w=800"
  },
  {
    id: "PROD077", name: "Leggings", description: "High-waisted, opaque leggings that are perfect for workouts or lounging.", stock: 300, price: 48.00, averageDailySales: 25, leadTimeDays: 10, category: "Bottoms", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1584735990261-b7a5099049a4?q=80&w=800"
  },
  {
    id: "PROD078", name: "Parka", description: "A heavy-duty parka with a faux-fur-lined hood, designed for extreme cold.", stock: 40, price: 320.00, averageDailySales: 2, leadTimeDays: 30, category: "Outerwear", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1509095629910-324424422650?q=80&w=800"
  },
  {
    id: "PROD079", name: "Bucket Hat", description: "A trendy and fun bucket hat, available in various colors and patterns.", stock: 180, price: 25.00, averageDailySales: 15, leadTimeDays: 8, category: "Accessories", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1575428652377-a3d80e281498?q=80&w=800"
  },
  {
    id: "PROD080", name: "Mules", description: "Easy to slip on and off, these stylish mules are perfect for any occasion.", stock: 90, price: 85.00, averageDailySales: 7, leadTimeDays: 20, category: "Footwear", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1560343673-834c3837b29a?q=80&w=800"
  },
  {
    id: "PROD081", name: "Cocktail Dress", description: "A stunning and elegant cocktail dress, perfect for special events.", stock: 60, price: 150.00, averageDailySales: 4, leadTimeDays: 25, category: "Dresses", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1590245642495-5197f6c6511d?q=80&w=800"
  },
  {
    id: "PROD082", name: "Camisole", description: "A silky, lace-trimmed camisole that can be dressed up or down.", stock: 200, price: 32.00, averageDailySales: 18, leadTimeDays: 10, category: "Tops", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1533512920485-64c8a1e2335f?q=80&w=800"
  },
  {
    id: "PROD083", name: "Biker Shorts", description: "Stretchy and comfortable biker shorts, ideal for exercise or casual wear.", stock: 150, price: 30.00, averageDailySales: 12, leadTimeDays: 12, category: "Bottoms", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1591130901921-3f0655bb348a?q=80&w=800"
  },
  {
    id: "PROD084", name: "Anorak Jacket", description: "A pullover-style anorak jacket that's both stylish and functional.", stock: 80, price: 110.00, averageDailySales: 6, leadTimeDays: 18, category: "Outerwear", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1542062700-91d04b4d7524?q=80&w=800"
  },
  {
    id: "PROD085", name: "Statement Necklace", description: "A bold and beautiful statement necklace to elevate any outfit.", stock: 100, price: 55.00, averageDailySales: 8, leadTimeDays: 15, category: "Accessories", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1593125279562-b73b2a472c67?q=80&w=800"
  },
  {
    id: "PROD086", name: "Wedge Sandals", description: "Comfortable wedge sandals that give you height without the discomfort.", stock: 95, price: 78.00, averageDailySales: 7, leadTimeDays: 22, category: "Footwear", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1562273138-67634d85a04a?q=80&w=800"
  },
  {
    id: "PROD087", name: "Shift Dress", description: "A simple and elegant shift dress with a classic silhouette.", stock: 110, price: 80.00, averageDailySales: 9, leadTimeDays: 16, category: "Dresses", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800"
  },
  {
    id: "PROD088", name: "Off-the-Shoulder Top", description: "A trendy off-the-shoulder top in a soft, ribbed knit.", stock: 140, price: 40.00, averageDailySales: 11, leadTimeDays: 14, category: "Tops", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1593988636692-e4871b3c9597?q=80&w=800"
  },
  {
    id: "PROD089", name: "High-Waisted Shorts", description: "Flattering high-waisted shorts in a classic denim wash.", stock: 160, price: 52.00, averageDailySales: 13, leadTimeDays: 15, category: "Bottoms", supplier: "DenimWorks", imageUrl: "https://images.unsplash.com/photo-1603561588624-b96e6cfee18c?q=80&w=800"
  },
  {
    id: "PROD090", name: "Military Jacket", description: "A rugged and stylish military-inspired jacket with plenty of pockets.", stock: 70, price: 145.00, averageDailySales: 5, leadTimeDays: 25, category: "Outerwear", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1559551409-dadc9592B8b8?q=80&w=800"
  },
  {
    id: "PROD091", name: "Hoop Earrings", description: "Classic gold hoop earrings that are both simple and elegant.", stock: 250, price: 30.00, averageDailySales: 20, leadTimeDays: 10, category: "Accessories", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1613564999602-55b51614741f?q=80&w=800"
  },
  {
    id: "PROD092", name: "Pumps", description: "Classic pointed-toe pumps in a versatile nude leather.", stock: 85, price: 120.00, averageDailySales: 6, leadTimeDays: 22, category: "Footwear", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1596700313355-323a6338875c?q=80&w=800"
  },
  {
    id: "PROD093", name: "Sweater Dress", description: "A cozy and chic sweater dress, perfect for cooler weather.", stock: 90, price: 98.00, averageDailySales: 7, leadTimeDays: 18, category: "Dresses", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1609503251433-28989647225c?q=80&w=800"
  },
  {
    id: "PROD094", name: "Crop Top", description: "A fun and flirty crop top, perfect for summer days and nights.", stock: 180, price: 28.00, averageDailySales: 15, leadTimeDays: 10, category: "Tops", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1581655353026-3a78189ba123?q=80&w=800"
  },
  {
    id: "PROD095", name: "Culottes", description: "Wide, cropped culottes that are both comfortable and stylish.", stock: 100, price: 65.00, averageDailySales: 8, leadTimeDays: 16, category: "Bottoms", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1594623930122-824a3a693683?q=80&w=800"
  },
  {
    id: "PROD096", name: "Cape", description: "An elegant and dramatic wool cape for a statement outerwear piece.", stock: 30, price: 250.00, averageDailySales: 1, leadTimeDays: 35, category: "Outerwear", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1582142388682-950453310235?q=80&w=800"
  },
  {
    id: "PROD097", name: "Beaded Bracelet", description: "A beautiful, handcrafted beaded bracelet with natural stones.", stock: 150, price: 22.00, averageDailySales: 12, leadTimeDays: 12, category: "Accessories", supplier: "UrbanStyle Co.", imageUrl: "https://images.unsplash.com/photo-1611652022417-a040932d0339?q=80&w=800"
  },
  {
    id: "PROD098", name: "Slides", description: "Comfortable and easy-to-wear slides, perfect for the beach or pool.", stock: 200, price: 35.00, averageDailySales: 18, leadTimeDays: 10, category: "Footwear", supplier: "FootWorks", imageUrl: "https://images.unsplash.com/photo-1603487742131-411a79933a75?q=80&w=800"
  },
  {
    id: "PROD099", name: "Jumpsuit", description: "A chic and effortless one-piece jumpsuit, perfect for any occasion.", stock: 80, price: 115.00, averageDailySales: 6, leadTimeDays: 20, category: "Dresses", supplier: "ElegantWear", imageUrl: "https://images.unsplash.com/photo-1594744800847-f600248f8310?q=80&w=800"
  },
  {
    id: "PROD100", name: "Button-Up Shirt Dress", description: "A versatile and classic shirt dress that can be styled in multiple ways.", stock: 95, price: 89.00, averageDailySales: 7, leadTimeDays: 18, category: "Dresses", supplier: "DenimWorks", imageUrl: "https://images.unsplash.com/photo-1596755038136-26a364654b9d?q=80&w=800"
  }
];


export const salesData = [
  { name: "Jan", sales: 14000 },
  { name: "Feb", sales: 13000 },
  { name: "Mar", sales: 15000 },
  { name: "Apr", sales: 14500 },
  { name: "May", sales: 16000 },
  { name: "Jun", sales: 15500 },
];

export const transactions: Transaction[] = [
  {
    id: "TRN001",
    productName: "Classic White T-Shirt",
    type: "Sale",
    quantity: 5,
    date: "2024-06-23",
  },
  {
    id: "TRN002",
    productName: "Slim-Fit Indigo Jeans",
    type: "Purchase",
    quantity: 30,
    date: "2024-06-22",
  },
  {
    id: "TRN003",
    productName: "Gray Hoodie",
    type: "Sale",
    quantity: 10,
    date: "2024-06-22",
  },
  {
    id: "TRN004",
    name: "White Canvas Sneakers",
    type: "Sale",
    quantity: 12,
    date: "2024-06-21",
  },
  {
    id: "TRN005",
    name: "Black Skinny Jeans",
    type: "Purchase",
    quantity: 50,
    date: "2024-06-20",
  },
  {
    id: "TRN006",
    productName: "Striped Linen Shirt",
    type: "Sale",
    quantity: 3,
    date: "2024-06-23",
  },
  {
    id: "TRN007",
    productName: "Knit Beanie",
    type: "Sale",
    quantity: 20,
    date: "2024-06-22",
  },
  {
    id: "TRN008",
    productName: "Polo Shirt",
    type: "Purchase",
    quantity: 40,
    date: "2024-06-21",
  },
];

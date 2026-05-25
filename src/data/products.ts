import {
  Smartphone,
  Shirt,
  Home,
  Laptop,
  Sparkles,
  Baby,
  Dumbbell,
  Car,
  Book,
  Gamepad2,
  Watch,
  Headphones,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  slug: string;
  name: string;
  icon: LucideIcon;
  color: string;
};

export const categories: Category[] = [
  { slug: "electronics", name: "Electronics", icon: Laptop, color: "oklch(0.65 0.18 250)" },
  { slug: "mobile", name: "Mobile & Tablets", icon: Smartphone, color: "oklch(0.68 0.19 40)" },
  { slug: "fashion", name: "Fashion", icon: Shirt, color: "oklch(0.7 0.18 350)" },
  { slug: "home", name: "Home & Living", icon: Home, color: "oklch(0.65 0.17 150)" },
  { slug: "beauty", name: "Health & Beauty", icon: Sparkles, color: "oklch(0.75 0.17 330)" },
  { slug: "baby", name: "Babies & Toys", icon: Baby, color: "oklch(0.78 0.15 60)" },
  { slug: "sports", name: "Sports & Outdoor", icon: Dumbbell, color: "oklch(0.65 0.18 30)" },
  { slug: "automotive", name: "Automotive", icon: Car, color: "oklch(0.5 0.1 250)" },
  { slug: "books", name: "Books & Media", icon: Book, color: "oklch(0.6 0.15 200)" },
  { slug: "gaming", name: "Gaming", icon: Gamepad2, color: "oklch(0.55 0.21 280)" },
  { slug: "watches", name: "Watches", icon: Watch, color: "oklch(0.45 0.05 250)" },
  { slug: "audio", name: "Audio", icon: Headphones, color: "oklch(0.6 0.18 320)" },
];

export type Product = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  sold: number;
  image: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
  stock: number;
  description: string;
  specs: Record<string, string>;
  tags?: string[];
};

const img = (seed: string, w = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${w}`;

const make = (p: Omit<Product, "image" | "images"> & { seed: string }): Product => ({
  ...p,
  image: img(p.seed),
  images: [img(p.seed), img(p.seed + "-2"), img(p.seed + "-3"), img(p.seed + "-4")],
});

export const products: Product[] = [
  make({
    id: "p1", seed: "iphone15", title: "Apple iPhone 15 Pro Max 256GB Titanium",
    brand: "Apple", category: "mobile", price: 1199, originalPrice: 1399,
    rating: 4.8, reviews: 2431, sold: 12000, stock: 24,
    colors: ["#3a3a3c", "#f5f5dc", "#1e3a5f", "#8b7355"],
    sizes: ["128GB", "256GB", "512GB", "1TB"],
    description: "The most powerful iPhone ever, with titanium design and A17 Pro chip.",
    specs: { Display: "6.7\" Super Retina XDR", Chip: "A17 Pro", Camera: "48MP Triple", Battery: "4422 mAh", OS: "iOS 17" },
    tags: ["bestseller", "flash"],
  }),
  make({
    id: "p2", seed: "samsungs24", title: "Samsung Galaxy S24 Ultra 5G 512GB",
    brand: "Samsung", category: "mobile", price: 1099, originalPrice: 1299,
    rating: 4.7, reviews: 1820, sold: 9800, stock: 31,
    colors: ["#2c2c2c", "#d4af7a", "#5a5a8a"], sizes: ["256GB", "512GB", "1TB"],
    description: "Galaxy AI is here. Capture epic moments with the built-in S Pen.",
    specs: { Display: "6.8\" Dynamic AMOLED", Chip: "Snapdragon 8 Gen 3", Camera: "200MP Quad", Battery: "5000 mAh", OS: "Android 14" },
    tags: ["bestseller", "new"],
  }),
  make({
    id: "p3", seed: "macbook-air", title: "MacBook Air M3 13-inch 8GB 256GB",
    brand: "Apple", category: "electronics", price: 999, originalPrice: 1199,
    rating: 4.9, reviews: 3120, sold: 15200, stock: 12,
    colors: ["#c0c0c0", "#1c1c1e", "#e8d4b8"],
    description: "Supercharged by M3 chip. Strikingly thin, fast, and fanless.",
    specs: { Display: "13.6\" Liquid Retina", Chip: "Apple M3", RAM: "8GB", Storage: "256GB SSD", Battery: "Up to 18h" },
    tags: ["flash", "new"],
  }),
  make({
    id: "p4", seed: "sony-wh1000", title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    brand: "Sony", category: "audio", price: 299, originalPrice: 399,
    rating: 4.7, reviews: 5621, sold: 32000, stock: 87,
    colors: ["#1a1a1a", "#e8e4dd", "#4a3a30"],
    description: "Industry-leading noise cancellation with 30-hour battery life.",
    specs: { Type: "Over-ear", Battery: "30h", Bluetooth: "5.2", Weight: "250g", Charging: "USB-C" },
    tags: ["bestseller", "flash"],
  }),
  make({
    id: "p5", seed: "airpods-pro", title: "Apple AirPods Pro (2nd Generation) USB-C",
    brand: "Apple", category: "audio", price: 199, originalPrice: 249,
    rating: 4.8, reviews: 8900, sold: 54000, stock: 200,
    description: "Active Noise Cancellation, Adaptive Audio, and personalized spatial audio.",
    specs: { Chip: "H2", Battery: "6h + 30h case", ANC: "Yes", Water: "IP54" },
    tags: ["bestseller"],
  }),
  make({
    id: "p6", seed: "nike-air", title: "Nike Air Max 270 Men's Running Shoes",
    brand: "Nike", category: "fashion", price: 129, originalPrice: 180,
    rating: 4.6, reviews: 1240, sold: 8400, stock: 56,
    colors: ["#000000", "#ffffff", "#ff4444", "#3a5a90"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    description: "Nike's biggest heel Air unit yet for all-day comfort.",
    specs: { Material: "Mesh upper", Sole: "Rubber", Closure: "Lace-up", Style: "Athletic" },
    tags: ["new"],
  }),
  make({
    id: "p7", seed: "adidas-tee", title: "Adidas Essentials 3-Stripes T-Shirt",
    brand: "Adidas", category: "fashion", price: 25, originalPrice: 35,
    rating: 4.5, reviews: 890, sold: 12000, stock: 320,
    colors: ["#000000", "#ffffff", "#1e88e5", "#4caf50"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Classic cotton tee with iconic 3-stripes on the sleeves.",
    specs: { Material: "100% Cotton", Fit: "Regular", Care: "Machine wash" },
  }),
  make({
    id: "p8", seed: "rolex-sub", title: "Casio G-Shock GA-2100 Analog-Digital Watch",
    brand: "Casio", category: "watches", price: 99, originalPrice: 149,
    rating: 4.7, reviews: 2310, sold: 18000, stock: 65,
    colors: ["#000000", "#cc0000", "#0066cc"],
    description: "Carbon Core Guard structure. 200m water resistance.",
    specs: { Movement: "Quartz", Case: "49mm", Water: "200m", Battery: "3 years" },
    tags: ["bestseller"],
  }),
  make({
    id: "p9", seed: "ps5", title: "Sony PlayStation 5 Slim Console Disc Edition",
    brand: "Sony", category: "gaming", price: 499, originalPrice: 549,
    rating: 4.9, reviews: 4500, sold: 28000, stock: 8,
    description: "Stunning games with ray tracing, 4K-TV gaming, and up to 120fps.",
    specs: { Storage: "1TB SSD", Output: "4K 120Hz", Disc: "Ultra HD Blu-ray" },
    tags: ["flash", "bestseller"],
  }),
  make({
    id: "p10", seed: "xbox", title: "Xbox Series X 1TB Console",
    brand: "Microsoft", category: "gaming", price: 449, originalPrice: 499,
    rating: 4.8, reviews: 3200, sold: 19000, stock: 15,
    description: "The fastest, most powerful Xbox ever. 12 teraflops of power.",
    specs: { Storage: "1TB SSD", Output: "4K 120Hz", RAM: "16GB GDDR6" },
    tags: ["new"],
  }),
  make({
    id: "p11", seed: "dyson-v15", title: "Dyson V15 Detect Cordless Vacuum Cleaner",
    brand: "Dyson", category: "home", price: 649, originalPrice: 749,
    rating: 4.7, reviews: 1800, sold: 6200, stock: 22,
    description: "Laser reveals microscopic dust. Powerful suction in a slim form.",
    specs: { Type: "Cordless stick", Battery: "60min", Bin: "0.77L", Weight: "3kg" },
    tags: ["flash"],
  }),
  make({
    id: "p12", seed: "lego-millennium", title: "LEGO Star Wars Millennium Falcon Building Set",
    brand: "LEGO", category: "baby", price: 159, originalPrice: 199,
    rating: 4.9, reviews: 980, sold: 4300, stock: 42,
    description: "1,329-piece set featuring detailed exterior and minifigures.",
    specs: { Pieces: "1329", Age: "9+", Minifigs: "7" },
  }),
  make({
    id: "p13", seed: "fenty-lip", title: "Fenty Beauty Gloss Bomb Universal Lip Luminizer",
    brand: "Fenty Beauty", category: "beauty", price: 22, originalPrice: 28,
    rating: 4.8, reviews: 5400, sold: 41000, stock: 180,
    colors: ["#d4a5a5", "#b8736e", "#8b4a4a", "#e8c4b8"],
    description: "Explosive shine that feels as good as it looks.",
    specs: { Type: "Lip gloss", Size: "9ml", Finish: "Glossy" },
    tags: ["bestseller"],
  }),
  make({
    id: "p14", seed: "yoga-mat", title: "Manduka PRO Yoga Mat 6mm Extra Thick",
    brand: "Manduka", category: "sports", price: 89, originalPrice: 120,
    rating: 4.7, reviews: 1620, sold: 7800, stock: 95,
    colors: ["#4a2c4a", "#2c4a4a", "#1a1a1a"],
    description: "Lifetime guarantee. Dense cushion for joint protection.",
    specs: { Thickness: "6mm", Size: "71\"x26\"", Weight: "3.4kg" },
  }),
  make({
    id: "p15", seed: "kindle", title: "Amazon Kindle Paperwhite 11th Gen 16GB",
    brand: "Amazon", category: "books", price: 139, originalPrice: 159,
    rating: 4.8, reviews: 6700, sold: 32000, stock: 110,
    description: "Glare-free 6.8\" display with adjustable warm light.",
    specs: { Display: "6.8\" 300ppi", Storage: "16GB", Battery: "10 weeks", Water: "IPX8" },
    tags: ["new"],
  }),
  make({
    id: "p16", seed: "tire", title: "Michelin Pilot Sport 4 Performance Tire 225/45R17",
    brand: "Michelin", category: "automotive", price: 189, originalPrice: 230,
    rating: 4.7, reviews: 540, sold: 2100, stock: 38,
    description: "Exceptional wet grip and dry handling for sport sedans.",
    specs: { Size: "225/45R17", Speed: "Y (300 km/h)", Load: "94" },
  }),
  make({
    id: "p17", seed: "ipad-air", title: "Apple iPad Air 13-inch M2 Wi-Fi 128GB",
    brand: "Apple", category: "electronics", price: 799, originalPrice: 899,
    rating: 4.8, reviews: 1290, sold: 8400, stock: 27,
    colors: ["#c0c0c0", "#2a3a5e", "#d8c4a8", "#7a5a8a"],
    sizes: ["128GB", "256GB", "512GB"],
    description: "Big and bold 13-inch display, powered by the M2 chip.",
    specs: { Display: "13\" Liquid Retina", Chip: "M2", Camera: "12MP", Battery: "10h" },
    tags: ["new", "flash"],
  }),
  make({
    id: "p18", seed: "levis", title: "Levi's 501 Original Fit Men's Jeans",
    brand: "Levi's", category: "fashion", price: 59, originalPrice: 89,
    rating: 4.6, reviews: 4200, sold: 28000, stock: 230,
    colors: ["#1a3a5e", "#000000", "#5a5a5a"],
    sizes: ["30", "32", "34", "36", "38", "40"],
    description: "The original blue jean since 1873. Straight leg, button fly.",
    specs: { Material: "100% Cotton denim", Fit: "Straight", Rise: "Mid" },
  }),
  make({
    id: "p19", seed: "instant-pot", title: "Instant Pot Duo 7-in-1 Pressure Cooker 6Qt",
    brand: "Instant Pot", category: "home", price: 79, originalPrice: 119,
    rating: 4.8, reviews: 12400, sold: 89000, stock: 145,
    description: "7 appliances in 1: pressure cooker, slow cooker, rice cooker, and more.",
    specs: { Capacity: "6 Quart", Programs: "13", Power: "1000W" },
    tags: ["bestseller", "flash"],
  }),
  make({
    id: "p20", seed: "switch-oled", title: "Nintendo Switch OLED Model Console White",
    brand: "Nintendo", category: "gaming", price: 329, originalPrice: 369,
    rating: 4.9, reviews: 3800, sold: 22000, stock: 19,
    colors: ["#ffffff", "#e8474c", "#1e6fbf"],
    description: "Vibrant 7-inch OLED screen. Play at home or on the go.",
    specs: { Display: "7\" OLED", Storage: "64GB", Battery: "4.5-9h" },
    tags: ["bestseller"],
  }),
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getByCategory = (slug: string) =>
  slug === "all" ? products : products.filter((p) => p.category === slug);
export const flashSaleProducts = () => products.filter((p) => p.tags?.includes("flash"));
export const bestSellers = () => products.filter((p) => p.tags?.includes("bestseller"));
export const newArrivals = () => products.filter((p) => p.tags?.includes("new"));

export const brands = Array.from(new Set(products.map((p) => p.brand))).sort();

export const heroBanners = [
  {
    id: 1,
    title: "11.11 Mega Sale",
    subtitle: "Up to 90% OFF + Free Shipping",
    cta: "Shop Now",
    bg: "linear-gradient(135deg, oklch(0.68 0.19 40), oklch(0.6 0.24 25))",
    image: img("hero-1111", 1200),
    href: "/category/all",
  },
  {
    id: 2,
    title: "New Tech Drop",
    subtitle: "Latest gadgets from Apple, Samsung & Sony",
    cta: "Discover",
    bg: "linear-gradient(135deg, oklch(0.4 0.15 260), oklch(0.55 0.21 260))",
    image: img("hero-tech", 1200),
    href: "/category/electronics",
  },
  {
    id: 3,
    title: "Fashion Week",
    subtitle: "Trending styles starting at $19",
    cta: "Browse Looks",
    bg: "linear-gradient(135deg, oklch(0.55 0.18 350), oklch(0.7 0.18 20))",
    image: img("hero-fashion", 1200),
    href: "/category/fashion",
  },
];
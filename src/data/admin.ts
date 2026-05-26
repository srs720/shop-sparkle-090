export type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  items: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
  payment: "Card" | "bKash" | "Nagad" | "COD" | "PayPal";
};

const names = [
  "Aarav Khan","Mira Patel","John Doe","Sofia Rahman","Liam Smith","Noah Hossain",
  "Olivia Chen","Emma Akter","Lucas Brown","Ava Wilson","Ethan Davis","Mia Ali",
  "Yusuf Karim","Zara Begum","Arjun Rao","Hana Tanaka","Leo Garcia","Ivy Park",
  "Omar Faruk","Tasnim Jahan","Rohan Das","Nadia Iqbal","Caleb Wright","Maya Roy",
];
const statuses: AdminOrder["status"][] = ["Pending","Processing","Shipped","Delivered","Cancelled","Refunded"];
const payments: AdminOrder["payment"][] = ["Card","bKash","Nagad","COD","PayPal"];

export const adminOrders: AdminOrder[] = Array.from({ length: 64 }).map((_, i) => {
  const n = names[i % names.length];
  const d = new Date(Date.now() - i * 86400000 * 0.7);
  return {
    id: `#ORD-${(10240 + i).toString()}`,
    customer: n,
    email: n.toLowerCase().replace(/\s+/g, ".") + "@mail.com",
    date: d.toISOString().slice(0, 10),
    total: Math.round((40 + Math.random() * 950) * 100) / 100,
    items: 1 + Math.floor(Math.random() * 6),
    status: statuses[i % statuses.length],
    payment: payments[i % payments.length],
  };
});

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  orders: number;
  spent: number;
  wallet: number;
  status: "Active" | "Inactive" | "Banned";
};

export const adminCustomers: AdminCustomer[] = names.map((n, i) => ({
  id: `CUS-${1000 + i}`,
  name: n,
  email: n.toLowerCase().replace(/\s+/g, ".") + "@mail.com",
  phone: "+880 1" + (700000000 + i * 13579).toString().slice(0, 9),
  joined: new Date(Date.now() - i * 86400000 * 12).toISOString().slice(0, 10),
  orders: Math.floor(Math.random() * 28),
  spent: Math.round(Math.random() * 5800 * 100) / 100,
  wallet: Math.round(Math.random() * 250 * 100) / 100,
  status: i % 11 === 0 ? "Banned" : i % 5 === 0 ? "Inactive" : "Active",
}));

export const revenueSeries = Array.from({ length: 12 }).map((_, i) => {
  const month = new Date(2025, i, 1).toLocaleString("en", { month: "short" });
  return {
    month,
    revenue: 12000 + Math.round(Math.random() * 38000),
    orders: 200 + Math.round(Math.random() * 600),
    refunds: 200 + Math.round(Math.random() * 1500),
  };
});

export const trafficSources = [
  { name: "Organic", value: 4250 },
  { name: "Direct", value: 2380 },
  { name: "Social", value: 1860 },
  { name: "Email", value: 920 },
  { name: "Referral", value: 640 },
];

export const categorySales = [
  { name: "Electronics", value: 32450 },
  { name: "Fashion", value: 24180 },
  { name: "Home", value: 18200 },
  { name: "Beauty", value: 12400 },
  { name: "Gaming", value: 21300 },
  { name: "Sports", value: 9800 },
];

export const stockLogs = Array.from({ length: 20 }).map((_, i) => ({
  id: `LOG-${5000 + i}`,
  sku: `SKU-${(2000 + i * 7).toString()}`,
  product: ["Wireless Headphones","Smart Watch","Gaming Mouse","Bluetooth Speaker","4K Monitor","Mechanical Keyboard"][i % 6],
  type: i % 3 === 0 ? "OUT" : "IN",
  qty: 1 + Math.floor(Math.random() * 50),
  date: new Date(Date.now() - i * 3600000 * 5).toLocaleString(),
  by: ["Admin","Warehouse","System","Editor"][i % 4],
}));

export const notifications = [
  { id: "n1", title: "Low stock alert", body: "Sony WH-1000XM5 — only 3 left", time: "2m ago", type: "warning" as const },
  { id: "n2", title: "New order received", body: "#ORD-10298 by Mira Patel — $324.50", time: "10m ago", type: "info" as const },
  { id: "n3", title: "Refund requested", body: "#ORD-10241 — reason: damaged", time: "1h ago", type: "danger" as const },
  { id: "n4", title: "Payout completed", body: "$4,820 transferred to bank", time: "3h ago", type: "success" as const },
  { id: "n5", title: "New customer signup", body: "tasnim.jahan@mail.com joined", time: "5h ago", type: "info" as const },
];
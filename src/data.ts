import raw from "./catalog.json";
export type Product = (typeof raw)[number];
export type Line = { id: string; variant: string; qty: number };
export type Address = {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pin: string;
  label: string;
};
export type Order = {
  id: string;
  date: string;
  items: Line[];
  total: number;
  address: Address;
  payment: string;
  shipping: string;
};
export const categories = [
  {
    name: "Notebooks & Writing Pads",
    short: "Notebooks",
    desc: "For notes, plans, and the next big idea.",
    sub: ["All notebooks", "Spiral", "Softcover", "Premium"],
    image: "legacy-notebook-b5",
  },
  {
    name: "Account Books",
    short: "Account Books",
    desc: "Keep every detail beautifully in order.",
    sub: ["All account books", "Register", "Duplicate", "Cash"],
    image: "account-book-lb-register-no5",
  },
  {
    name: "Art & Drawing",
    short: "Art & Drawing",
    desc: "A little space for your imagination.",
    sub: ["All art supplies", "Sketch", "Canvas", "Paper"],
    image: "my-sketch-book-a4",
  },
  {
    name: "Office Folders",
    short: "Office Folders",
    desc: "Make a little more room for organised.",
    sub: ["All folders", "Display", "Portfolio", "Conference"],
    image: "display-book-40-pockets",
  },
  {
    name: "Kits & Combos",
    short: "Kits & Combos",
    desc: "Good things, thoughtfully brought together.",
    sub: ["All kits", "College", "Office", "Planner"],
    image: "college-hustle-kit",
  },
  {
    name: "Sticky Notes",
    short: "Sticky Notes",
    desc: "Bright little reminders for everyday.",
    sub: ["All sticky notes", "Yellow", "Multicolour"],
    image: "sticky-notes-multicolour-3x3",
  },
];
export const products = raw as Product[];
export const money = (v: number) => "₹" + v.toLocaleString("en-IN");
export const find = (id: string) => products.find((p) => p.id === id);
export const catImage = (n: number) =>
  find(categories[n].image)?.image || products.find((p) => p.category === n)?.image;
// The catalog has no stock field; this one product is shown as sold out.
export const isSoldOut = (p: Product) => p.id === "portfolio-handle-bag-a3";
export const discountPct = (p: Product) => Math.round((1 - p.price / p.mrp) * 100);
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Chandigarh",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
];

export const company = {
  brand: "StationeryBazaar",
  legalName: "YARNVIA EXPORTS PRIVATE LIMITED",
  email: "yarnviaexports5869@gmail.com",
  phone: "+91 87964 32623",
  phoneHref: "tel:+918796432623",
  address: ["H No-9/149, Shyam Block", "Kailash Nagar, Gandhi Nagar", "East Delhi, Delhi – 110031, India"],
  hours: "Monday – Saturday, 9:00 AM – 7:00 PM",
};

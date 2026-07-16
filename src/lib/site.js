const db = globalThis.__BHOODEVI_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

// Central site configuration for Bhoodevi Properties
export const SITE = {
  name: "Bhoodevi Properties",
  tagline: "Earthed Etherealism",
  phone: "+1 (555) 162-7993",
  phoneRaw: "+15551627993",
  whatsapp: "15551627993",
  email: "estates@bhoodevi.properties",
  address: "Bhoodevi House, Jubilee Hills, Hyderabad, Telangana 500033",
  hours: "Mon – Sat · 9:30 AM – 7:00 PM IST",
  mapsQuery: "Jubilee Hills, Hyderabad",
};

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "About", to: "/#about" },
  { label: "Services", to: "/#services" },
  { label: "Contact", to: "/#contact" },
];

export const STATS = [
  { value: 420, suffix: "+", label: "Verified Properties" },
  { value: 1850, suffix: "+", label: "Happy Customers" },
  { value: 960, suffix: " ac", label: "Acres Sold" },
  { value: 38, suffix: "", label: "Projects" },
  { value: 14, suffix: " yrs", label: "Years of Experience" },
  { value: 5200, suffix: "+", label: "Site Visits Conducted" },
];

export const TRUST_ITEMS = [
  { label: "Verified Properties", icon: "ShieldCheck" },
  { label: "Legal Assistance", icon: "Scale" },
  { label: "Clear Titles", icon: "ScrollText" },
  { label: "Site Visit Support", icon: "MapPin" },
  { label: "Trusted by Investors", icon: "TrendingUp" },
];

export const CATEGORIES = [
  { name: "Residential", blurb: "Villas & plotted living", icon: "Home", img: "/images/057d0192b_generated_c24618f0.png" },
  { name: "Farm Lands", blurb: "Cultivated green estates", icon: "Leaf", img: "/images/8ccca91be_generated_07473839.png" },
  { name: "Commercial", blurb: "High-footfall corridors", icon: "Building2", img: "/images/56a846ecc_generated_29ead173.png" },
  { name: "Open Plots", blurb: "Surveyed ready-to-build", icon: "Grid3x3", img: "/images/34c9a594c_generated_902be099.png" },
  { name: "Investment Lands", blurb: "High-appreciation parcels", icon: "TrendingUp", img: "/images/f56023324_generated_6d11b046.png" },
  { name: "Agricultural", blurb: "Fertile yielding acreage", icon: "Wheat", img: "/images/ab77b02ef_generated_dba33d3f.png" },
];

export const WHY_CHOOSE = [
  { title: "Verified Documents", desc: "Every deed, EC, and layout scrutinised by our legal panel before listing.", icon: "FileCheck2" },
  { title: "Investment Guidance", desc: "Data-backed appreciation maps and ORR-growth corridors guide your decision.", icon: "LineChart" },
  { title: "Prime Locations", desc: "Curated parcels along emerging infrastructure and transit nodes.", icon: "MapPinned" },
  { title: "Transparent Pricing", desc: "No hidden margins. Surveyor-grade pricing with full cost breakdown.", icon: "ReceiptText" },
  { title: "Legal Support", desc: "End-to-end registration, mutation, and patta transfer handled in-house.", icon: "Scale" },
  { title: "Site Visits", desc: "Concierge-grade site visits with surveyor and soil brief on arrival.", icon: "Compass" },
];

export const SERVICES = [
  { title: "Property Sales", desc: "Curated acquisition of verified land, villas, and commercial estates.", icon: "Key" },
  { title: "Investment Consulting", desc: "Corridor analysis and ROI modelling across high-growth zones.", icon: "TrendingUp" },
  { title: "Legal Verification", desc: "Title search, encumbrance, and litigation due diligence.", icon: "Scale" },
  { title: "Documentation", desc: "Sale deed, registration, mutation, and patta — fully managed.", icon: "FileSignature" },
  { title: "Site Visits", desc: "Scheduled concierge visits with on-site surveyor briefings.", icon: "MapPin" },
  { title: "Property Marketing", desc: "Cinematic media, 3D site plans, and qualified lead generation.", icon: "Megaphone" },
];

export const TEAM = [
  { name: "Ananya Reddy", role: "Founder & Principal Estate Director", initials: "AR" },
  { name: "Vikram Rao", role: "Head of Land Acquisition", initials: "VR" },
  { name: "Meera Krishnan", role: "Legal & Compliance Lead", initials: "MK" },
  { name: "Arjun Naidu", role: "Investment Strategy", initials: "AN" },
];

export const MILESTONES = [
  { year: "2012", title: "Inception", desc: "Bhoodevi founded with a single principle — land, verified." },
  { year: "2016", title: "100 Acres Sold", desc: "Crossed our first century of transacted acreage." },
  { year: "2019", title: "Legal Panel Formed", desc: "In-house advocates and surveyors joined the bench." },
  { year: "2022", title: "Digital Estates", desc: "Launched interactive plot maps and virtual site tours." },
  { year: "2026", title: "960 Acres", desc: "A portfolio spanning six corridors of Hyderabad." },
];

export const PROPERTY_TYPES = ["Residential", "Farm Lands", "Commercial", "Open Plots", "Investment Lands", "Agricultural"];

export const ORR_DISTANCES = [
  { label: "Within 10 km", value: "0-10" },
  { label: "10 – 25 km", value: "10-25" },
  { label: "25 – 50 km", value: "25-50" },
  { label: "50+ km", value: "50+" },
];

export function formatPrice(n) {
  if (n == null) return "Price on request";
  if (n >= 10000000) return `₹ ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹ ${(n / 100000).toFixed(2)} L`;
  return `₹ ${n.toLocaleString("en-IN")}`;
}
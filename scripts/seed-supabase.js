import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Seed Data definition
const SEEDED_PROPERTIES = [
  {
    id: "prop-1",
    title: "Siri Farms & Orchards",
    slug: "siri-farms-orchards",
    type: "Farm Lands",
    status: "Available",
    price: 12000000,
    price_unit: "Total",
    area: "2.5 Acres",
    area_acres: 2.5,
    location: "Shankarpally, Hyderabad",
    orr_distance_km: 18,
    short_description: "Premium organic farm land with mature mango orchards and boundary fencing.",
    description: "Located in the serene zone of Shankarpally, Siri Farms offers fully clear title farm plots. Features rich black soil, 24/7 water supply, power connection, and a beautifully built farmhouse model. Ideal for peaceful weekend retreats and high land value appreciation.",
    highlights: ["Clear Title & Spot Registration", "24/7 Security & Caretaker", "Drip Irrigation System", "18 km from Outer Ring Road"],
    amenities: ["Water Connection", "Power Supply", "Fenced Boundary", "Fruit Trees"],
    images: ["/images/8ccca91be_generated_07473839.png"],
    featured: true,
    verified: true,
    created_date: "2026-07-01T12:00:00Z"
  },
  {
    id: "prop-2",
    title: "Vaikunta Residential Plots",
    slug: "vaikunta-residential-plots",
    type: "Residential",
    status: "Available",
    price: 7500000,
    price_unit: "Total",
    area: "300 Sq.Yds",
    area_acres: 0.06,
    location: "Mokila, Hyderabad",
    orr_distance_km: 12,
    short_description: "HMDA approved gated community plots with premium amenities.",
    description: "Vaikunta offers premium villa plots in the hot residential zone of Mokila. Complete with underground cabling, wide blacktop roads, overhead water tank, and a clubhouse. Immediate construction permitted.",
    highlights: ["HMDA & RERA Approved", "Underground Drainage & Electricity", "100% Vaastu Compliant", "12 km from ORR"],
    amenities: ["Clubhouse", "24/7 Security", "Parks & Play Area", "Street Lights"],
    images: ["/images/057d0192b_generated_c24618f0.png"],
    featured: true,
    verified: true,
    created_date: "2026-07-02T12:00:00Z"
  },
  {
    id: "prop-3",
    title: "Chandan Avenue Commercial Land",
    slug: "chandan-avenue-commercial-land",
    type: "Commercial",
    status: "Available",
    price: 45000000,
    price_unit: "Total",
    area: "1.2 Acres",
    area_acres: 1.2,
    location: "Patancheru, Hyderabad",
    orr_distance_km: 5,
    short_description: "High-visibility commercial plot adjacent to NH 65.",
    description: "Prime commercial plot with wide road frontage, ideal for showrooms, warehouse, or corporate offices. Direct access to the Mumbai Highway and Outer Ring Road.",
    highlights: ["Highway Facing", "High Footfall Zone", "Commercial Zone Use Approved", "5 km from ORR Junction"],
    amenities: ["High-tension Power Line", "Wide Access Roads", "Water Supply", "Commercial Drainage"],
    images: ["/images/56a846ecc_generated_29ead173.png"],
    featured: true,
    verified: true,
    created_date: "2026-07-03T12:00:00Z"
  },
  {
    id: "prop-4",
    title: "Bhoodevi Green Meadows",
    slug: "bhoodevi-green-meadows",
    type: "Open Plots",
    status: "Available",
    price: 3200000,
    price_unit: "Total",
    area: "250 Sq.Yds",
    area_acres: 0.05,
    location: "Adibatla, Hyderabad",
    orr_distance_km: 8,
    short_description: "Aesthetic open plots near TCS Adibatla IT Hub.",
    description: "A beautifully planned layout close to the Aerospace and IT corridor of Adibatla. Fully surveyed, clearly demarcated, and registered plots with excellent connectivity.",
    highlights: ["Near IT & Aerospace Hub", "Clear Layout Copy & Plan", "Immediate Registration", "8 km from ORR Exit"],
    amenities: ["Security Gate", "Water Supply", "Gravel Roads", "Electricity Connectivity"],
    images: ["/images/34c9a594c_generated_902be099.png"],
    featured: true,
    verified: true,
    created_date: "2026-07-04T12:00:00Z"
  },
  {
    id: "prop-5",
    title: "Outer Ring Road Corridor Investment Land",
    slug: "orr-corridor-investment-land",
    type: "Investment Lands",
    status: "Available",
    price: 28000000,
    price_unit: "Total",
    area: "3.5 Acres",
    area_acres: 3.5,
    location: "Tukkuguda, Hyderabad",
    orr_distance_km: 3,
    short_description: "High-appreciation acreage near future growth corridors.",
    description: "Premium land parcel strategically located in Tukkuguda, slated for high commercial and residential growth. Ideal for long-term land banking or developer layouts.",
    highlights: ["High Appreciation Potential", "Fast-growing IT/Commercial Hub", "Survey Demarcation Done", "3 km from ORR Exit"],
    amenities: ["Road Access", "Power Access", "Clear Fencing"],
    images: ["/images/f56023324_generated_6d11b046.png"],
    featured: true,
    verified: true,
    created_date: "2026-07-05T12:00:00Z"
  },
  {
    id: "prop-6",
    title: "Krishna Valley Agricultural Land",
    slug: "krishna-valley-agricultural-land",
    type: "Agricultural",
    status: "Available",
    price: 15000000,
    price_unit: "Total",
    area: "5 Acres",
    area_acres: 5,
    location: "Chevella, Hyderabad",
    orr_distance_km: 28,
    short_description: "Highly fertile agricultural land with rich ground water.",
    description: "5 acres of highly cultivable land in Chevella, ideal for organic farming, greenhouse setups, or setting up a personal farmhouse estate. Contains deep red soil and direct road connectivity.",
    highlights: ["Highly Fertile Red Soil", "Borewell & Water Tank Built", "Clear Title with Single Owner", "28 km from ORR"],
    amenities: ["Borewell Water", "Power Connection", "Caretaker Room", "Approach Road"],
    images: ["/images/ab77b02ef_generated_dba33d3f.png"],
    featured: true,
    verified: true,
    created_date: "2026-07-06T12:00:00Z"
  },
  {
    id: "prop-7",
    title: "Bhoodevi Heritage Estate",
    slug: "bhoodevi-heritage-estate",
    type: "Residential",
    status: "Available",
    price: 95000000,
    price_unit: "Total",
    area: "1.5 Acres",
    area_acres: 1.5,
    location: "Gachibowli, Hyderabad",
    orr_distance_km: 2,
    short_description: "Ultra-exclusive private land estate in Gachibowli.",
    description: "Tucked away in the luxury residential sector of Gachibowli, this private land estate offers unparalleled privacy while being minutes away from the Financial District. Ideal for constructing a bespoke signature mansion.",
    highlights: ["Ultra-luxury Location", "Private Gated Access", "Gachibowli-Financial District Corridor", "2 km from ORR"],
    amenities: ["Private Security Gate", "Borewell & Corporation Water", "Tree-lined Walkways", "High-walled Boundary"],
    images: ["/images/7a0e880ec_generated_a61bcacb.png"],
    featured: true,
    verified: true,
    created_date: "2026-07-07T12:00:00Z"
  }
];

const SEEDED_FAQS = [
  {
    id: "faq-1",
    question: "Are all the properties listed verified?",
    answer: "Yes, every single land parcel listed on Bhoodevi Properties undergoes a rigorous legal scrutiny by our expert panel of advocates before it is displayed.",
    order: 1
  },
  {
    id: "faq-2",
    question: "Do you assist with registration and mutation?",
    answer: "Absolutely. We offer complete in-house assistance for title searches, registry, mutation, and updating land records (patta transfer).",
    order: 2
  },
  {
    id: "faq-3",
    question: "Can we schedule a site visit?",
    answer: "Yes, we arrange scheduled site visits with a concierge vehicle and an on-site surveyor to explain boundary coordinates and soil conditions.",
    order: 3
  }
];

const SEEDED_TESTIMONIALS = [
  {
    id: "t-1",
    name: "Ramesh K.",
    location: "Tech Entrepreneur, Shankarpally",
    review: "Acquiring farm land in Shankarpally was seamless. The legal documentation check by Bhoodevi gave me absolute confidence.",
    rating: 5
  },
  {
    id: "t-2",
    name: "Priya Reddy",
    location: "NRI Investor, Tukkuguda",
    review: "The ROI projection for the Tukkuguda corridor was spot on. Highly professional land banking service.",
    rating: 5
  },
  {
    id: "t-3",
    name: "Anand Naidu",
    location: "Retired Senior Advocate, Gachibowli",
    review: "I appreciate their dedication to clear titles. A rare trait in the Hyderabad land market.",
    rating: 5
  }
];

// Simple .env parser
const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error("Error: .env file not found. Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const getEnvVar = (name) => {
  const lines = envContent.split('\n');
  for (const line of lines) {
    const parts = line.split('=');
    if (parts[0]?.trim() === name) {
      return parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return null;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log("Connecting to Supabase at:", supabaseUrl);

  console.log("\n1. Seeding properties...");
  // Map properties to fit database table schema (using generated UUIDs or mapping existing ones)
  const propertiesData = SEEDED_PROPERTIES.map(p => {
    const dbProp = { ...p };
    // Map text IDs to UUID-like format or let Supabase auto-generate.
    // For consistency we can map prop-1 to prop-7, but PostgreSQL UUID requires UUID format.
    // Let's generate a namespace UUID or translate existing IDs to dummy UUIDs.
    dbProp.id = `00000000-0000-0000-0000-00000000000${p.id.split('-')[1]}`;
    delete dbProp.created_date;
    dbProp.created_at = p.created_date;
    return dbProp;
  });

  const { error: propError } = await supabase.from('properties').upsert(propertiesData);
  if (propError) {
    console.error("Error seeding properties:", propError.message);
  } else {
    console.log("Seeded properties successfully!");
  }

  console.log("\n2. Seeding FAQs...");
  const faqsData = SEEDED_FAQS.map(f => {
    const dbFaq = { ...f };
    dbFaq.id = `00000000-0000-0000-0000-00000000000${f.id.split('-')[1]}`;
    delete dbFaq.order;
    dbFaq.order_num = f.order;
    return dbFaq;
  });

  const { error: faqError } = await supabase.from('faqs').upsert(faqsData);
  if (faqError) {
    console.error("Error seeding FAQs:", faqError.message);
  } else {
    console.log("Seeded FAQs successfully!");
  }

  console.log("\n3. Seeding Testimonials...");
  const testimonialsData = SEEDED_TESTIMONIALS.map(t => {
    const dbTest = { ...t };
    dbTest.id = `00000000-0000-0000-0000-00000000001${t.id.split('-')[1]}`;
    return dbTest;
  });

  const { error: testError } = await supabase.from('testimonials').upsert(testimonialsData);
  if (testError) {
    console.error("Error seeding testimonials:", testError.message);
  } else {
    console.log("Seeded testimonials successfully!");
  }

  console.log("\nSeed operation complete.");
}

seed().catch(err => {
  console.error("Unhandle exception during seed:", err);
});

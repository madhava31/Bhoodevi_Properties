import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isSupabaseEnabled = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("your-project-id");

// LocalStorage helpers for persistence across refreshes and new tabs
const STORAGE_KEYS = {
  PROPERTIES: "bhoodevi_properties",
  FAQS: "bhoodevi_faqs",
  TESTIMONIALS: "bhoodevi_testimonials",
  INQUIRIES: "bhoodevi_inquiries"
};

const getStorageItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setStorageItem = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error("Storage write failed:", err);
  }
};

// Seed Data
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
    question: "Can we schedule a call appointment?",
    answer: "Yes, we arrange scheduled call appointments to review property details, title deeds, and map locations with our project heads.",
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

// Initialize dynamic array states from LocalStorage or seeded defaults
let PROPERTIES = getStorageItem(STORAGE_KEYS.PROPERTIES, SEEDED_PROPERTIES);
let FAQS = getStorageItem(STORAGE_KEYS.FAQS, SEEDED_FAQS);
let TESTIMONIALS = getStorageItem(STORAGE_KEYS.TESTIMONIALS, SEEDED_TESTIMONIALS);
let INQUIRIES = getStorageItem(STORAGE_KEYS.INQUIRIES, []);

const filterData = (data, criteria) => {
  return data.filter(item => {
    for (const key in criteria) {
      if (item[key] !== criteria[key]) {
        return false;
      }
    }
    return true;
  });
};

// Initialize the global mock DB structure
// Initialize the global mock DB structure or connect to Supabase
if (!globalThis.__BHOODEVI_DB__) {
  if (isSupabaseEnabled) {
    try {
      localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    } catch (e) {}
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    globalThis.__BHOODEVI_DB__ = {
      __isMock: false,
      auth: {
        isAuthenticated: async () => {
          const { data: { session } } = await supabase.auth.getSession();
          return !!session;
        },
        me: async () => {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error || !user) return null;
          return {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0],
            role: user.app_metadata?.role || 'admin'
          };
        },
        loginViaEmailPassword: async (email, password) => {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          return data.user;
        },
        register: async ({ email, password }) => {
          const { data, error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          return data;
        },
        verifyOtp: async ({ email, otpCode }) => {
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: otpCode,
            type: 'signup'
          });
          if (error) throw error;
          return { access_token: data.session?.access_token };
        },
        resendOtp: async (email) => {
          const { error } = await supabase.auth.resend({
            email,
            type: 'signup'
          });
          if (error) throw error;
        },
        loginWithProvider: async (provider, redirectTo) => {
          const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: window.location.origin + (redirectTo || '/')
            }
          });
          if (error) throw error;
        },
        setToken: (token) => {}
      },
      entities: {
        Property: {
          list: async (order, limit) => {
            let query = supabase.from('properties').select('*');
            if (order) {
              const desc = order.startsWith("-");
              const column = desc ? order.slice(1) : order;
              const colName = column === 'created_date' ? 'created_at' : column;
              query = query.order(colName, { ascending: !desc });
            }
            if (limit) {
              query = query.limit(limit);
            }
            const { data, error } = await query;
            if (error) throw error;
            return (data || []).map(p => ({ ...p, created_date: p.created_at }));
          },
          filter: async (criteria, order, limit) => {
            let query = supabase.from('properties').select('*');
            for (const key in criteria) {
              const dbKey = key === 'created_date' ? 'created_at' : key;
              query = query.eq(dbKey, criteria[key]);
            }
            if (order) {
              const desc = order.startsWith("-");
              const column = desc ? order.slice(1) : order;
              const colName = column === 'created_date' ? 'created_at' : column;
              query = query.order(colName, { ascending: !desc });
            }
            if (limit) {
              query = query.limit(limit);
            }
            const { data, error } = await query;
            if (error) throw error;
            return (data || []).map(p => ({ ...p, created_date: p.created_at }));
          },
          get: async (id) => {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
            let query = supabase.from('properties').select('*');
            if (isUuid) {
              query = query.eq('id', id);
            } else {
              query = query.eq('slug', id);
            }
            const { data, error } = await query.maybeSingle();
            if (error) throw error;
            if (!data) return null;
            return { ...data, created_date: data.created_at };
          },
          create: async (data) => {
            const insertData = { ...data };
            delete insertData.id;
            delete insertData.created_date;
            const { data: created, error } = await supabase
              .from('properties')
              .insert([insertData])
              .select()
              .single();
            if (error) throw error;
            return { ...created, created_date: created.created_at };
          },
          update: async (id, data) => {
            const updateData = { ...data };
            delete updateData.id;
            delete updateData.created_date;
            delete updateData.created_at;
            const { data: updated, error } = await supabase
              .from('properties')
              .update(updateData)
              .eq('id', id)
              .select()
              .single();
            if (error) throw error;
            return { ...updated, created_date: updated.created_at };
          },
          delete: async (id) => {
            const { error } = await supabase
              .from('properties')
              .delete()
              .eq('id', id);
            if (error) throw error;
            return {};
          },
        },
        FAQ: {
          list: async (order, limit) => {
            let query = supabase.from('faqs').select('*');
            query = query.order('order_num', { ascending: true });
            if (limit) query = query.limit(limit);
            const { data, error } = await query;
            if (error) throw error;
            return (data || []).map(f => ({ ...f, order: f.order_num }));
          },
          filter: async (criteria, order, limit) => {
            let query = supabase.from('faqs').select('*');
            for (const key in criteria) {
              const dbKey = key === 'order' ? 'order_num' : key;
              query = query.eq(dbKey, criteria[key]);
            }
            query = query.order('order_num', { ascending: true });
            if (limit) query = query.limit(limit);
            const { data, error } = await query;
            if (error) throw error;
            return (data || []).map(f => ({ ...f, order: f.order_num }));
          },
          get: async (id) => {
            const { data, error } = await supabase.from('faqs').select('*').eq('id', id).maybeSingle();
            if (error) throw error;
            if (!data) return null;
            return { ...data, order: data.order_num };
          },
          create: async (data) => {
            const insertData = { ...data };
            if (insertData.order !== undefined) {
              insertData.order_num = insertData.order;
              delete insertData.order;
            }
            const { data: created, error } = await supabase.from('faqs').insert([insertData]).select().single();
            if (error) throw error;
            return { ...created, order: created.order_num };
          },
          update: async (id, data) => {
            const updateData = { ...data };
            if (updateData.order !== undefined) {
              updateData.order_num = updateData.order;
              delete updateData.order;
            }
            const { data: updated, error } = await supabase.from('faqs').update(updateData).eq('id', id).select().single();
            if (error) throw error;
            return { ...updated, order: updated.order_num };
          },
          delete: async (id) => {
            const { error } = await supabase.from('faqs').delete().eq('id', id);
            if (error) throw error;
            return {};
          },
        },
        Testimonial: {
          list: async (order, limit) => {
            let query = supabase.from('testimonials').select('*');
            query = query.order('created_at', { ascending: false });
            if (limit) query = query.limit(limit);
            const { data, error } = await query;
            if (error) throw error;
            return data || [];
          },
          filter: async (criteria, order, limit) => {
            let query = supabase.from('testimonials').select('*');
            for (const key in criteria) {
              query = query.eq(key, criteria[key]);
            }
            query = query.order('created_at', { ascending: false });
            if (limit) query = query.limit(limit);
            const { data, error } = await query;
            if (error) throw error;
            return data || [];
          },
          get: async (id) => {
            const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).maybeSingle();
            if (error) throw error;
            return data;
          },
          create: async (data) => {
            const { data: created, error } = await supabase.from('testimonials').insert([data]).select().single();
            if (error) throw error;
            return created;
          },
          update: async (id, data) => {
            const { data: updated, error } = await supabase.from('testimonials').update(data).eq('id', id).select().single();
            if (error) throw error;
            return updated;
          },
          delete: async (id) => {
            const { error } = await supabase.from('testimonials').delete().eq('id', id);
            if (error) throw error;
            return {};
          },
        },
        Inquiry: {
          list: async () => {
            const { data: inqs, error: inqError } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
            if (inqError) throw inqError;
            
            const { data: props, error: propError } = await supabase.from('properties').select('id, title');
            const propMap = {};
            if (!propError && props) {
              props.forEach(p => { propMap[p.id] = p.title; });
            }
            
            return (inqs || []).map(i => ({
              ...i,
              created_date: i.created_at,
              property_title: propMap[i.property_id] || null
            }));
          },
          filter: async (criteria) => {
            const queryCriteria = { ...criteria };
            delete queryCriteria.type;
            delete queryCriteria.property_title;
            
            let query = supabase.from('inquiries').select('*');
            for (const key in queryCriteria) {
              const dbKey = key === 'created_date' ? 'created_at' : key;
              query = query.eq(dbKey, queryCriteria[key]);
            }
            const { data: inqs, error: inqError } = await query.order('created_at', { ascending: false });
            if (inqError) throw inqError;
            
            const { data: props, error: propError } = await supabase.from('properties').select('id, title');
            const propMap = {};
            if (!propError && props) {
              props.forEach(p => { propMap[p.id] = p.title; });
            }
            
            return (inqs || []).map(i => ({
              ...i,
              created_date: i.created_at,
              property_title: propMap[i.property_id] || null
            }));
          },
          get: async (id) => {
            const { data: inq, error: inqError } = await supabase.from('inquiries').select('*').eq('id', id).maybeSingle();
            if (inqError) throw inqError;
            if (!inq) return null;
            
            let property_title = null;
            if (inq.property_id) {
              const { data: prop } = await supabase.from('properties').select('title').eq('id', inq.property_id).maybeSingle();
              if (prop) property_title = prop.title;
            }
            
            return {
              ...inq,
              created_date: inq.created_at,
              property_title
            };
          },
          create: async (data) => {
            const insertData = {
              name: data.name,
              email: data.email,
              phone: data.phone,
              message: data.message,
              property_id: data.property_id || null
            };
            const { data: created, error } = await supabase.from('inquiries').insert([insertData]).select().single();
            if (error) throw error;
            
            let property_title = null;
            if (created.property_id) {
              const { data: prop } = await supabase.from('properties').select('title').eq('id', created.property_id).maybeSingle();
              if (prop) property_title = prop.title;
            }
            
            return {
              ...created,
              created_date: created.created_at,
              property_title
            };
          },
          update: async (id, data) => {
            const updateData = {
              name: data.name,
              email: data.email,
              phone: data.phone,
              message: data.message,
              property_id: data.property_id || null
            };
            const { data: updated, error } = await supabase.from('inquiries').update(updateData).eq('id', id).select().single();
            if (error) throw error;
            
            let property_title = null;
            if (updated.property_id) {
              const { data: prop } = await supabase.from('properties').select('title').eq('id', updated.property_id).maybeSingle();
              if (prop) property_title = prop.title;
            }
            
            return {
              ...updated,
              created_date: updated.created_at,
              property_title
            };
          },
          delete: async (id) => {
            const { error } = await supabase.from('inquiries').delete().eq('id', id);
            if (error) throw error;
            return {};
          },
        }
      },
      integrations: {
        Core: {
          UploadFile: async () => ({ file_url: '/images/7a0e880ec_generated_a61bcacb.png' })
        }
      }
    };
  } else {
    globalThis.__BHOODEVI_DB__ = {
      __isMock: true,
      auth: {
        isAuthenticated: async () => true,
        me: async () => ({ name: "Local User", email: "user@local.dev", role: "admin" }),
      },
      entities: {
        Property: {
          list: async (order, limit) => {
            let sorted = [...PROPERTIES];
            if (order && order.startsWith("-")) {
              const field = order.slice(1);
              sorted.sort((a, b) => new Date(b[field] || b.created_date) - new Date(a[field] || a.created_date));
            }
            return sorted.slice(0, limit);
          },
          filter: async (criteria, order, limit) => {
            let filtered = filterData(PROPERTIES, criteria);
            let sorted = [...filtered];
            if (order && order.startsWith("-")) {
              const field = order.slice(1);
              sorted.sort((a, b) => new Date(b[field] || b.created_date) - new Date(a[field] || a.created_date));
            }
            return sorted.slice(0, limit);
          },
          get: async (id) => PROPERTIES.find(p => p.id === id || p.slug === id) || null,
          create: async (data) => {
            const newProp = {
              id: "prop-" + Date.now(),
              created_date: new Date().toISOString(),
              verified: true,
              featured: false,
              status: "Available",
              ...data,
            };
            PROPERTIES.unshift(newProp);
            setStorageItem(STORAGE_KEYS.PROPERTIES, PROPERTIES);
            return newProp;
          },
          update: async (id, data) => {
            PROPERTIES = PROPERTIES.map(p => p.id === id ? { ...p, ...data } : p);
            setStorageItem(STORAGE_KEYS.PROPERTIES, PROPERTIES);
            return PROPERTIES.find(p => p.id === id);
          },
          delete: async (id) => {
            PROPERTIES = PROPERTIES.filter(p => p.id !== id);
            setStorageItem(STORAGE_KEYS.PROPERTIES, PROPERTIES);
            return {};
          },
        },
        FAQ: {
          list: async (order, limit) => FAQS.slice(0, limit),
          filter: async (criteria, order, limit) => filterData(FAQS, criteria).slice(0, limit),
          get: async (id) => FAQS.find(f => f.id === id) || null,
          create: async (data) => {
            FAQS.unshift(data);
            setStorageItem(STORAGE_KEYS.FAQS, FAQS);
            return data;
          },
          update: async (id, data) => {
            FAQS = FAQS.map(f => f.id === id ? { ...f, ...data } : f);
            setStorageItem(STORAGE_KEYS.FAQS, FAQS);
            return data;
          },
          delete: async (id) => {
            FAQS = FAQS.filter(f => f.id !== id);
            setStorageItem(STORAGE_KEYS.FAQS, FAQS);
            return {};
          },
        },
        Testimonial: {
          list: async (order, limit) => TESTIMONIALS.slice(0, limit),
          filter: async (criteria, order, limit) => filterData(TESTIMONIALS, criteria).slice(0, limit),
          get: async (id) => TESTIMONIALS.find(t => t.id === id) || null,
          create: async (data) => {
            TESTIMONIALS.unshift(data);
            setStorageItem(STORAGE_KEYS.TESTIMONIALS, TESTIMONIALS);
            return data;
          },
          update: async (id, data) => {
            TESTIMONIALS = TESTIMONIALS.map(t => t.id === id ? { ...t, ...data } : t);
            setStorageItem(STORAGE_KEYS.TESTIMONIALS, TESTIMONIALS);
            return data;
          },
          delete: async (id) => {
            TESTIMONIALS = TESTIMONIALS.filter(t => t.id !== id);
            setStorageItem(STORAGE_KEYS.TESTIMONIALS, TESTIMONIALS);
            return {};
          },
        },
        Inquiry: {
          list: async () => {
            const propMap = {};
            PROPERTIES.forEach(p => {
              propMap[p.id] = p.title;
            });
            return INQUIRIES.map(i => ({
              ...i,
              property_title: i.property_title || propMap[i.property_id] || null
            }));
          },
          filter: async (criteria) => {
            const propMap = {};
            PROPERTIES.forEach(p => {
              propMap[p.id] = p.title;
            });
            const mapped = INQUIRIES.map(i => ({
              ...i,
              property_title: i.property_title || propMap[i.property_id] || null
            }));
            return filterData(mapped, criteria);
          },
          get: async (id) => {
            const inq = INQUIRIES.find(i => i.id === id);
            if (!inq) return null;
            const prop = PROPERTIES.find(p => p.id === inq.property_id);
            return {
              ...inq,
              property_title: inq.property_title || (prop ? prop.title : null)
            };
          },
          create: async (data) => {
            const newInq = {
              id: "inquiry-" + Date.now(),
              created_date: new Date().toISOString(),
              ...data
            };
            const prop = PROPERTIES.find(p => p.id === data.property_id);
            newInq.property_title = prop ? prop.title : null;
            INQUIRIES.unshift(newInq);
            setStorageItem(STORAGE_KEYS.INQUIRIES, INQUIRIES);
            return newInq;
          },
          update: async (id, data) => data,
          delete: async (id) => ({}),
        }
      },
      integrations: {
        Core: {
          UploadFile: async () => ({ file_url: '/images/7a0e880ec_generated_a61bcacb.png' })
        }
      }
    };
  }
}

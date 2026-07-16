const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import PropertyCard from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/Skeleton";
import { PROPERTY_TYPES, ORR_DISTANCES, formatPrice } from "@/lib/site";
import { Search, SlidersHorizontal, LayoutGrid, List, Map as MapIcon, X, MapPin } from "lucide-react";
import FilterSelect from "@/components/FilterSelect";

const PAGE_SIZE = 9;

export default function Properties() {
  const [params, setParams] = useSearchParams();
  const [all, setAll] = useState(null);
  const [query, setQuery] = useState("");
  const [type, setType] = useState(params.get("type") || "");
  const [maxPrice, setMaxPrice] = useState("");
  const [orr, setOrr] = useState("");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    db.entities.Property.list("-created_date", 100).then(setAll).catch(() => setAll([]));
  }, []);

  useEffect(() => { setType(params.get("type") || ""); }, [params]);

  const filtered = useMemo(() => {
    if (!all) return [];
    let r = all.filter((p) => {
      if (type && p.type !== type) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!(`${p.title} ${p.location} ${p.short_description || ""}`.toLowerCase().includes(q))) return false;
      }
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (orr) {
        const d = p.orr_distance_km ?? 999;
        const [lo, hi] = orr === "50+" ? [50, Infinity] : orr.split("-").map(Number);
        if (d < lo || d > hi) return false;
      }
      return true;
    });
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [all, type, query, maxPrice, orr, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(0, page * PAGE_SIZE);

  const resetFilters = () => {
    setQuery(""); setType(""); setMaxPrice(""); setOrr(""); setSort("newest");
    setParams({});
  };

  const activeChips = [];
  if (type) activeChips.push({ key: "type", label: type });
  if (maxPrice) activeChips.push({ key: "maxPrice", label: `Under ${formatPrice(Number(maxPrice))}` });
  if (orr) activeChips.push({ key: "orr", label: ORR_DISTANCES.find((d) => d.value === orr)?.label });

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="relative py-14 md:py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 topo-bg opacity-20" />
        <div className="relative mx-auto max-w-8xl px-5 md:px-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-accent" />
            <span className="label-tech">The Archive</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl">Estates</h1>
          <p className="mt-3 text-primary-foreground/75 max-w-xl">Browse verified land parcels across Hyderabad's high-growth corridors.</p>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-[68px] z-30 glass border-b border-border">
        <div className="mx-auto max-w-8xl px-5 md:px-10 py-3 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by name, location..."
              className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium hover:border-accent hover:text-accent transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="hidden sm:flex items-center rounded-full border border-border p-1">
            <button onClick={() => setView("grid")} className={`grid place-items-center w-9 h-9 rounded-full transition-colors ${view === "grid" ? "bg-primary text-primary-foreground" : ""}`} aria-label="Grid view"><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} className={`grid place-items-center w-9 h-9 rounded-full transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : ""}`} aria-label="List view"><List className="w-4 h-4" /></button>
            <button onClick={() => setView("map")} className={`grid place-items-center w-9 h-9 rounded-full transition-colors ${view === "map" ? "bg-primary text-primary-foreground" : ""}`} aria-label="Map view"><MapIcon className="w-4 h-4" /></button>
          </div>
        </div>

        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="mx-auto max-w-8xl px-5 md:px-10 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FilterField label="Property Type">
                  <FilterSelect
                    value={type}
                    onChange={(v) => { setType(v); setPage(1); }}
                    placeholder="All Types"
                    options={[{ value: "", label: "All Types" }, ...PROPERTY_TYPES.map((t) => ({ value: t, label: t }))]}
                  />
                </FilterField>
                <FilterField label="Max Budget">
                  <FilterSelect
                    value={maxPrice}
                    onChange={(v) => { setMaxPrice(v); setPage(1); }}
                    placeholder="Any Budget"
                    options={[
                      { value: "", label: "Any Budget" },
                      { value: "5000000", label: "Under ₹5 L" },
                      { value: "25000000", label: "Under ₹25 L" },
                      { value: "100000000", label: "Under ₹1 Cr" },
                      { value: "500000000", label: "Under ₹5 Cr" }
                    ]}
                  />
                </FilterField>
                <FilterField label="Distance from ORR">
                  <FilterSelect
                    value={orr}
                    onChange={(v) => { setOrr(v); setPage(1); }}
                    placeholder="Any Distance"
                    options={[{ value: "", label: "Any Distance" }, ...ORR_DISTANCES.map((d) => ({ value: d.value, label: d.label }))]}
                  />
                </FilterField>
                <FilterField label="Sort By">
                  <FilterSelect
                    value={sort}
                    onChange={setSort}
                    placeholder="Newest"
                    options={[
                      { value: "newest", label: "Newest" },
                      { value: "price-asc", label: "Price: Low to High" },
                      { value: "price-desc", label: "Price: High to Low" }
                    ]}
                  />
                </FilterField>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeChips.length > 0 && (
          <div className="mx-auto max-w-8xl px-5 md:px-10 pb-3 flex flex-wrap items-center gap-2">
            {activeChips.map((c) => (
              <button key={c.key} onClick={() => {
                if (c.key === "type") { setType(""); setParams({}); }
                if (c.key === "maxPrice") setMaxPrice("");
                if (c.key === "orr") setOrr("");
                setPage(1);
              }} className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-medium hover:bg-accent/20">
                {c.label} <X className="w-3 h-3" />
              </button>
            ))}
            <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-foreground underline">Reset all</button>
          </div>
        )}
      </section>

      {/* Results */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-8xl px-5 md:px-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {all === null ? "Loading…" : `${filtered.length} estate${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>

          {all === null ? (
            <div className={`grid gap-5 ${view === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
              {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : view === "map" ? (
            <MapView items={filtered} />
          ) : (
            <motion.div layout className={`grid gap-5 ${view === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
              <AnimatePresence>
                {paged.map((p, i) => (
                  <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <PropertyCard property={p} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {paged.length < filtered.length && (
            <div className="mt-12 text-center">
              <button onClick={() => setPage((p) => p + 1)} className="rounded-full border border-border px-7 py-3 font-semibold hover:border-accent hover:text-accent transition-colors">
                Load more estates
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

function FilterField({ label, children }) {
  return (
    <label className="block">
      <span className="label-tech mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="text-center py-24">
      <div className="grid place-items-center w-16 h-16 rounded-full bg-muted mx-auto mb-4">
        <MapPin className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="font-display text-2xl">No estates match your search</h3>
      <p className="text-muted-foreground mt-2">Try widening your filters or resetting.</p>
      <button onClick={onReset} className="mt-5 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold">Reset filters</button>
    </div>
  );
}

function MapView({ items }) {
  const [sel, setSel] = useState(null);
  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-border bg-muted min-h-[420px] topo-bg">
        <div className="absolute inset-0 p-6">
          <div className="relative w-full h-full">
            {items.map((p, i) => {
              const x = ((p.longitude || 78.3) - 78.2) * 600 + 200 + (i % 5) * 30;
              const y = (17.5 - (p.latitude || 17.4)) * 600 + 100 + (i % 4) * 25;
              return (
                <button
                  key={p.id}
                  onClick={() => setSel(p)}
                  style={{ left: `${Math.min(90, Math.max(5, (x % 800) / 8))}%`, top: `${Math.min(85, Math.max(10, (y % 600) / 6))}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full border-2 shadow-md transition-transform hover:scale-125 ${sel?.id === p.id ? "bg-accent border-accent scale-125" : "bg-primary border-background text-primary-foreground"}`}
                  title={p.title}
                >
                  <MapPin className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 glass rounded-xl px-4 py-2 text-xs text-muted-foreground">
          {items.length} estates · Interactive surveyor map
        </div>
      </div>
      <div>
        {sel ? (
          <PropertyCard property={sel} />
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 text-center h-full grid place-items-center">
            <div>
              <MapIcon className="w-8 h-8 text-accent mx-auto mb-3" />
              <p className="font-display text-xl">Select a parcel</p>
              <p className="text-sm text-muted-foreground mt-1">Click any marker to preview the estate.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
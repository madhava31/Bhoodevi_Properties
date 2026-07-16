const db = globalThis.__BHOODEVI_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PropertyCard from "@/components/PropertyCard";
import SectionTitle from "@/components/SectionTitle";
import { PropertyCardSkeleton } from "@/components/Skeleton";
import { ArrowRight } from "lucide-react";

export default function FeaturedProperties() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    db.entities.Property.filter({ featured: true }, "-created_date", 6)
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-8xl px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionTitle
            align="left"
            eyebrow="Featured"
            title={<>The <span className="text-accent">Archive</span></>}
            subtitle="A curated selection of verified estates — surveyed, titled, and ready for acquisition."
          />
          <Link to="/properties" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors shrink-0">
            View all estates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {items === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">Featured estates will appear here shortly.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { Link } from "react-router-dom";
import { Home, Leaf, Building2, Grid3x3, TrendingUp, Wheat, ArrowUpRight, Map as MapIcon } from "lucide-react";
import { CATEGORIES } from "@/lib/site";
import SectionTitle from "@/components/SectionTitle";
import { StaggerGroup, StaggerItem } from "@/components/ScrollReveal";

const ICONS = { Home, Leaf, Building2, Grid3x3, TrendingUp, Wheat, Map: MapIcon };

const FALLBACK_IMG = "/images/7a0e880ec_generated_a61bcacb.png";

const catImages = {
  "Residential": "/images/057d0192b_generated_c24618f0.png",
  "Farm Lands": "/images/8ccca91be_generated_07473839.png",
  "Commercial": "/images/56a846ecc_generated_29ead173.png",
  "Open Plots": "/images/34c9a594c_generated_902be099.png",
  "Investment Lands": "/images/f56023324_generated_6d11b046.png",
  "Agricultural": "/images/ab77b02ef_generated_dba33d3f.png",
};

export default function Categories() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-8xl px-5 md:px-10">
        <SectionTitle
          eyebrow="The Archive"
          title={<>Estates, by <span className="text-accent">discipline</span></>}
          subtitle="Six curated categories of land — each verified, surveyed, and ready for legacy."
        />
        <StaggerGroup className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((c) => {
            const Icon = ICONS[c.icon] || MapIcon;
            return (
              <StaggerItem key={c.name}>
                <Link
                  to={`/properties?type=${encodeURIComponent(c.name)}`}
                  className="group relative block rounded-2xl overflow-hidden border border-border aspect-[4/5]"
                >
                  <img src={catImages[c.name] || FALLBACK_IMG} alt={c.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute inset-4 border border-accent/0 group-hover:border-accent/40 transition-colors duration-500" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-background">
                    <span className="grid place-items-center w-11 h-11 rounded-full border border-accent/50 text-accent mb-3 backdrop-blur-sm">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="font-display text-3xl">{c.name}</h3>
                        <p className="text-sm text-background/70 mt-1">{c.blurb}</p>
                      </div>
                      <span className="grid place-items-center w-9 h-9 rounded-full bg-accent text-accent-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
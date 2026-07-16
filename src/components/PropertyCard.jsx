const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Maximize, BadgeCheck, Heart, Share2, Eye, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/site";
import { cn } from "@/lib/utils";

const statusStyles = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Booked: "bg-amber-50 text-amber-700 border-amber-200",
  Sold: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function PropertyCard({ property, index = 0 }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glint, setGlint] = useState({ x: 50, y: 50 });
  const [liked, setLiked] = useState(false);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: (py - 0.5) * -10, y: (px - 0.5) * 12 });
    setGlint({ x: px * 100, y: py * 100 });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  const img = property.images?.[0] || "/images/7a0e880ec_generated_a61bcacb.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="perspective-1000"
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        className="group preserve-3d relative rounded-2xl overflow-hidden border border-border bg-card transition-transform duration-200 ease-out hover:shadow-2xl hover:shadow-primary/10"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={img}
            alt={property.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Glint */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: `radial-gradient(circle at ${glint.x}% ${glint.y}%, rgba(255,255,255,0.35), transparent 45%)` }}
          />
          {/* Luma matte */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between" style={{ transform: "translateZ(40px)" }}>
            <div className="flex flex-col gap-2">
              <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm", statusStyles[property.status] || statusStyles.Available)}>
                {property.status}
              </span>
              {property.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground backdrop-blur-sm">
                  <BadgeCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
                className="grid place-items-center w-8 h-8 rounded-full glass border border-white/20 hover:border-accent transition-colors"
                aria-label="Save"
              >
                <Heart className={cn("w-3.5 h-3.5", liked && "fill-accent text-accent")} />
              </button>
              <button className="grid place-items-center w-8 h-8 rounded-full glass border border-white/20 hover:border-accent transition-colors" aria-label="Share">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Type tag */}
          <div className="absolute bottom-4 left-4" style={{ transform: "translateZ(30px)" }}>
            <span className="label-tech !text-[9px] !text-background/80">{property.type}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl leading-tight">{property.title}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                {property.location}
              </div>
            </div>
            <Link
              to={`/properties/${property.slug || property.id}`}
              className="shrink-0 grid place-items-center w-9 h-9 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="View details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{property.short_description}</p>

          {/* Technical ribbon */}
          <div className="mt-4 pt-4 border-t border-border/70 grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
            <div>
              <div className="text-foreground font-semibold">{property.area}</div>
              <div className="text-muted-foreground">Area</div>
            </div>
            <div className="border-x border-border/70">
              <div className="text-foreground font-semibold">{property.orr_distance_km != null ? `${property.orr_distance_km} km` : "—"}</div>
              <div className="text-muted-foreground">From ORR</div>
            </div>
            <div>
              <div className="text-accent font-semibold">{formatPrice(property.price)}</div>
              <div className="text-muted-foreground">{property.price_unit || "Total"}</div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              to={`/properties/${property.slug || property.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> View Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
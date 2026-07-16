const db = globalThis.__BHOODEVI_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

import PropertyCard from "@/components/PropertyCard";
import InquiryForm from "@/components/InquiryForm";
import { formatPrice, SITE } from "@/lib/site";
import Skeleton from "@/components/Skeleton";
import {
  MapPin, Maximize, BadgeCheck, Phone, MessageCircle, Calendar,
  ChevronLeft, ChevronRight, Check, Download, Compass, Home, ArrowLeft, X
} from "lucide-react";

export default function PropertyDetail() {
  const { slug } = useParams();
  const [prop, setProp] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    setProp(null); setActiveImg(0);
    db.entities.Property.filter({ slug }, "-created_date", 1)
      .then((res) => {
        if (!res.length) { setNotFound(true); return; }
        const p = res[0];
        setProp(p);
        if (p.type) {
          db.entities.Property.filter({ type: p.type }, "-created_date", 4)
            .then((r) => setRelated(r.filter((x) => x.id !== p.id).slice(0, 3)))
            .catch(() => {});
        }
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen grid place-items-center px-5">
        <div className="text-center">
          <h1 className="font-display text-5xl">Estate not found</h1>
          <p className="text-muted-foreground mt-3">This parcel may have been acquired or moved.</p>
          <Link to="/properties" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to estates
          </Link>
        </div>
      </div>
    );
  }

  if (!prop) {
    return (
      <div className="pt-24 mx-auto max-w-8xl px-5 md:px-10 py-10">
        <Skeleton className="aspect-[16/9] rounded-2xl" />
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  const images = prop.images?.length ? prop.images : ["/images/7a0e880ec_generated_a61bcacb.png"];

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-8xl px-5 md:px-10 py-5 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link to="/properties" className="hover:text-accent">Properties</Link>
        <span>/</span>
        <Link to={`/properties?type=${encodeURIComponent(prop.type)}`} className="hover:text-accent">{prop.type}</Link>
        <span>/</span>
        <span className="text-foreground truncate">{prop.title}</span>
      </div>

      {/* Gallery */}
      <div className="mx-auto max-w-8xl px-5 md:px-10">
        <div className="grid lg:grid-cols-4 gap-3">
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden group aspect-[16/10]">
            <img src={images[activeImg]} alt={prop.title} className="w-full h-full object-cover" />
            <button onClick={() => setLightbox(true)} className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full glass border border-white/20 hover:border-accent" aria-label="Fullscreen">
              <Maximize className="w-4 h-4 text-white" />
            </button>
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full glass border border-white/20 hover:border-accent" aria-label="Previous"><ChevronLeft className="w-4 h-4 text-white" /></button>
                <button onClick={() => setActiveImg((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full glass border border-white/20 hover:border-accent" aria-label="Next"><ChevronRight className="w-4 h-4 text-white" /></button>
              </>
            )}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {prop.status && <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary text-primary-foreground">{prop.status}</span>}
              {prop.verified && <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-accent text-accent-foreground"><BadgeCheck className="w-3 h-3" /> Verified</span>}
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-3">
            {images.slice(0, 4).map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-colors ${activeImg === i ? "border-accent" : "border-transparent"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Split layout */}
      <div className="mx-auto max-w-8xl px-5 md:px-10 py-12 grid lg:grid-cols-3 gap-10">
        {/* Left narrative */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-accent" />
              <span className="label-tech">{prop.type}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.05]">{prop.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-3">
              <MapPin className="w-4 h-4 text-accent" /> {prop.location}
              {prop.orr_distance_km != null && <span className="ml-2 text-sm">· {prop.orr_distance_km} km from ORR</span>}
            </div>
            {prop.short_description && <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{prop.short_description}</p>}
          </div>

          {/* Technical ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            <Stat label="Price" value={formatPrice(prop.price)} sub={prop.price_unit} />
            <Stat label="Area" value={prop.area || "—"} />
            <Stat label="From ORR" value={prop.orr_distance_km != null ? `${prop.orr_distance_km} km` : "—"} />
            <Stat label="Status" value={prop.status} />
          </div>

          {/* Description */}
          {prop.description && (
            <div>
              <h2 className="font-display text-3xl mb-4">Overview</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{prop.description}</p>
            </div>
          )}

          {/* Highlights */}
          {prop.highlights?.length > 0 && (
            <div>
              <h2 className="font-display text-3xl mb-4">Highlights</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {prop.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="grid place-items-center w-5 h-5 rounded-full bg-accent/15 text-accent shrink-0 mt-0.5"><Check className="w-3 h-3" /></span>
                    <span className="text-sm">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {prop.amenities?.length > 0 && (
            <div>
              <h2 className="font-display text-3xl mb-4">Amenities & Surround</h2>
              <div className="flex flex-wrap gap-2">
                {prop.amenities.map((a, i) => (
                  <span key={i} className="rounded-full border border-border px-4 py-1.5 text-sm">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Investment */}
          {prop.invest_roi_note && (
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-5 h-5 text-accent" />
                <span className="label-tech">Investment Note</span>
              </div>
              <p className="text-foreground/80 leading-relaxed">{prop.invest_roi_note}</p>
            </div>
          )}

          {/* Nearby */}
          {prop.nearby?.length > 0 && (
            <div>
              <h2 className="font-display text-3xl mb-4">Nearby</h2>
              <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
                {prop.nearby.map((n, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-sm font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> {n.name}</span>
                    <span className="font-mono text-sm text-muted-foreground">{n.distance_km} km</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents placeholder */}
          <div>
            <h2 className="font-display text-3xl mb-4">Documents</h2>
            <div className="space-y-2">
              {["Title Deed (EC)", "Survey Sketch", "Layout Approval", "Soil Report"].map((d, i) => (
                <button key={i} className="w-full flex items-center justify-between rounded-xl border border-border px-5 py-3.5 hover:border-accent hover:bg-accent/5 transition-colors group">
                  <span className="text-sm font-medium flex items-center gap-2"><Download className="w-4 h-4 text-accent" /> {d}</span>
                  <span className="text-xs text-muted-foreground group-hover:text-accent">Verified PDF</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky contact card */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="label-tech mb-1">Estate Price</div>
              <div className="font-display text-4xl text-primary">{formatPrice(prop.price)}</div>
              <div className="text-sm text-muted-foreground mt-1">{prop.price_unit} · {prop.area}</div>

              <div className="mt-5 space-y-2.5">
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
                    `Hello Bhoodevi Properties,\n\nI am interested in the following property:\n\n` +
                    `🏡 *${prop.title}*\n` +
                    `📍 Location: ${prop.location}\n` +
                    `🏷️ Type: ${prop.type}\n` +
                    `💰 Price: ${formatPrice(prop.price)} (${prop.price_unit})\n` +
                    `📐 Area: ${prop.area}\n` +
                    `\nPlease share more details and help me schedule a site visit.\n\n` +
                    `🔗 ${window.location.href}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white py-3 font-semibold hover:scale-[1.02] transition-transform"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Enquiry
                </a>
                <a href={`tel:${SITE.phoneRaw}`} className="flex items-center justify-center gap-2 rounded-full border border-border py-3 font-semibold hover:border-accent hover:text-accent transition-colors">
                  <Phone className="w-4 h-4" /> Call Expert
                </a>
                <button className="w-full flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Calendar className="w-4 h-4" /> Book Site Visit
                </button>
              </div>

              <hr className="gold-rule my-5" />
              <div className="label-tech mb-3">Quick Inquiry</div>
              <InquiryForm propertyTitle={prop.title} compact />
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 bg-card">
          <div className="mx-auto max-w-8xl px-5 md:px-10">
            <h2 className="font-display text-3xl md:text-4xl mb-8">Related estates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightbox && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[70] bg-black/90 grid place-items-center p-6" onClick={() => setLightbox(false)}>
          <button className="absolute top-5 right-5 grid place-items-center w-10 h-10 rounded-full border border-white/20 text-white" aria-label="Close"><X className="w-5 h-5" /></button>
          <img src={images[activeImg]} alt="" className="max-w-full max-h-full object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
        </motion.div>
      )}
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="bg-card p-5">
      <div className="label-tech mb-1">{label}</div>
      <div className="font-display text-2xl text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}
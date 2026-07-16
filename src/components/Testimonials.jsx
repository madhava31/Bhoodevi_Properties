import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

export default function Testimonials({ items = [] }) {
  const [i, setI] = useState(0);
  const count = items.length;

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  if (!count) return null;
  const t = items[i];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <SectionTitle eyebrow="Voices" title={<>Investors, <span className="text-accent">at ease</span></>} />
        <div className="mt-14 relative">
          <Quote className="absolute -top-6 left-0 w-16 h-16 text-accent/15" />
          <div className="relative min-h-[260px] md:min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="flex justify-center gap-1 mb-5">
                  {Array.from({ length: t.rating || 5 }).map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="font-display text-2xl md:text-3xl leading-relaxed text-balance">“{t.review}”</p>
                <div className="mt-7 flex items-center justify-center gap-3">
                  <span className="grid place-items-center w-11 h-11 rounded-full bg-primary text-primary-foreground font-display text-lg">
                    {t.name?.charAt(0)}
                  </span>
                  <div className="text-left">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.location}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button onClick={() => setI((p) => (p - 1 + count) % count)} className="grid place-items-center w-10 h-10 rounded-full border border-border hover:border-accent hover:text-accent transition-colors" aria-label="Previous">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                {items.map((_, k) => (
                  <button key={k} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-accent" : "w-1.5 bg-border"}`} aria-label={`Go to ${k + 1}`} />
                ))}
              </div>
              <button onClick={() => setI((p) => (p + 1) % count)} className="grid place-items-center w-10 h-10 rounded-full border border-border hover:border-accent hover:text-accent transition-colors" aria-label="Next">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
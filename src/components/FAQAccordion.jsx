import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

export default function FAQAccordion({ items = [] }) {
  const [open, setOpen] = useState(0);

  if (!items.length) return null;

  return (
    <section className="relative py-24 md:py-32 bg-card">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <SectionTitle eyebrow="Clarify" title={<>Questions, <span className="text-accent">answered</span></>} />
        <div className="mt-12 divide-y divide-border border-y border-border">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 py-6 text-left group"
                  aria-expanded={isOpen}>
                  
                  <span className="font-display text-xl md:text-2xl group-hover:text-accent transition-colors">{f.question}</span>
                  <span className="shrink-0 grid place-items-center w-9 h-9 rounded-full border border-border group-hover:border-accent group-hover:text-accent transition-colors">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen &&
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden">
                    
                      <p className="pb-6 pr-12 text-muted-foreground leading-relaxed">{f.answer}</p>
                    </motion.div>
                  }
                </AnimatePresence>
              </div>);

          })}
        </div>
      </div>
    </section>);

}
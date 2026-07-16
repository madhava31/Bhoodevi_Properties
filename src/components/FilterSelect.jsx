import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

export default function FilterSelect({ value, onChange, options, placeholder = "Select" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const label = selected ? selected.label : placeholder;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border bg-card px-3.5 py-2.5 text-sm font-medium text-left transition-all ${open ? "border-accent ring-1 ring-accent/30 shadow-sm" : "border-border hover:border-accent/60"}`}
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>{label}</span>
        <ChevronDown className={`w-4 h-4 text-accent shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 mt-2 w-full min-w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/10 origin-top"
          >
            <ul className="max-h-64 overflow-auto py-1.5 no-scrollbar">
              {options.map((o) => {
                const active = o.value === value;
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      onClick={() => { onChange(o.value); setOpen(false); }}
                      className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm text-left transition-colors ${active ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-accent/10 hover:text-accent"}`}
                    >
                      <span className="truncate">{o.label}</span>
                      {active && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
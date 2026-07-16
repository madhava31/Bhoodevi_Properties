import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { SITE, NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const linksToShow = NAV_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const handleAnchor = (to) => {
    if (to.includes("#")) {
      const [, hash] = to.split("#");
      if (location.pathname !== "/") {
        window.location.href = `/#${hash}`;
        return;
      }
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  return (
    <>
      <header className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "glass border-b border-border/60 py-3" : "bg-transparent py-5"
      )}>
        <nav className="mx-auto max-w-8xl px-5 md:px-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="relative grid place-items-center w-9 h-9 rounded-full border border-accent/50">
              <span className="font-display text-accent text-lg leading-none">B</span>
              <span className="absolute inset-0 rounded-full border border-accent/20 group-hover:scale-110 transition-transform" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl text-foreground tracking-wide">Bhoodevi</span>
              <span className="block label-tech !text-[9px] !tracking-[0.3em]">Properties</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-9">
            {linksToShow.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => handleAnchor(l.to)}
                className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors group"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="hidden md:grid place-items-center w-10 h-10 rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
              aria-label="Call Bhoodevi"
            >
              <Phone className="w-4 h-4" />
            </a>
            <Link
              to="/properties"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Schedule Site Visit
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden grid place-items-center w-10 h-10 rounded-full border border-border"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-card border-l border-border p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="font-display text-2xl">Menu</span>
                <button onClick={() => setOpen(false)} className="grid place-items-center w-10 h-10 rounded-full border border-border" aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {linksToShow.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06 }}
                  >
                    <Link
                      to={l.to}
                      onClick={() => handleAnchor(l.to)}
                      className="block py-3 font-display text-3xl text-foreground hover:text-accent transition-colors border-b border-border/50"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-auto space-y-3">
                <Link to="/properties" className="block rounded-full bg-primary text-primary-foreground text-center py-3.5 font-semibold">
                  Schedule Site Visit
                </Link>
                <a href={`tel:${SITE.phoneRaw}`} className="flex items-center justify-center gap-2 rounded-full border border-border py-3.5 font-medium">
                  <Phone className="w-4 h-4" /> {SITE.phone}
                </a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";
import { useLocation } from "react-router-dom";

export default function FloatingActions() {
  const [show, setShow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Build a context-aware WhatsApp message
  const isPropertyPage = location.pathname.startsWith("/properties/");
  const whatsappMessage = isPropertyPage
    ? `Hello Bhoodevi Properties,\n\nI am interested in a property I found on your website.\n\n🔗 ${window.location.href}\n\nPlease share more details and help me book a call appointment.`
    : `Hello Bhoodevi Properties,\n\nI'd like to know more about your available land estates in Hyderabad. Please get in touch.`;

  return (
    <div className="fixed right-4 md:right-6 bottom-5 md:bottom-7 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {show && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="grid place-items-center w-11 h-11 rounded-full glass border border-border hover:border-accent hover:text-accent transition-colors shadow-sm"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>



      <a
        href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-2 rounded-full bg-[#25D366] text-white pl-3 pr-4 py-3 shadow-lg hover:scale-105 transition-transform"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-semibold max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 whitespace-nowrap">WhatsApp</span>
      </a>
    </div>
  );
}
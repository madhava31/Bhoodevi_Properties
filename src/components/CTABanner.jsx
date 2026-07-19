const db = globalThis.__BHOODEVI_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";
import ScrollReveal from "@/components/ScrollReveal";

const CTA_IMG = "/images/ffb9d83c9_generated_76b418bf.png";

export default function CTABanner() {
  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-8xl px-5 md:px-10">
        <ScrollReveal className="relative rounded-3xl overflow-hidden">
          <img src={CTA_IMG} alt="Bhoodevi estate entrance at twilight" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/92 via-primary/80 to-primary/50" />
          <div className="relative px-7 md:px-16 py-16 md:py-24 text-primary-foreground max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-accent" />
              <span className="label-tech">Begin the Acquisition</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-balance">
              Your next estate starts with a <span className="text-accent">call appointment</span>.
            </h2>
            <p className="mt-5 text-primary-foreground/80 text-lg max-w-lg">
              Book a call consultation with our team. Clear titles, corridor analysis, and documentation support — simplified.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">


              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3.5 font-semibold hover:border-accent hover:text-accent transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
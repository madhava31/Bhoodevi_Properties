import { Link } from "react-router-dom";
import { MapPin, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { SITE, NAV_LINKS, CATEGORIES } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 topo-bg opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-8xl px-5 md:px-10 pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <span className="grid place-items-center w-16 h-16 rounded-full border border-accent/60 overflow-hidden bg-white shadow-sm">
                <img src="/images/logo.png" alt="Bhoodevi Logo" className="w-full h-full p-2 object-contain" />
              </span>
              <span>
                <span className="block font-display text-2xl">Bhoodevi</span>
                <span className="label-tech !text-[9px]">Properties</span>
              </span>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed max-w-sm">
              A curated portfolio of verified land estates, farm lands, and investment parcels — earthed in trust, ethereal in design.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.instagram.com/bhoodevi__properties?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid place-items-center w-10 h-10 rounded-full border border-primary-foreground/20 hover:border-accent hover:text-accent transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="grid place-items-center w-10 h-10 rounded-full border border-primary-foreground/20 hover:border-accent hover:text-accent transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="label-tech mb-5">Explore</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="label-tech mb-5">Categories</h4>
            <ul className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((c) => (
                <li key={c.name}>
                  <Link to={`/properties?type=${encodeURIComponent(c.name)}`} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="label-tech mb-5">Contact</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/75">
              <li className="flex gap-3"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />{SITE.address}</li>

              <li><a href={`mailto:${SITE.email}`} className="flex gap-3 hover:text-accent"><Mail className="w-4 h-4 mt-0.5 shrink-0 text-accent" />{SITE.email}</a></li>
              <li className="flex gap-3"><Clock className="w-4 h-4 mt-0.5 shrink-0 text-accent" />{SITE.hours}</li>
            </ul>
          </div>
        </div>

        <hr className="gold-rule my-10" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Bhoodevi Properties. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent">Privacy</a>
            <a href="#" className="hover:text-accent">Terms</a>
            <a href="#" className="hover:text-accent">RERA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
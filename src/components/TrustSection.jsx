import { ShieldCheck, Scale, ScrollText, MapPin, TrendingUp } from "lucide-react";
import { TRUST_ITEMS } from "@/lib/site";
import { StaggerGroup, StaggerItem } from "@/components/ScrollReveal";

const ICONS = { ShieldCheck, Scale, ScrollText, MapPin, TrendingUp };

export default function TrustSection() {
  return (
    <section className="relative py-10 border-y border-border bg-card">
      <StaggerGroup className="mx-auto max-w-8xl px-5 md:px-10 grid grid-cols-2 md:grid-cols-5 gap-6">
        {TRUST_ITEMS.map((t) => {
          const Icon = ICONS[t.icon] || ShieldCheck;
          return (
            <StaggerItem key={t.label}>
              <div className="flex flex-col items-center text-center gap-2.5">
                <span className="grid place-items-center w-11 h-11 rounded-full border border-accent/30 text-accent">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-xs md:text-sm font-medium text-foreground/80">{t.label}</span>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
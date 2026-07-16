import { Key, TrendingUp, Scale, FileSignature, MapPin, Megaphone } from "lucide-react";
import { SERVICES } from "@/lib/site";
import SectionTitle from "@/components/SectionTitle";
import { StaggerGroup, StaggerItem } from "@/components/ScrollReveal";

const ICONS = { Key, TrendingUp, Scale, FileSignature, MapPin, Megaphone };

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 topo-bg opacity-20 animate-drift" />
      <div className="relative mx-auto max-w-8xl px-5 md:px-10">
        <SectionTitle
          eyebrow="The Practice"
          title={<>Services, <span className="text-accent">end to end</span></>}
          subtitle="From first viewing to registered deed — the entire acquisition, under one roof."
          light
        />
        <StaggerGroup className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.icon] || Key;
            return (
              <StaggerItem key={s.title}>
                <div className="group h-full rounded-2xl border border-primary-foreground/15 p-7 hover:border-accent/60 hover:bg-primary-foreground/5 transition-all">
                  <span className="grid place-items-center w-12 h-12 rounded-full bg-accent/15 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="font-display text-2xl mt-5">{s.title}</h3>
                  <p className="text-sm text-primary-foreground/70 mt-2 leading-relaxed">{s.desc}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
import { FileCheck2, LineChart, MapPinned, ReceiptText, Scale, Compass, Check } from "lucide-react";
import { WHY_CHOOSE } from "@/lib/site";
import SectionTitle from "@/components/SectionTitle";
import { StaggerGroup, StaggerItem } from "@/components/ScrollReveal";

const ICONS = { FileCheck2, LineChart, MapPinned, ReceiptText, Scale, Compass };

export default function WhyChoose() {
  return (
    <section id="about" className="relative py-24 md:py-32 bg-card">
      <div className="absolute inset-0 topo-bg opacity-40" />
      <div className="relative mx-auto max-w-8xl px-5 md:px-10">
        <SectionTitle
          eyebrow="Why Bhoodevi"
          title={<>Rigour, made <span className="text-accent">visible</span></>}
          subtitle="Every parcel is measured, documented, and escorted — the discipline of a surveyor, the eye of a curator."
        />
        <StaggerGroup className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {WHY_CHOOSE.map((w) => {
            const Icon = ICONS[w.icon] || Check;
            return (
              <StaggerItem key={w.title}>
                <div className="bg-card p-8 h-full hover:bg-muted/40 transition-colors group">
                  <span className="grid place-items-center w-12 h-12 rounded-full border border-accent/30 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="font-display text-2xl mt-5">{w.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{w.desc}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
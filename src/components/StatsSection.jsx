import { STATS } from "@/lib/site";
import Counter from "@/components/Counter";
import SectionTitle from "@/components/SectionTitle";
import { StaggerGroup, StaggerItem } from "@/components/ScrollReveal";

export default function StatsSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 topo-bg opacity-25 animate-drift" />
      <div className="relative mx-auto max-w-8xl px-5 md:px-10">
        <div className="mb-16">
          <SectionTitle
            eyebrow="By the Numbers"
            title={<>The measure of <span className="text-accent">trust</span></>}
            subtitle="Fourteen years of verified transactions, documented acreage, and escorted site visits."
            light
          />
        </div>
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-primary-foreground/10 rounded-2xl overflow-hidden">
          {STATS.map((s) => (
            <StaggerItem key={s.label}>
              <div className="bg-primary/60 backdrop-blur-sm px-5 py-8 text-center h-full hover:bg-primary/40 transition-colors">
                <div className="font-display text-4xl md:text-5xl text-accent">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-xs md:text-sm text-primary-foreground/70 leading-tight">{s.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
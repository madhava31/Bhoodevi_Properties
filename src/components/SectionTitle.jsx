export default function SectionTitle({ eyebrow, title, subtitle, align = "center", light = false }) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignCls}`}>
      {eyebrow && (
        <div className={`label-tech mb-4 ${align === "center" ? "flex items-center justify-center gap-3" : "flex items-center gap-3"}`}>
          <span className="h-px w-8 bg-accent/60" />
          {eyebrow}
        </div>
      )}
      <h2 className={`font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.05] tracking-tight text-balance ${light ? "text-background" : "text-foreground"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base md:text-lg leading-relaxed ${light ? "text-background/70" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
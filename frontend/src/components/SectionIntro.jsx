function SectionIntro({ eyebrow, title, copy, align = "left", tone = "dark" }) {
  const centered = align === "center";
  const isLight = tone === "light";

  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className={`mt-6 font-display text-4xl leading-none sm:text-5xl lg:text-6xl ${isLight ? "text-brand-sand" : "text-brand-forest"}`}>
        {title}
      </h2>
      <p className={`mt-6 text-base leading-8 sm:text-lg ${isLight ? "text-brand-sand/78" : "text-brand-emerald/80"}`}>
        {copy}
      </p>
    </div>
  );
}

export default SectionIntro;

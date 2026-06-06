/**
 * CSS-only replica of the Rizoura packaging pouch.
 * Replicates: dark green body, gold accents, oval grain window, brand elements.
 */
function ProductPouch({ title, subtitle, weight = "1kg", badge, className = "" }) {
  return (
    <div className={`pouch-visual flex flex-col items-center px-5 py-6 text-center ${className}`}>
      {/* Top badge ribbon */}
      {badge && (
        <div className="absolute -left-1 top-4 z-10">
          <div className="rounded-r-md bg-brand-gold px-3 py-1 text-[0.55rem] font-bold uppercase tracking-[0.15em] text-brand-forest shadow-md">
            {badge}
          </div>
        </div>
      )}

      {/* Veg mark */}
      <div className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center border border-green-600">
        <div className="h-2 w-2 rounded-full bg-green-600" />
      </div>

      {/* Brand name */}
      <p className="relative z-10 font-display text-2xl font-bold tracking-wider text-brand-gold">
        Rizoura<span className="align-super text-[0.4rem] font-sans font-normal">&reg;</span>
      </p>
      <p className="relative z-10 mt-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.25em] text-brand-gold/70">
        Pure Grain. Honest Taste.
      </p>

      {/* Gold divider */}
      <div className="relative z-10 my-3 h-px w-3/4 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      {/* Product type */}
      <p className="relative z-10 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-sand/90">
        Premium
      </p>
      <p className="relative z-10 font-display text-lg font-bold uppercase tracking-wider text-brand-sand">
        {title}
      </p>
      {subtitle && (
        <p className="relative z-10 mt-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/60">
          {subtitle}
        </p>
      )}

      {/* Grain window */}
      <div className="relative z-10 my-4">
        <div className="grain-window h-28 w-24">
          <div className="grain-texture h-full w-full" />
        </div>
      </div>

      {/* USP icons */}
      <div className="relative z-10 flex gap-4 text-brand-sand/70">
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" opacity="0.7">
            <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-1 12l-4-4 1.41-1.41L9 11.17l4.59-4.58L15 8l-6 6z" />
          </svg>
          <span className="text-[0.45rem] font-semibold uppercase tracking-wider">Extra Long</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" opacity="0.7">
            <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-1 12l-4-4 1.41-1.41L9 11.17l4.59-4.58L15 8l-6 6z" />
          </svg>
          <span className="text-[0.45rem] font-semibold uppercase tracking-wider">Aromatic</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" opacity="0.7">
            <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-1 12l-4-4 1.41-1.41L9 11.17l4.59-4.58L15 8l-6 6z" />
          </svg>
          <span className="text-[0.45rem] font-semibold uppercase tracking-wider">Non-Sticky</span>
        </div>
      </div>

      {/* Weight badge */}
      <div className="relative z-10 mt-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-gold/40 bg-brand-gold/10">
        <div className="text-center">
          <p className="text-[0.5rem] font-semibold uppercase text-brand-sand/60">Net Wt</p>
          <p className="font-display text-sm font-bold text-brand-sand">{weight}</p>
        </div>
      </div>

      {/* Bottom gold band */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-gold/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-brand-gold/30" />
    </div>
  );
}

export default ProductPouch;

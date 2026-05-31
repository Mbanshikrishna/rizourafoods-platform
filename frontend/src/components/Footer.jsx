function Footer() {
  return (
    <footer className="border-t border-brand-gold/10 bg-brand-forest py-8 text-brand-sand">
      <div className="section-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-3xl">Rizoura Foods</p>
          <p className="mt-1 text-sm uppercase tracking-[0.22em] text-brand-gold">
            Premium rice for global markets
          </p>
        </div>
        <div className="text-sm leading-7 text-brand-sand/70 sm:text-right">
          <p>Designed for premium FMCG positioning.</p>
          <p>Frontend landing page ready for backend and CMS integration.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navLinks } from "../assets/brand";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-brand-gold/10 bg-brand-dark/95 shadow-lg shadow-black/10 backdrop-blur-xl"
          : "border-b border-transparent bg-brand-forest/80 backdrop-blur-sm"
      }`}
    >
      <div className="section-shell flex items-center justify-between py-3">
        <a href="#home" className="group inline-flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 font-display text-lg font-bold text-brand-gold transition group-hover:bg-brand-gold/20">
            R
          </span>
          <div>
            <p className="font-display text-xl leading-none tracking-wider text-brand-sand sm:text-2xl">
              Rizoura
            </p>
            <p className="text-[0.45rem] font-semibold uppercase tracking-[0.3em] text-brand-gold/70">
              Pure Grain. Honest Taste.
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand-sand/70 transition hover:text-brand-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#contact"
            className="rounded-full bg-brand-gold px-5 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-brand-forest transition hover:-translate-y-0.5 hover:bg-brand-gold-light hover:shadow-gold-glow"
          >
            Get a Quote
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/20 text-brand-sand lg:hidden"
          onClick={() => setOpen((c) => !c)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-gold/10 bg-brand-dark/95 lg:hidden">
          <div className="section-shell flex flex-col gap-3 py-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-sand/80"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 rounded-full bg-brand-gold px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.14em] text-brand-forest"
              onClick={() => setOpen(false)}
            >
              Get a Quote
            </a>
          </div>
        </div>
      )}
    </motion.header>
  );
}

export default Navbar;

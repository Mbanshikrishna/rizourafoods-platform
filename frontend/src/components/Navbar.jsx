import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Export", href: "#export" },
  { label: "Contact", href: "#contact" },
];

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
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-brand-gold/15 bg-brand-ivory/90 shadow-lg shadow-brand-forest/5 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="section-shell flex items-center justify-between py-5">
        <a href="#home" className="group inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-forest text-lg font-bold text-brand-sand transition-transform duration-300 group-hover:scale-105">
            R
          </span>
          <div>
            <p className="font-display text-3xl leading-none tracking-wide text-brand-forest">
              Rizoura
            </p>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-brand-gold">
              Premium Foods
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold tracking-[0.18em] text-brand-emerald/80 transition hover:text-brand-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#contact"
            className="rounded-full border border-brand-gold bg-brand-gold px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-brand-forest transition hover:-translate-y-0.5 hover:bg-[#d5b16a]"
          >
            Enquire Now
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/30 text-brand-forest lg:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-brand-gold/15 bg-brand-ivory/95 lg:hidden">
          <div className="section-shell flex flex-col gap-4 py-5">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-emerald/85"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 rounded-full bg-brand-forest px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.14em] text-brand-sand"
              onClick={() => setOpen(false)}
            >
              Enquire Now
            </a>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}

export default Navbar;

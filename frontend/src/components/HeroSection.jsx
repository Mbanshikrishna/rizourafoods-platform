import { motion } from "framer-motion";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: "easeOut" },
  }),
};

function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-10 sm:pb-28 sm:pt-14">
      <div className="absolute inset-0 -z-10 bg-hero-radial" />
      <div className="absolute left-[-8rem] top-24 -z-10 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl" />
      <div className="absolute right-[-6rem] top-0 -z-10 h-72 w-72 rounded-full bg-brand-emerald/10 blur-3xl" />

      <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.span
            variants={reveal}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="eyebrow"
          >
            Refined Grain. Global Standard.
          </motion.span>
          <motion.h1
            variants={reveal}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-8 max-w-4xl font-display text-6xl leading-[0.92] text-brand-forest sm:text-7xl lg:text-[5.5rem]"
          >
            Premium rice branding for shelves, tables, and export markets.
          </motion.h1>
          <motion.p
            variants={reveal}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mt-8 max-w-2xl text-lg leading-8 text-brand-emerald/80 sm:text-xl"
          >
            Rizoura Foods brings together heritage sourcing, elevated packaging,
            and buyer-ready fulfillment for a rice brand designed to travel with
            confidence.
          </motion.p>
          <motion.div
            variants={reveal}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#products"
              className="rounded-full bg-brand-forest px-7 py-4 text-center text-sm font-extrabold uppercase tracking-[0.18em] text-brand-sand transition hover:-translate-y-0.5"
            >
              Explore Collection
            </a>
            <a
              href="#export"
              className="rounded-full border border-brand-gold/40 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-brand-forest transition hover:border-brand-gold hover:bg-brand-gold/10"
            >
              Export Capabilities
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="absolute inset-6 rounded-[2rem] bg-brand-gold/15 blur-2xl" />
          <div className="relative rounded-[2rem] border border-brand-gold/20 bg-gradient-to-br from-brand-forest via-brand-emerald to-[#21473d] p-6 shadow-glow sm:p-8">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-sand/75">
                    Signature Series
                  </p>
                  <h3 className="mt-4 font-display text-5xl text-brand-sand">
                    Heritage Basmati
                  </h3>
                </div>
                <span className="rounded-full border border-brand-gold/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                  Export Ready
                </span>
              </div>

              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-brand-gold/20 bg-white/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-sand/65">
                    Grain Profile
                  </p>
                  <p className="mt-4 text-3xl font-bold text-brand-sand">1121 Extra Long</p>
                </div>
                <div className="rounded-[1.4rem] border border-brand-gold/20 bg-white/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-sand/65">
                    Packaging
                  </p>
                  <p className="mt-4 text-3xl font-bold text-brand-sand">1kg to 25kg</p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.4rem] border border-brand-gold/20 bg-brand-sand p-6 text-brand-forest">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-clay">
                  Brand Positioning
                </p>
                <p className="mt-3 text-lg leading-8">
                  A refined offering for premium retail, hospitality, and global
                  importers who expect consistency with visual sophistication.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;

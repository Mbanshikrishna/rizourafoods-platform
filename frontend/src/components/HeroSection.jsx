import { motion } from "framer-motion";
import Logo from "./Logo";
import ProductPouch from "./ProductPouch";
import { stats } from "../assets/brand";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: "easeOut" },
  }),
};

function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Dark premium hero */}
      <div className="relative bg-brand-forest pb-16 pt-10 sm:pb-24 sm:pt-14">
        {/* Ambient glow effects */}
        <div className="absolute left-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-brand-gold/[0.04] blur-[100px]" />
        <div className="absolute right-[-5%] top-[-10%] h-[400px] w-[400px] rounded-full bg-brand-emerald/20 blur-[80px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

        <div className="section-shell grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: Copy */}
          <div>
            <motion.div
              variants={reveal}
              initial="hidden"
              animate="visible"
              custom={0.1}
            >
              <span className="eyebrow">India&apos;s Premium Basmati Rice</span>
            </motion.div>

            <motion.h1
              variants={reveal}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="mt-7 max-w-2xl font-display text-5xl leading-[0.92] text-brand-sand sm:text-6xl lg:text-[4.5rem]"
            >
              Pure Grain.{" "}
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                Honest Taste.
              </span>
            </motion.h1>

            <motion.p
              variants={reveal}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="mt-7 max-w-lg text-base leading-8 text-brand-sand/70 sm:text-lg"
            >
              From the fertile plains of India to dining tables worldwide.
              Extra long grain, aged to perfection, rich aroma &mdash;
              trusted by families, chefs, and importers across 20+ countries.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              variants={reveal}
              initial="hidden"
              animate="visible"
              custom={0.35}
              className="mt-6 flex flex-wrap gap-2"
            >
              {["FSSAI Certified", "ISO 22000", "HACCP", "Non-GMO", "100% Natural"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-brand-gold/20 bg-brand-gold/5 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-brand-gold/80"
                  >
                    {badge}
                  </span>
                ),
              )}
            </motion.div>

            <motion.div
              variants={reveal}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <a
                href="#products"
                className="rounded-full bg-brand-gold px-8 py-4 text-center text-sm font-extrabold uppercase tracking-[0.18em] text-brand-forest shadow-gold-glow transition hover:-translate-y-0.5 hover:bg-brand-gold-light"
              >
                Explore Our Range
              </a>
              <a
                href="#contact"
                className="rounded-full border-2 border-brand-gold/40 px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-brand-sand transition hover:-translate-y-0.5 hover:border-brand-gold hover:bg-brand-gold/5"
              >
                Become a Distributor
              </a>
            </motion.div>
          </div>

          {/* Right: Product pouch showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative mx-auto flex w-full max-w-xs flex-col items-center"
          >
            {/* Glow behind pouch */}
            <div className="absolute inset-0 translate-y-8 rounded-full bg-brand-gold/[0.06] blur-[60px]" />

            <div className="animate-float relative w-full">
              <ProductPouch
                title="Basmati Rice"
                subtitle="Extra Long Grain | Aged | Aromatic"
                weight="1kg"
                badge="Aged to Perfection"
              />
            </div>

            {/* Floating accent text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-6 text-center text-xs font-medium uppercase tracking-[0.3em] text-brand-gold/40"
            >
              Available in 1kg &bull; 5kg &bull; 10kg &bull; 25kg
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-brand-dark">
        <div className="section-shell grid grid-cols-2 divide-x divide-brand-gold/10 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center py-8 text-center"
            >
              <p className="font-display text-3xl text-brand-gold sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-brand-sand/50">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

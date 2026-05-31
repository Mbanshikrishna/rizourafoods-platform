import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";
import { highlights } from "../assets/brand";

function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="relative min-h-[25rem] rounded-[2rem] border border-brand-gold/15 bg-brand-forest p-8 shadow-glow"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(160deg,rgba(255,255,255,0.08),transparent_42%)]" />
          <div className="relative h-full rounded-[1.5rem] border border-brand-gold/20 p-8 text-brand-sand">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-gold">
              From Origin to Global Shelf
            </p>
            <div className="mt-10 space-y-5">
              <div className="rounded-[1.25rem] border border-brand-gold/15 bg-white/5 p-5">
                <p className="font-display text-3xl">Curated sourcing</p>
                <p className="mt-2 text-sm leading-7 text-brand-sand/80">
                  Purposeful selection built around aroma, grain length, finish,
                  and dependable cooking experience.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-brand-gold/15 bg-white/5 p-5">
                <p className="font-display text-3xl">Luxury presentation</p>
                <p className="mt-2 text-sm leading-7 text-brand-sand/80">
                  A premium visual system shaped for modern FMCG aisles and
                  elevated export conversations.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <SectionIntro
            eyebrow="About Rizoura"
            title="A premium food brand built for trust, texture, and trade."
            copy="Rizoura Foods is positioned at the intersection of refined consumer branding and export discipline. The experience is rooted in clean sourcing, elegant packaging language, and dependable fulfillment for retail partners, distributors, and bulk buyers."
          />

          <div className="mt-10 space-y-4">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-[1.5rem] border border-brand-gold/15 bg-white/70 p-5 shadow-sm shadow-brand-forest/5 backdrop-blur"
              >
                <span className="mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                  +
                </span>
                <p className="text-base leading-8 text-brand-emerald/80">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;

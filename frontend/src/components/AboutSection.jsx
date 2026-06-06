import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";
import Logo from "./Logo";

const milestones = [
  { year: "1970s", text: "Family roots in Indian rice trade" },
  { year: "2000s", text: "Modern milling infrastructure" },
  { year: "2015", text: "First international export" },
  { year: "2020", text: "ISO 22000 & HACCP certified" },
  { year: "2024", text: "Rizoura brand launched" },
];

function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        {/* Left: Heritage card */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] bg-brand-forest p-8 shadow-glow sm:p-10"
        >
          {/* Subtle light overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(201,165,92,0.06),transparent_40%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

          <div className="relative">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>

            <div className="gold-divider mt-6" />

            <div className="mt-6 space-y-2.5">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-4 rounded-xl border border-brand-gold/8 bg-white/[0.03] px-4 py-2.5"
                >
                  <span className="text-sm font-bold text-brand-gold">{m.year}</span>
                  <span className="h-px flex-1 bg-brand-gold/10" />
                  <span className="text-sm text-brand-sand/70">{m.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Content */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <SectionIntro
            eyebrow="About Rizoura"
            title="Decades of rice heritage. A brand built for today."
            copy="Rizoura Foods is the culmination of over 50 years of family expertise in Indian rice sourcing, processing, and trade. We combine traditional knowledge with modern milling technology to deliver basmati rice that meets the highest international standards."
          />

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="premium-card gold-accent-top p-5">
              <p className="font-display text-2xl text-brand-forest">Our Mission</p>
              <p className="mt-3 text-sm leading-7 text-brand-emerald/75">
                To bring the finest Indian basmati rice to every table worldwide,
                with uncompromising quality and transparent sourcing.
              </p>
            </div>
            <div className="premium-card gold-accent-top p-5">
              <p className="font-display text-2xl text-brand-forest">Our Vision</p>
              <p className="mt-3 text-sm leading-7 text-brand-emerald/75">
                To become the most trusted premium basmati rice brand across
                global markets, known for purity, consistency, and heritage.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Family-Owned", "Vertically Integrated", "Export-Ready", "Sustainably Sourced"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-brand-gold/20 bg-brand-gold/5 px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-brand-forest/75"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;

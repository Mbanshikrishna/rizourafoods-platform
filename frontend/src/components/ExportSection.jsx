import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";
import { exportMetrics } from "../assets/brand";

function ExportSection() {
  return (
    <section id="export" className="py-20 sm:py-28">
      <div className="section-shell">
        <div className="overflow-hidden rounded-[2.4rem] border border-brand-gold/15 bg-brand-forest text-brand-sand shadow-glow">
          <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:p-14">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            >
              <SectionIntro
                eyebrow="Export & Bulk Orders"
                title="Prepared for private label, distribution, and international scale."
                copy="Rizoura’s export story is shaped for buyers who need more than a catalogue. We support packaging flexibility, compliant shipment documentation, and a brand presence that carries weight in overseas retail and wholesale environments."
                tone="light"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {exportMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[1.6rem] border border-brand-gold/20 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
                    {metric.label}
                  </p>
                  <p className="mt-6 font-display text-5xl text-brand-sand">{metric.value}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExportSection;

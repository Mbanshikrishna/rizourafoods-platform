import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";
import { exportMetrics } from "../assets/brand";

const exportServices = [
  "Private label & white label packaging",
  "Custom branding and pack design support",
  "FCL and LCL shipment options",
  "Phytosanitary and fumigation certificates",
  "COO, commercial invoice, and packing list",
  "Dedicated export account manager",
];

function ExportSection() {
  return (
    <section id="export" className="py-20 sm:py-28">
      <div className="section-shell">
        <div className="overflow-hidden rounded-[2.4rem] border border-brand-gold/15 bg-brand-forest text-brand-sand shadow-glow">
          {/* Top section */}
          <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[1fr_1fr] lg:p-14">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            >
              <SectionIntro
                eyebrow="Global Trade"
                title="Your trusted basmati rice export partner."
                copy="Rizoura serves importers, distributors, and retail chains across the Middle East, Europe, North America, Africa, and Southeast Asia. We handle everything from sourcing to shipment so you can focus on selling."
                tone="light"
              />

              <div className="mt-8">
                <a
                  href="#contact"
                  className="inline-block rounded-full bg-brand-gold px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-brand-forest transition hover:-translate-y-0.5 hover:bg-[#d5b16a]"
                >
                  Request Export Pricing
                </a>
              </div>
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
                  <p className="mt-5 font-display text-4xl text-brand-sand">
                    {metric.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Export services strip */}
          <div className="border-t border-brand-gold/10 bg-white/[0.03] px-8 py-8 sm:px-10 lg:px-14">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
              Export Services We Offer
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {exportServices.map((service) => (
                <div key={service} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-gold/15 text-[0.6rem] text-brand-gold">
                    &#10003;
                  </span>
                  <p className="text-sm leading-6 text-brand-sand/80">
                    {service}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExportSection;

import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";
import { qualityPillars } from "../assets/brand";

const icons = [
  <svg key="leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7"><path d="M12 21c0 0-8-4-8-11a8 8 0 0116 0c0 7-8 11-8 11z" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 21V11" strokeLinecap="round" /><path d="M8 15c2-2 4-3 4-4" strokeLinecap="round" /></svg>,
  <svg key="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7"><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="10" /></svg>,
  <svg key="cog" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7"><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" /></svg>,
  <svg key="cert" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7"><rect x="3" y="3" width="18" height="14" rx="2" /><path d="M8 21l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="10" r="3" /></svg>,
];

function QualitySection() {
  return (
    <section id="quality" className="relative overflow-hidden bg-brand-forest py-20 sm:py-28">
      {/* Ambient effects */}
      <div className="absolute left-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-brand-gold/[0.03] blur-[80px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      <div className="section-shell relative">
        <SectionIntro
          eyebrow="Our Promise"
          title="Quality you can taste in every grain."
          copy="From paddy procurement to final packaging, every step is governed by strict protocols that meet international food safety standards."
          align="center"
          tone="light"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {qualityPillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="group rounded-[1.4rem] border border-brand-gold/10 bg-white/[0.04] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-brand-gold/25 hover:bg-white/[0.07]"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                {icons[index]}
              </div>
              <h3 className="mt-4 font-display text-lg text-brand-sand">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-brand-sand/60">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 7-Stage process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-14 rounded-[1.8rem] border border-brand-gold/10 bg-white/[0.03] p-8 sm:p-10"
        >
          <p className="text-center text-[0.6rem] font-bold uppercase tracking-[0.35em] text-brand-gold">
            Our 7-Stage Quality Journey
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-0">
            {[
              "Paddy Selection",
              "Cleaning",
              "Husking & Milling",
              "Colour Sorting",
              "Length Grading",
              "Aroma Testing",
              "Packaging",
            ].map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-xs font-bold text-brand-gold">
                    {i + 1}
                  </span>
                  <span className="mt-2 max-w-[5rem] text-center text-[0.6rem] font-medium leading-4 text-brand-sand/60">
                    {step}
                  </span>
                </div>
                {i < 6 && (
                  <div className="mx-1.5 hidden h-px w-6 bg-brand-gold/20 sm:block" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default QualitySection;

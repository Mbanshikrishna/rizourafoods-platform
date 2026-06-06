import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";

const steps = [
  { step: "1", title: "Soak", time: "20 min", description: "Rinse rice gently and soak in water for 20 minutes for even moisture absorption and perfect elongation." },
  { step: "2", title: "Cook", time: "1:2 ratio", description: "Add 1 cup soaked rice to 2 cups water. Bring to a boil, then reduce heat and cover with a tight lid." },
  { step: "3", title: "Simmer", time: "10-12 min", description: "Cook on medium-low for 10-12 minutes until water is absorbed. Do not stir \u2014 let the steam work." },
  { step: "4", title: "Serve", time: "Fluff & enjoy", description: "Rest for 2 minutes, fluff gently with a fork, and serve hot. Each grain will be separate and aromatic." },
];

const tips = [
  "Use aged basmati for the best elongation and aroma",
  "Add a teaspoon of ghee or oil to prevent sticking",
  "For biryani, parboil rice to 70% doneness before layering",
  "Store in a cool, dry place away from direct sunlight",
];

function CookingSection() {
  return (
    <section id="cooking" className="py-20 sm:py-28">
      <div className="section-shell">
        <SectionIntro
          eyebrow="How to Cook"
          title="Perfect rice, every time."
          copy="Follow these simple steps for fluffy, aromatic, and perfectly separated basmati rice."
          align="center"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="premium-card gold-accent-top relative p-6"
            >
              <span className="absolute -top-3 right-5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-brand-forest shadow-md">
                {s.step}
              </span>
              <h3 className="font-display text-2xl text-brand-forest">{s.title}</h3>
              <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-gold">
                {s.time}
              </p>
              <p className="mt-3 text-sm leading-7 text-brand-emerald/70">{s.description}</p>
              {i < 3 && (
                <div className="absolute -right-2.5 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-brand-ivory text-brand-gold lg:flex">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="h-2.5 w-2.5"><path d="M6 3l5 5-5 5V3z" /></svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Pro tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 rounded-[1.6rem] border border-brand-gold/15 bg-brand-cream/40 p-7"
        >
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-brand-gold">
            Pro Tips
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {tips.map((tip) => (
              <div key={tip} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-brand-forest text-[0.5rem] text-brand-gold">&#10003;</span>
                <p className="text-sm leading-6 text-brand-emerald/75">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CookingSection;

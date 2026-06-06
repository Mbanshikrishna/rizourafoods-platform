import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";

const recipes = [
  {
    title: "Classic Hyderabadi Biryani",
    time: "60 min",
    serves: "4-6",
    difficulty: "Medium",
    description:
      "Layered basmati rice with aromatic spices, tender meat, and saffron — the crown jewel of Indian cuisine.",
    tags: ["Heritage Basmati", "Non-Veg"],
  },
  {
    title: "Jeera Rice",
    time: "20 min",
    serves: "4",
    difficulty: "Easy",
    description:
      "Fragrant cumin-tempered basmati rice — the perfect everyday accompaniment for dal, curry, and grilled dishes.",
    tags: ["Royal Everyday", "Veg"],
  },
  {
    title: "Coconut Milk Pulao",
    time: "35 min",
    serves: "4",
    difficulty: "Easy",
    description:
      "Creamy coconut milk pulao with cashews and raisins. A South Indian favourite that pairs beautifully with any curry.",
    tags: ["Golden Sella", "Veg"],
  },
  {
    title: "Lemon Rice",
    time: "25 min",
    serves: "4",
    difficulty: "Easy",
    description:
      "Tangy, turmeric-yellow rice with peanuts and curry leaves. A quick lunch box staple loved across India.",
    tags: ["Royal Everyday", "Veg"],
  },
  {
    title: "Mutton Pulao",
    time: "50 min",
    serves: "4-6",
    difficulty: "Medium",
    description:
      "One-pot aromatic pulao with tender mutton pieces, whole spices, and perfectly separated long grains.",
    tags: ["Heritage Basmati", "Non-Veg"],
  },
  {
    title: "Kheer (Rice Pudding)",
    time: "45 min",
    serves: "6",
    difficulty: "Easy",
    description:
      "Slow-cooked basmati rice in sweetened milk with cardamom, saffron, and pistachios. A festive dessert classic.",
    tags: ["Heritage Basmati", "Dessert"],
  },
];

function RecipesSection() {
  return (
    <section id="recipes" className="py-20 sm:py-28">
      <div className="section-shell">
        <SectionIntro
          eyebrow="Recipes"
          title="Discover what you can create with Rizoura."
          copy="From everyday meals to festive feasts, our basmati rice is the foundation of unforgettable dishes. Try these recipes curated by our kitchen team."
          align="center"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe, i) => (
            <motion.article
              key={recipe.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group flex flex-col rounded-[1.6rem] border border-brand-gold/15 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl text-brand-forest">
                  {recipe.title}
                </h3>
                <span className="flex-none rounded-full bg-brand-gold/10 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-brand-forest/70">
                  {recipe.difficulty}
                </span>
              </div>

              {/* Meta */}
              <div className="mt-3 flex gap-4 text-xs font-semibold text-brand-emerald/50">
                <span>{recipe.time}</span>
                <span>Serves {recipe.serves}</span>
              </div>

              {/* Description */}
              <p className="mt-3 flex-1 text-sm leading-7 text-brand-emerald/75">
                {recipe.description}
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-brand-gold/20 bg-brand-gold/5 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-brand-forest/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-brand-emerald/60">
            Scan the QR code on your Rizoura pack for more recipes and cooking videos.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default RecipesSection;

import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";
import ProductPouch from "./ProductPouch";
import { products } from "../assets/brand";

function ProductSection() {
  return (
    <section id="products" className="py-20 sm:py-28">
      <div className="section-shell">
        <SectionIntro
          eyebrow="Our Range"
          title="Premium basmati rice for every occasion."
          copy="From everyday meals to grand celebrations, each variety is selected for its unique grain profile, aroma, and cooking character."
          align="center"
        />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.article
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
              className="group flex flex-col"
            >
              {/* Packaging pouch */}
              <div className="relative transition duration-500 group-hover:-translate-y-2 group-hover:shadow-gold-glow">
                <ProductPouch
                  title={product.title}
                  subtitle={product.subtitle}
                  weight={product.sizes[0]}
                  badge={product.badge}
                  className="min-h-[360px]"
                />
              </div>

              {/* Product details card */}
              <div className="mt-4 flex flex-1 flex-col rounded-[1.4rem] border border-brand-gold/10 bg-white/80 p-5 backdrop-blur">
                <h3 className="font-display text-xl text-brand-forest">
                  {product.title}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-gold">
                  {product.subtitle}
                </p>
                <p className="mt-3 flex-1 text-sm leading-7 text-brand-emerald/75">
                  {product.description}
                </p>

                {/* USPs */}
                <div className="mt-3 space-y-1.5">
                  {product.usps.map((usp) => (
                    <div key={usp} className="flex items-center gap-2">
                      <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-brand-forest text-[0.5rem] text-brand-gold">
                        &#10003;
                      </span>
                      <span className="text-xs font-medium text-brand-emerald/70">{usp}</span>
                    </div>
                  ))}
                </div>

                {/* Nutrition bar */}
                <div className="mt-3 rounded-lg border border-brand-gold/10 bg-brand-cream/50 px-3 py-2">
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.2em] text-brand-emerald/40">
                    Nutrition per 100g
                  </p>
                  <div className="mt-1 flex justify-between text-[0.6rem] font-semibold text-brand-emerald/55">
                    <span>{product.nutrition.energy} kcal</span>
                    <span>P {product.nutrition.protein}g</span>
                    <span>C {product.nutrition.carbs}g</span>
                    <span>F {product.nutrition.fat}g</span>
                  </div>
                </div>

                {/* Sizes */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="rounded-full border border-brand-gold/20 bg-brand-gold/5 px-2.5 py-1 text-[0.6rem] font-semibold text-brand-forest/70"
                    >
                      {size}
                    </span>
                  ))}
                </div>

                <a
                  href="#contact"
                  className="mt-4 block rounded-full bg-brand-forest py-2.5 text-center text-xs font-bold uppercase tracking-[0.16em] text-brand-sand transition hover:bg-brand-emerald"
                >
                  Enquire Now
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductSection;

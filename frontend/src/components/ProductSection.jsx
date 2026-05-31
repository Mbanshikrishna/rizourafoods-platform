import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";
import { products } from "../assets/brand";

function ProductSection() {
  return (
    <section id="products" className="py-20 sm:py-28">
      <div className="section-shell">
        <SectionIntro
          eyebrow="Product Showcase"
          title="A versatile collection shaped for premium homes and export demand."
          copy="The first release balances visual sophistication with practical merchandising, giving Rizoura a clear product story across retail shelves, hospitality channels, and bulk orders."
          align="center"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {products.map((product, index) => (
            <motion.article
              key={product.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, delay: index * 0.1, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-[2rem] border border-brand-gold/15 bg-white/80 p-7 shadow-sm shadow-brand-forest/5 transition hover:-translate-y-2 hover:shadow-glow"
            >
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
              <div className="inline-flex rounded-full bg-brand-forest px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-sand">
                {product.detail}
              </div>
              <h3 className="mt-8 font-display text-4xl text-brand-forest">
                {product.title}
              </h3>
              <p className="mt-5 text-base leading-8 text-brand-emerald/80">
                {product.description}
              </p>
              <div className="mt-8 h-52 rounded-[1.6rem] border border-brand-gold/15 bg-[radial-gradient(circle_at_top,#f8f1e6,transparent_48%),linear-gradient(145deg,#173d34,#265346)] p-6 text-brand-sand">
                <div className="flex h-full flex-col justify-between rounded-[1.2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                    Pack Narrative
                  </p>
                  <div>
                    <p className="font-display text-3xl">Crafted for visual trust</p>
                    <p className="mt-3 text-sm leading-7 text-brand-sand/75">
                      Bold contrast, heritage-inspired type, and export-grade
                      polish designed to stand apart in premium FMCG.
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductSection;

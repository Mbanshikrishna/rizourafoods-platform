import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";

function ContactSection() {
  return (
    <section id="contact" className="pb-24 pt-20 sm:pb-28 sm:pt-28">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionIntro
            eyebrow="Contact"
            title="Open the conversation with buyers, distributors, and partners."
            copy="This first version uses a polished frontend-only form to establish the experience. The structure is ready to connect to Strapi, a backend API, or a CRM later without changing the layout."
          />

          <div className="mt-8 rounded-[1.8rem] border border-brand-gold/15 bg-white/80 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-gold">
              Direct Reach
            </p>
            <div className="mt-4 space-y-3 text-base leading-8 text-brand-emerald/80">
              <p>hello@rizourafoods.com</p>
              <p>+91 98765 43210</p>
              <p>Mumbai, India</p>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          onSubmit={(event) => event.preventDefault()}
          className="rounded-[2rem] border border-brand-gold/15 bg-white/80 p-8 shadow-sm shadow-brand-forest/5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-emerald/70">
              Name
              <input
                type="text"
                placeholder="Your name"
                className="mt-3 w-full rounded-2xl border border-brand-gold/15 bg-brand-ivory px-4 py-4 text-base text-brand-forest outline-none transition focus:border-brand-gold"
              />
            </label>
            <label className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-emerald/70">
              Company
              <input
                type="text"
                placeholder="Company name"
                className="mt-3 w-full rounded-2xl border border-brand-gold/15 bg-brand-ivory px-4 py-4 text-base text-brand-forest outline-none transition focus:border-brand-gold"
              />
            </label>
            <label className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-emerald/70">
              Email
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-3 w-full rounded-2xl border border-brand-gold/15 bg-brand-ivory px-4 py-4 text-base text-brand-forest outline-none transition focus:border-brand-gold"
              />
            </label>
            <label className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-emerald/70">
              Order Type
              <select className="mt-3 w-full rounded-2xl border border-brand-gold/15 bg-brand-ivory px-4 py-4 text-base text-brand-forest outline-none transition focus:border-brand-gold">
                <option>Retail enquiry</option>
                <option>Bulk order</option>
                <option>Private label</option>
                <option>Distribution partnership</option>
              </select>
            </label>
          </div>

          <label className="mt-5 block text-sm font-semibold uppercase tracking-[0.18em] text-brand-emerald/70">
            Message
            <textarea
              rows="6"
              placeholder="Tell us about your requirement, target market, or product interest."
              className="mt-3 w-full rounded-[1.6rem] border border-brand-gold/15 bg-brand-ivory px-4 py-4 text-base text-brand-forest outline-none transition focus:border-brand-gold"
            />
          </label>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-sm leading-7 text-brand-emerald/70">
              Form submission handling can be connected in the next step through
              Strapi, Express, or a serverless form endpoint.
            </p>
            <button
              type="submit"
              className="rounded-full bg-brand-gold px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-brand-forest transition hover:-translate-y-0.5 hover:bg-[#d5b16a]"
            >
              Send Enquiry
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

export default ContactSection;

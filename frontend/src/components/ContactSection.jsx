import { useState } from "react";
import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";

function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

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
            copy="Submit your enquiry and our team will respond within one business day."
          />

          <div className="mt-8 rounded-[1.8rem] border border-brand-gold/15 bg-white/80 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-gold">
              Direct Reach
            </p>
            <div className="mt-4 space-y-3 text-base leading-8 text-brand-emerald/80">
              <p>care@rizourafoods.com</p>
              <p>+91 98765 43210</p>
              <p>
                123, Green Valley Road,
                <br />
                Kolkata, West Bengal - 700001
              </p>
              <p className="text-sm text-brand-emerald/60">
                www.rizourafoods.com
              </p>
            </div>
          </div>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center rounded-[2rem] border border-brand-gold/15 bg-white/80 p-12 text-center shadow-sm shadow-brand-forest/5"
          >
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/15 text-3xl text-brand-gold">
              ✓
            </span>
            <h3 className="mt-6 font-display text-3xl text-brand-forest">
              Thank you for your enquiry
            </h3>
            <p className="mt-4 max-w-md text-base leading-8 text-brand-emerald/80">
              Your message has been received. Our team will review your
              enquiry and get back to you within one business day.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-8 rounded-full border border-brand-gold/40 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-brand-forest transition hover:bg-brand-gold/10"
            >
              Send Another Enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-brand-gold/15 bg-white/80 p-8 shadow-sm shadow-brand-forest/5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-emerald/70">
                Name
                <input
                  type="text"
                  required
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
                  required
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
                required
                placeholder="Tell us about your requirement, target market, or product interest."
                className="mt-3 w-full rounded-[1.6rem] border border-brand-gold/15 bg-brand-ivory px-4 py-4 text-base text-brand-forest outline-none transition focus:border-brand-gold"
              />
            </label>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="submit"
                className="rounded-full bg-brand-gold px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-brand-forest transition hover:-translate-y-0.5 hover:bg-[#d5b16a]"
              >
                Send Enquiry
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}

export default ContactSection;

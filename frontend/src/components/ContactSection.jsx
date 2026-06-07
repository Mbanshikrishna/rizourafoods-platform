import { useState } from "react";
import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";

const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

const ORDER_TYPE_MAP = {
  "Retail enquiry": "GENERAL",
  "Bulk order": "BULK_ORDER",
  "Private label": "PRIVATE_LABEL",
  "Distribution partnership": "DISTRIBUTOR",
};

const initialForm = {
  name: "",
  company: "",
  email: "",
  inquiryType: "Retail enquiry",
  message: "",
};

function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        message: form.message,
        ...(form.company ? { company: form.company } : {}),
        inquiryType: ORDER_TYPE_MAP[form.inquiryType] || "GENERAL",
      };

      const res = await fetch(`${API_URL}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Request failed (${res.status})`);
      }

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const isSubmitting = status === "submitting";

  if (status === "success") {
    return (
      <section id="contact" className="pb-24 pt-20 sm:pb-28 sm:pt-28">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <ContactInfo />
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
              onClick={() => setStatus("idle")}
              className="mt-8 rounded-full border border-brand-gold/40 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-brand-forest transition hover:bg-brand-gold/10"
            >
              Send Another Enquiry
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="pb-24 pt-20 sm:pb-28 sm:pt-28">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <ContactInfo />

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
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                disabled={isSubmitting}
                className="mt-3 w-full rounded-2xl border border-brand-gold/15 bg-brand-ivory px-4 py-4 text-base text-brand-forest outline-none transition focus:border-brand-gold disabled:opacity-60"
              />
            </label>
            <label className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-emerald/70">
              Company
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
                disabled={isSubmitting}
                className="mt-3 w-full rounded-2xl border border-brand-gold/15 bg-brand-ivory px-4 py-4 text-base text-brand-forest outline-none transition focus:border-brand-gold disabled:opacity-60"
              />
            </label>
            <label className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-emerald/70">
              Email
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={isSubmitting}
                className="mt-3 w-full rounded-2xl border border-brand-gold/15 bg-brand-ivory px-4 py-4 text-base text-brand-forest outline-none transition focus:border-brand-gold disabled:opacity-60"
              />
            </label>
            <label className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-emerald/70">
              Order Type
              <select
                name="inquiryType"
                value={form.inquiryType}
                onChange={handleChange}
                disabled={isSubmitting}
                className="mt-3 w-full rounded-2xl border border-brand-gold/15 bg-brand-ivory px-4 py-4 text-base text-brand-forest outline-none transition focus:border-brand-gold disabled:opacity-60"
              >
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
              name="message"
              rows="6"
              required
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your requirement, target market, or product interest."
              disabled={isSubmitting}
              className="mt-3 w-full rounded-[1.6rem] border border-brand-gold/15 bg-brand-ivory px-4 py-4 text-base text-brand-forest outline-none transition focus:border-brand-gold disabled:opacity-60"
            />
          </label>

          {status === "error" && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-brand-gold px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-brand-forest transition hover:-translate-y-0.5 hover:bg-[#d5b16a] disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Sending…" : "Send Enquiry"}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

function ContactInfo() {
  return (
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
  );
}

export default ContactSection;

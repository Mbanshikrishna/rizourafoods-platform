import Logo from "./Logo";
import { navLinks } from "../assets/brand";

function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-sand">
      {/* Gold top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      <div className="section-shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo size="sm" />
          <p className="mt-4 text-sm leading-7 text-brand-sand/50">
            Premium basmati rice from India, trusted by families and importers
            across 20+ countries worldwide.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-brand-gold">
            Quick Links
          </p>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-brand-sand/60 transition hover:text-brand-gold">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-brand-gold">
            Our Range
          </p>
          <ul className="mt-4 space-y-2.5">
            {["Heritage Basmati", "Royal Everyday", "Export Reserve", "Golden Sella"].map(
              (product) => (
                <li key={product}>
                  <a href="#products" className="text-sm text-brand-sand/60 transition hover:text-brand-gold">
                    {product}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-brand-gold">
            Contact Us
          </p>
          <div className="mt-4 space-y-2.5 text-sm text-brand-sand/60">
            <p>care@rizourafoods.com</p>
            <p>+91 98765 43210</p>
            <p>123, Green Valley Road,<br />Kolkata, West Bengal - 700001</p>
            <a href="https://www.rizourafoods.com" className="block text-brand-gold/70 transition hover:text-brand-gold">
              www.rizourafoods.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-gold/8">
        <div className="section-shell flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-[0.65rem] text-brand-sand/40">
            &copy; {new Date().getFullYear()} Rizoura Foods Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-5 text-[0.65rem] text-brand-sand/40">
            <span>FSSAI Lic: XXXXXXXXXX</span>
            <span>ISO 22000</span>
            <span>HACCP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listProducts } from "../api/products";
import { useCart } from "../context/CartContext";

const categories = ["All", "RICE", "SPICES", "MASALAS"];
const pretty = (value) => value.charAt(0) + value.slice(1).toLowerCase();

export default function CataloguePage({ category: initialCategory }) {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]); const [state, setState] = useState("loading");
  const search = params.get("search") || "";
  const category = initialCategory || params.get("category") || "All";
  const { add } = useCart();
  useEffect(() => { let live = true; setState("loading"); listProducts({ ...(category !== "All" ? { category } : {}), ...(search ? { search } : {}) }).then((data) => { if (live) { setProducts(data); setState("ready"); } }).catch(() => live && setState("error")); return () => { live = false; }; }, [category, search]);
  const heading = category === "All" ? "The Rizoura catalogue" : `${pretty(category)} for business kitchens`;
  const setFilter = (next) => setParams({ ...(next === "All" ? {} : { category: next }) });
  return <section className="section-shell py-14 sm:py-20">
    <p className="eyebrow">Product catalogue</p><h1 className="mt-4 font-display text-4xl text-brand-forest sm:text-5xl">{heading}</h1>
    <p className="mt-4 max-w-2xl leading-7 text-brand-emerald/70">Browse published products, then add the items you need to a commercial enquiry. B2B pricing is shared after your requirement is reviewed.</p>
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><input value={search} onChange={(e) => setParams({ ...(category === "All" ? {} : { category }), ...(e.target.value ? { search: e.target.value } : {}) })} placeholder="Search products" className="w-full rounded-full border border-brand-gold/25 bg-white px-5 py-3 outline-none focus:border-brand-gold sm:max-w-sm" aria-label="Search products" /><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${category === item ? "bg-brand-forest text-brand-sand" : "border border-brand-gold/25 text-brand-forest"}`}>{item === "All" ? item : pretty(item)}</button>)}</div></div>
    {state === "loading" && <p className="mt-12 text-brand-emerald/70">Loading catalogue…</p>}
    {state === "error" && <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">We couldn’t load the catalogue. Please check your connection and try again.</div>}
    {state === "ready" && !products.length && <div className="mt-12 rounded-[1.8rem] border border-brand-gold/20 bg-white p-8"><h2 className="font-display text-2xl">Products will appear here</h2><p className="mt-3 max-w-xl text-brand-emerald/70">No published products match this selection yet. Send us your requirement and our team can advise on available options.</p><Link to="/request-quote" className="mt-5 inline-block rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-brand-forest">Request a quote</Link></div>}
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <article key={product.id} className="premium-card flex flex-col overflow-hidden p-6"><div className="flex h-36 items-center justify-center rounded-2xl bg-brand-forest text-center font-display text-2xl text-brand-gold">{product.imageUrl ? <img src={product.imageUrl} alt="" className="h-full w-full object-cover" /> : product.name}</div><p className="mt-5 text-xs font-bold uppercase tracking-widest text-brand-gold">{pretty(product.category)}</p><h2 className="mt-2 font-display text-2xl">{product.name}</h2><p className="mt-3 flex-1 text-sm leading-6 text-brand-emerald/70">{product.description}</p><p className="mt-4 text-xs font-semibold text-brand-emerald/60">B2B price on request</p><div className="mt-5 flex gap-3"><Link to={`/products/${product.id}`} className="flex-1 rounded-full border border-brand-forest px-4 py-2 text-center text-xs font-bold uppercase tracking-wider">Details</Link><button onClick={() => add(product)} className="flex-1 rounded-full bg-brand-forest px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-sand">Add to enquiry</button></div></article>)}</div>
  </section>;
}

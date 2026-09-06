import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listQuotes } from "../api/quotes";
import { listSamples } from "../api/samples";
import { listOrders } from "../api/orders";
import { getBusiness } from "../api/customer";
import { listAddresses } from "../api/addresses";
import { listContacts } from "../api/contacts";
const loaders = { quotes: listQuotes, samples: listSamples, orders: listOrders, business: getBusiness, addresses: listAddresses, contacts: listContacts };
const labels = { quotes: "Quotes", samples: "Sample requests", orders: "Orders", business: "Business profile", addresses: "Addresses", contacts: "Contacts" };
export default function AccountDataPage({ section }) { const { session } = useAuth(); const [state, setState] = useState("loading"); const [data, setData] = useState(null); useEffect(() => { if (!session) return; loaders[section]().then((result) => { setData(result.data); setState("ready"); }).catch(() => setState("error")); }, [section, session]); if (!session) return <Navigate to={`/login?next=/account/${section}`} replace />; return <section className="section-shell py-14"><p className="eyebrow">B2B customer account</p><h1 className="mt-4 font-display text-4xl">{labels[section]}</h1>{state === "loading" && <p className="mt-8">Loading…</p>}{state === "error" && <p className="mt-8 rounded-xl bg-red-50 p-4 text-red-700">We couldn’t load this account information. Please try again.</p>}{state === "ready" && (Array.isArray(data) ? (data.length ? <div className="mt-8 space-y-3">{data.map((item) => <article key={item.id} className="rounded-2xl bg-white p-5"><strong>{item.quoteNumber || item.orderNumber || item.status}</strong><p className="mt-1 text-sm text-brand-emerald/70">{item.status || item.businessName || item.line1}</p></article>)}</div> : <p className="mt-8 rounded-2xl bg-white p-6">No {labels[section].toLowerCase()} yet.</p>) : <pre className="mt-8 overflow-auto rounded-2xl bg-white p-6 text-sm text-brand-emerald">{JSON.stringify(data, null, 2)}</pre>)}</section>; }

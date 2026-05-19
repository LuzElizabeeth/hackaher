import { useMemo, useState } from "react";
import BusinessCard from "../components/BusinessCard";
import CategoryFilter from "../components/CategoryFilter";
import { getBusinesses } from "../lib/storage";
import type { Category } from "../types";

export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "Todas">("Todas");
  const data = getBusinesses();
  const filtered = useMemo(() => data.filter((business) => {
    const text = `${business.name} ${business.owner} ${business.zone} ${business.category}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (category === "Todas" || business.category === category);
  }), [query, category, data]);

  return (
    <div className="page narrow">
      <section className="page-header">
        <span className="eyebrow">Soy cliente / turista</span>
        <h1>Explora negocios locales</h1>
        <p>Encuentra productos, servicios y experiencias de mujeres emprendedoras de Cancun.</p>
      </section>
      <input className="search" placeholder="Buscar por negocio, zona o emprendedora" value={query} onChange={(e) => setQuery(e.target.value)} />
      <CategoryFilter value={category} onChange={setCategory} />
      <div className="business-grid">
        {filtered.map((business) => <BusinessCard key={business.id} business={business} />)}
        {!filtered.length && <div className="empty">No encontramos negocios con esos filtros.</div>}
      </div>
    </div>
  );
}

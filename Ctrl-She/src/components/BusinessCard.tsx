import { Link } from "react-router-dom";
import { MapPin, Store, Star } from "lucide-react";
import { useState } from "react";
import type { Business } from "../types";

export default function BusinessCard({ business }: { business: Business }) {
  const [failed, setFailed] = useState(false);
  return (
    <article className="business-card card">
      <div className="image-shell">
        {!failed ? <img src={business.image} alt={business.name} onError={() => setFailed(true)} /> : <div className="image-fallback" aria-label={business.name}>{business.name.charAt(0)}</div>}
      </div>
      <div className="card-body">
        <div className="row between">
          <span className="tag">{business.category}</span>
          <span className={business.status === "Verificada" ? "badge success" : "badge pending"}>{business.status}</span>
        </div>
        <h3>{business.name}</h3>
        <p>{business.owner}</p>
        <div className="meta"><MapPin size={16} /> {business.zone}</div>
        <div className="row between">
          <span className="rating"><Star size={16} fill="currentColor" /> {business.rating}</span>
<Link className="btn primary small" to={`/tienda/${business.id}`}>
  <Store size={16} /> Ver tienda
</Link>        </div>
      </div>
    </article>
  );
}

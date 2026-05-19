import { CalendarCheck, CreditCard, MapPin, Package, Users } from "lucide-react";
import { useState } from "react";
import type { CatalogItem } from "../types";
import { money } from "../lib/storage";

export default function ProductCard({ item, onSelect }: { item: CatalogItem; onSelect: (item: CatalogItem) => void }) {
  const [failed, setFailed] = useState(false);
  const action = item.type === "producto" ? "Comprar en línea" : item.type === "servicio" ? "Reservar servicio" : "Reservar experiencia";
  const depositLabel = item.type === "producto" ? null : item.deposit ? `Reserva en línea ${item.deposit}` : "Pago en línea";

  return (
    <article className="catalog-card card">
      <div className="image-shell">
        {!failed ? (
          <img src={item.image} alt={item.name} onError={() => setFailed(true)} />
        ) : (
          <div className="image-fallback" aria-label={item.name}>{item.name.charAt(0)}</div>
        )}
      </div>

      <div className="card-body">
        <div className="row between">
          <h3>{item.name}</h3>
          <strong>{money(item.price)}</strong>
        </div>

        <p>{item.description}</p>

        <div className="details-grid">
          {item.stock !== undefined && <span><Package size={15} /> Stock {item.stock}</span>}
          {item.delivery && <span><Package size={15} /> {item.delivery}</span>}
          {item.duration && <span><CalendarCheck size={15} /> {item.duration}</span>}
          {item.schedule && <span><CalendarCheck size={15} /> {item.schedule.join(", ")}</span>}
          {depositLabel && <span><CreditCard size={15} /> {depositLabel}</span>}
          {item.capacity && <span><Users size={15} /> Cupo {item.capacity}</span>}
          {item.language && <span>{item.language}</span>}
          {item.meetingPoint && <span><MapPin size={15} /> {item.meetingPoint}</span>}
        </div>
<button className="btn primary full" onClick={() => onSelect(item)}>
  {item.type === "producto" ? <Package size={18} /> : <CalendarCheck size={18} />}
  {action}
</button>     
</div>
    </article>
  );
}
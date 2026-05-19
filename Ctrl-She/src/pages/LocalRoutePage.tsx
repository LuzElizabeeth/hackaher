import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { getBusinesses } from "../lib/storage";

const zones = [
  { name: "Mercado 28", x: 42, y: 44, aliases: ["Centro de Cancun", "Cancun Centro"], labelSide: "left" },
  { name: "Zona Hotelera", x: 81, y: 57, aliases: [] },
  { name: "Parque de las Palapas", x: 48, y: 44, aliases: [] },
  { name: "Puerto Juarez", x: 67, y: 23, aliases: [] },
  { name: "Plaza Las Americas", x: 53, y: 55, aliases: [] }
];

export default function LocalRoutePage() {
  const [zone, setZone] = useState("Mercado 28");
  const businesses = getBusinesses();
  const selectedZone = zones.find((item) => item.name === zone);
  const filtered = useMemo(() => businesses.filter((business) => {
    const zoneNames = [zone, ...(selectedZone?.aliases || [])];
    return zoneNames.includes(business.zone);
  }), [businesses, selectedZone, zone]);

  return (
    <div className="page">
      <section className="page-header"><span className="eyebrow">Ruta local</span><h1>Mapa de emprendedoras en Cancún</h1><p>Descubre emprendedoras locales cerca de ti.</p></section>
      <section className="map-layout">
        <div className="mock-map card" aria-label="Mapa de Cancun con puntos de emprendedoras">
          {zones.map((item) => (
            <button key={item.name} className={`${zone === item.name ? "map-pin active" : "map-pin"} ${item.labelSide === "left" ? "label-left" : ""}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} onClick={() => setZone(item.name)} aria-label={`Ver negocios en ${item.name}`}>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
        <aside className="zone-panel card">
          <h2>{zone}</h2>
          <div className="zone-list">
            {zones.map((item) => <button key={item.name} className={zone === item.name ? "chip active" : "chip"} onClick={() => setZone(item.name)}>{item.name}</button>)}
          </div>
          <div className="compact-list">
            {filtered.map((business) => (
              <div key={business.id}>
                <b>{business.name}</b>
                <span>{business.category}</span>
                <Link className="btn primary small" to={`/tienda/${business.id}`}>Ver tienda</Link>
              </div>
            ))}
            {!filtered.length && <p>No hay negocios con estos filtros en esta zona.</p>}
          </div>
        </aside>
      </section>
    </div>
  );
}

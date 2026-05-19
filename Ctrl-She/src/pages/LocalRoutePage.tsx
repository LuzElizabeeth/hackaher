import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Layers, MapPin, Navigation, Star, Store, Users } from "lucide-react";
import { getBusinesses } from "../lib/storage";
import type { Business } from "../types";

const normalizeZone = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const zones = [
  {
    name: "Mercado 28",
    x: 42,
    y: 44,
    aliases: ["Mercado 28", "Centro de Cancún", "Centro de Cancun", "Cancún Centro", "Cancun Centro"],
    description: "Zona céntrica con tiendas, servicios creativos y puntos de entrega para productos locales.",
    hint: "Ideal para recoger compras, souvenirs y servicios dentro de la ciudad.",
    labelSide: "left"
  },
  {
    name: "Zona Hotelera",
    x: 82,
    y: 63,
    aliases: ["Zona Hotelera"],
    description: "Corredor turístico para experiencias, fotografía, servicios y actividades para visitantes.",
    hint: "Buena zona para reservar experiencias o servicios turísticos."
  },
  {
    name: "Parque de las Palapas",
    x: 49,
    y: 48,
    aliases: ["Parque de las Palapas"],
    description: "Punto cultural y familiar para talleres, recorridos y actividades locales.",
    hint: "Perfecto para experiencias culturales y encuentros en el centro."
  },
  {
    name: "Puerto Juárez",
    x: 66,
    y: 24,
    aliases: ["Puerto Juárez", "Puerto Juarez"],
    description: "Zona costera de conexión local, útil para productos y servicios cercanos al litoral.",
    hint: "Referencia rápida para negocios cerca de la costa norte."
  },
  {
    name: "Plaza Las Américas",
    x: 52,
    y: 55,
    aliases: ["Plaza Las Américas", "Plaza Las Americas"],
    description: "Punto comercial cómodo para entregas, accesorios, belleza y compras rápidas.",
    hint: "Práctico para entregas en punto acordado y compras planeadas."
  }
];

function getZoneBusinesses(businesses: Business[], zoneName: string) {
  const selectedZone = zones.find((item) => item.name === zoneName);
  const zoneNames = (selectedZone?.aliases || [zoneName]).map(normalizeZone);

  return businesses.filter((business) => zoneNames.includes(normalizeZone(business.zone)));
}

export default function LocalRoutePage() {
  const [zone, setZone] = useState("Mercado 28");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const businesses = getBusinesses();

  const selectedZone = zones.find((item) => item.name === zone) || zones[0];
  const filtered = useMemo(() => getZoneBusinesses(businesses, zone), [businesses, zone]);
  const selectedBusiness = filtered.find((business) => business.id === selectedBusinessId) || filtered[0];

  const zoneCounts = useMemo(
    () =>
      zones.reduce<Record<string, number>>((acc, item) => {
        acc[item.name] = getZoneBusinesses(businesses, item.name).length;
        return acc;
      }, {}),
    [businesses]
  );

  const handleZoneSelect = (nextZone: string) => {
    setZone(nextZone);
    const [firstBusiness] = getZoneBusinesses(businesses, nextZone);
    setSelectedBusinessId(firstBusiness?.id || null);
  };

  return (
    <div className="page local-route-page">
      <section className="page-header map-hero">
        <span className="eyebrow">Ruta local</span>
        <h1>Mapa de emprendedoras en Cancún</h1>
        <p>
          Explora negocios por zona, identifica puntos de entrega y entra directamente a la tienda de cada emprendedora.
        </p>
        <div className="map-summary-row" aria-label="Resumen de negocios en el mapa">
          <span><Store size={16} /> {businesses.length} negocios</span>
          <span><MapPin size={16} /> {zones.length} zonas visibles</span>
          <span><Navigation size={16} /> Navegación por marcadores</span>
        </div>
      </section>

      <section className="map-layout enhanced-map-layout">
        <div className="map-card-shell card">
          <div className="map-toolbar">
            <div>
              <span className="eyebrow">Vista geográfica</span>
              <h2>Ubicación de negocios</h2>
            </div>
            <div className="map-toolbar-actions" aria-label="Controles visuales del mapa">
              <span><Layers size={15} /> Zonas</span>
              <span><Users size={15} /> Negocios</span>
            </div>
          </div>

          <div className="mock-map enhanced-map" aria-label="Mapa de Cancún con marcadores de emprendedoras">
            <div className="map-focus-card" aria-live="polite">
              <b>{selectedZone.name}</b>
              <span>{zoneCounts[selectedZone.name] || 0} negocio(s) disponibles</span>
            </div>

            {zones.map((item) => {
              const count = zoneCounts[item.name] || 0;
              return (
                <button
                  key={item.name}
                  className={`${zone === item.name ? "map-pin active" : "map-pin"} ${item.labelSide === "left" ? "label-left" : ""}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  onClick={() => handleZoneSelect(item.name)}
                  aria-label={`Ver negocios en ${item.name}. ${count} negocio(s) disponibles`}
                  type="button"
                >
                  <MapPin size={16} aria-hidden="true" />
                  <strong>{count}</strong>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          <div className="map-legend" aria-label="Leyenda del mapa">
            <span><i className="legend-dot active" /> Zona seleccionada</span>
            <span><i className="legend-dot" /> Zona disponible</span>
            <span>El número indica negocios registrados en esa zona.</span>
          </div>
        </div>

        <aside className="zone-panel card enhanced-zone-panel">
          <span className="eyebrow">Zona seleccionada</span>
          <h2>{selectedZone.name}</h2>
          <p>{selectedZone.description}</p>

          <div className="zone-list improved-zone-list" aria-label="Seleccionar zona del mapa">
            {zones.map((item) => (
              <button
                key={item.name}
                className={zone === item.name ? "chip active" : "chip"}
                onClick={() => handleZoneSelect(item.name)}
                type="button"
              >
                {item.name}
                <small>{zoneCounts[item.name] || 0}</small>
              </button>
            ))}
          </div>

          {selectedBusiness && (
            <article className="selected-business-card">
              <img src={selectedBusiness.image} alt={selectedBusiness.name} />
              <div>
                <span>{selectedBusiness.category}</span>
                <h3>{selectedBusiness.name}</h3>
                <p>{selectedBusiness.description}</p>
                <div className="business-map-meta">
                  <b><Star size={15} /> {selectedBusiness.rating}</b>
                  <b><MapPin size={15} /> {selectedBusiness.zone}</b>
                </div>
                <Link className="btn primary small" to={`/tienda/${selectedBusiness.id}`}>Ver tienda</Link>
              </div>
            </article>
          )}

          <div className="compact-list improved-business-list">
            {filtered.map((business) => (
              <button
                key={business.id}
                className={selectedBusiness?.id === business.id ? "business-location-item active" : "business-location-item"}
                onClick={() => setSelectedBusinessId(business.id)}
                type="button"
              >
                <span>
                  <b>{business.name}</b>
                  <small>{business.category}</small>
                </span>
                <strong>{business.rating}</strong>
              </button>
            ))}
            {!filtered.length && (
              <div className="map-empty-state">
                <b>No hay negocios registrados aquí todavía.</b>
                <p>{selectedZone.hint}</p>
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}

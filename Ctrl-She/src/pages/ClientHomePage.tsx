import { Link } from "react-router-dom";
import {
  CalendarCheck,
  MapPin,
  ReceiptText,
  Search,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { businesses } from "../data/mockData";

const featuredBusinesses = businesses.slice(0, 3);

export default function ClientHomePage() {
  return (
    <div className="page client-home-page">
      <section className="client-home-hero card">
        <div>
          <span className="eyebrow">Inicio del cliente</span>
          <h1>Explora, compra y reserva con negocios locales.</h1>
          <p>
            Encuentra productos, servicios y experiencias de mujeres emprendedoras en Cancún.
            Consulta tus pedidos, genera comprobantes y descubre rutas locales desde un solo lugar.
          </p>

          <div className="cta-row">
            <Link className="btn primary" to="/explorar">
              Explorar negocios
            </Link>
            <Link className="btn outline" to="/mis-pedidos">
              Ver mis pedidos
            </Link>
          </div>
        </div>

        <aside className="hero-logo-panel client-home-summary" aria-label="Logo Ctrl + She">
          <img src="/logo.png" alt="Ctrl + She" />
        </aside>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Atajos</span>
            <h2>¿Qué quieres hacer hoy?</h2>
          </div>
        </div>

        <div className="client-shortcut-grid">
          <Link className="client-shortcut-card card" to="/explorar">
            <Search />
            <h3>Explorar catálogo</h3>
            <p>Busca productos, servicios y experiencias disponibles.</p>
          </Link>

          <Link className="client-shortcut-card card" to="/ruta-local">
            <MapPin />
            <h3>Ruta local</h3>
            <p>Consulta negocios cercanos mediante una ruta simulada.</p>
          </Link>

          <Link className="client-shortcut-card card" to="/mis-pedidos">
            <ShoppingBag />
            <h3>Mis pedidos</h3>
            <p>Revisa compras, reservas, estados y comprobantes.</p>
          </Link>

          <Link className="client-shortcut-card card" to="/mis-pedidos">
            <ReceiptText />
            <h3>Comprobantes</h3>
            <p>Accede a comprobantes generados desde tus pedidos.</p>
          </Link>
        </div>
      </section>

      <section className="section client-interest-section">
        <article className="card padded">
          <CalendarCheck />
          <h2>Reserva sin complicarte</h2>
          <p>
            Agenda servicios o experiencias sin llenar formularios largos. El flujo está
            pensado para que el comprador avance rápido y entienda cada paso.
          </p>
        </article>

        <article className="card padded">
          <Sparkles />
          <h2>Compra con más confianza</h2>
          <p>
            Consulta perfiles de tiendas, reseñas, datos de contacto, métodos de pago
            y comprobantes antes de finalizar.
          </p>
        </article>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Recomendados</span>
            <h2>Negocios para explorar</h2>
          </div>

          <Link className="btn small outline" to="/explorar">
            Ver todos
          </Link>
        </div>

        <div className="business-grid">
          {featuredBusinesses.map((business) => (
            <article className="business-card card" key={business.id}>
              {business.image ? (
                <img src={business.image} alt={business.name} />
              ) : (
                <div className="image-fallback">
                  {business.name.slice(0, 1)}
                </div>
              )}

              <div className="card-body">
                <span className="tag">{business.category}</span>
                <h3>{business.name}</h3>
                <p>{business.description}</p>

                <Link className="btn small primary" to={`/tienda/${business.id}`}>
                  Ver tienda
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

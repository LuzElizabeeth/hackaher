import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Clock,
  Compass,
  FileText,
  MessageSquare,
  Palette,
  Scissors,
  Shirt,
  Sparkles,
  Star,
  Store,
  UtensilsCrossed
} from "lucide-react";

const categories = [
  { id: "Artesanías", name: "Artesanías", icon: Palette, color: "cat-yellow" },
  { id: "Moda", name: "Moda", icon: Shirt, color: "cat-purple" },
  { id: "Belleza", name: "Belleza", icon: Scissors, color: "cat-pink" },
  { id: "Servicios", name: "Servicios", icon: UtensilsCrossed, color: "cat-blue" },
  { id: "Experiencias", name: "Experiencias", icon: Compass, color: "cat-green" }
];

const steps = [
  ["01", "Registra tu negocio", "Crea tu perfil de emprendedora con catálogo, ubicación y datos de contacto.", "text-purple"],
  ["02", "Comparte tu tienda", "Envía tu perfil a clientes, turistas, hoteles, ferias y redes sociales.", "text-blue"],
  ["03", "Automatiza con IA", "Genera descripciones, ideas de publicación, respuestas frecuentes y traducciones.", "text-green"],
  ["04", "Gestiona y crece", "Administra pedidos, reservas, reseñas y comprobantes desde tu panel.", "text-yellow"]
];

const features = [
  [Clock, "Ahorra tiempo", "Reduce tareas repetitivas para dedicar más tiempo a tu negocio y familia."],
  [Store, "Tienda digital", "Muestra productos, servicios o experiencias en un perfil claro y compartible."],
  [FileText, "Pedidos ordenados", "Centraliza solicitudes y comprobantes para evitar perder información en mensajes."],
  [MessageSquare, "Conexión directa", "Integra contacto por WhatsApp para responder rápido a tus clientes."]
];

const testimonials = [
  ["María González", "Artesanías Maya Kaan", "Ctrl + She me ayudó a mostrar mis productos sin depender solo de redes sociales."],
  ["Laura Sánchez", "Belleza Tropical Spa", "La plataforma hace más fácil explicar mis servicios y organizar solicitudes de clientes."]
];

export default function LandingPage() {
  return (
    <div className="landing-redesign">
      <section className="home-hero-section">
        <div className="hero-pattern" />
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <span className="pill-label"><Sparkles size={16} /> Plataforma para mujeres emprendedoras</span>
            <h1>Toma el <span>control</span> de tu negocio local</h1>
            <p>
              Ctrl + She automatiza tareas para que dediques menos tiempo a lo administrativo
              y más a lo que amas. Conecta con turistas y clientes locales en Cancún.
            </p>
            <div className="cta-row">
              <Link className="btn primary" to="/explorar">
                Explorar negocios <ArrowRight size={18} />
              </Link>
              <Link className="btn outline" to="/login">
                Registrar emprendimiento
              </Link>
            </div>
            <div className="impact-stats">
              <p>Datos que nos impulsan:</p>
              <div>
                <strong>39.7h</strong><span>semanales dedicadas por mujeres a trabajo doméstico y cuidados.</span>
              </div>
              <div>
                <strong>95.5%</strong><span>de las unidades económicas en México son microempresas.</span>
              </div>
            </div>
          </div>

          <div className="hero-preview-card" aria-label="Vista previa de negocio destacado">
            <div className="store-mini-header">
              <div className="mini-icon"><Star size={20} /></div>
              <div>
                <strong>Artesanías Maya Kaan</strong>
                <span>Mercado 28, Centro</span>
              </div>
            </div>
            <div className="store-mini-art"><Palette size={76} /></div>
            <div className="store-mini-footer">
              <span className="rating"><Star size={16} fill="currentColor" /> 4.8</span>
              <span className="whatsapp-chip"><MessageSquare size={16} /> WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section white-section">
        <div className="section-heading center">
          <h2>Explora por categoría</h2>
          <p>Descubre emprendimientos locales de mujeres en Cancún.</p>
        </div>
        <div className="category-showcase">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} className="category-tile" to={`/explorar?categoria=${category.id}`}>
                <span className={`category-icon ${category.color}`}><Icon size={28} /></span>
                <strong>{category.name}</strong>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-section problem-solution-section">
        <article>
          <span className="eyebrow">El problema</span>
          <h2>Las emprendedoras enfrentan una doble jornada</h2>
          <p>
            Pedidos en mensajes, catálogos dispersos, reservas manuales y poca visibilidad digital
            consumen tiempo que podría invertirse en vender, crear y crecer.
          </p>
          <ul className="check-list warning">
            <li>Falta de tiempo para gestionar presencia digital.</li>
            <li>Dificultad para conectar con turistas y clientes nuevos.</li>
            <li>Procesos manuales para pedidos, reservas y comprobantes.</li>
          </ul>
        </article>
        <article>
          <span className="eyebrow success-text">La solución</span>
          <h2>Ctrl + She ordena tu operación diaria</h2>
          <p>
            La plataforma reúne tienda, catálogo, pedidos, reseñas e IA comercial en un flujo
            sencillo para clientes y emprendedoras.
          </p>
          <ul className="check-list success">
            <li>IA para descripciones, preguntas frecuentes y traducciones.</li>
            <li>Tienda pública compartible para vender con mayor confianza.</li>
            <li>Panel para administrar productos, pedidos y solicitudes.</li>
          </ul>
        </article>
      </section>

      <section className="home-section white-section" id="como-funciona">
        <div className="section-heading center">
          <h2>Cómo funciona</h2>
          <p>En cuatro pasos puedes tener tu negocio digitalizado y listo para recibir clientes.</p>
        </div>
        <div className="step-grid redesign-steps">
          {steps.map(([number, title, description, color]) => (
            <article key={number}>
              <b className={color}>{number}</b>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tools-section">
        <div className="section-heading center invert">
          <h2>Herramientas que te empoderan</h2>
          <p>Todo lo necesario para gestionar un negocio local de forma más clara y eficiente.</p>
        </div>
        <div className="feature-grid redesign-features">
          {features.map(([Icon, title, description]) => (
            <article key={String(title)}>
              <span><Icon size={24} /></span>
              <h3>{String(title)}</h3>
              <p>{String(description)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section testimonials-section">
        <div className="section-heading center">
          <h2>Emprendedoras que ya usan Ctrl + She</h2>
          <p>Historias demo para mostrar el impacto de la plataforma.</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map(([name, business, quote]) => (
            <article className="testimonial-card" key={name}>
              <div className="stars"><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /></div>
              <p>“{quote}”</p>
              <div className="testimonial-author">
                <span>{name.charAt(0)}</span>
                <div><strong>{name}</strong><small>{business}</small></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="final-redesign-cta">
        <div>
          <BadgeCheck size={42} />
          <h2>Comienza a digitalizar tu negocio hoy</h2>
          <p>Únete a una comunidad de mujeres emprendedoras que transforman la economía local de Cancún.</p>
          <div className="cta-row center-row">
            <Link className="btn primary" to="/explorar">Explorar negocios</Link>
            <Link className="btn outline" to="/login">Ver demo de panel</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

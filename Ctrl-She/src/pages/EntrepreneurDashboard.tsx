import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Edit3,
  Eye,
  MapPin,
  Package,
  Save,
  Share2,
  Sparkles,
  Star,
  Store,
  X
} from "lucide-react";
import ReviewCard from "../components/ReviewCard";
import { getBusinesses, saveBusinesses } from "../lib/storage";
import type { Business } from "../types";
import "../styles/seller-dashboard.css";

type StoreForm = Pick<Business, "name" | "owner" | "description" | "phone" | "zone" | "hours" | "image">;

export default function EntrepreneurDashboard() {
  const [businesses, setBusinesses] = useState(getBusinesses());
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const storeInfoRef = useRef<HTMLElement | null>(null);

  const business = businesses.find((item) => item.id === "artesanias-lupita") || businesses[0];

  const [form, setForm] = useState<StoreForm>(() => ({
    name: business?.name || "",
    owner: business?.owner || "",
    description: business?.description || "",
    phone: business?.phone || "",
    zone: business?.zone || "",
    hours: business?.hours || "10:00 a 18:00",
    image: business?.image || ""
  }));

  if (!business) {
    return (
      <div className="page dashboard seller-dashboard-page">
        <div className="empty">No se encontró información del negocio.</div>
      </div>
    );
  }

  const storeUrl = `${window.location.origin}/tienda/${business.id}`;

  const updateForm = (field: keyof StoreForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSavedMessage("");
  };

  const saveStore = () => {
    const updatedBusinesses = businesses.map((item) =>
      item.id === business.id
        ? {
            ...item,
            name: form.name.trim() || item.name,
            owner: form.owner.trim() || item.owner,
            description: form.description.trim() || item.description,
            phone: form.phone.trim() || item.phone,
            zone: form.zone.trim() || item.zone,
            hours: form.hours?.trim() || item.hours,
            image: form.image.trim() || item.image
          }
        : item
    );

    saveBusinesses(updatedBusinesses);
    setBusinesses(updatedBusinesses);
    setIsEditing(false);
    setSavedMessage("Cambios guardados en tu tienda.");
  };

  const cancelEdit = () => {
    setForm({
      name: business.name,
      owner: business.owner,
      description: business.description,
      phone: business.phone,
      zone: business.zone,
      hours: business.hours || "10:00 a 18:00",
      image: business.image
    });
    setIsEditing(false);
    setSavedMessage("");
  };

  const startEdit = () => {
    setIsEditing(true);
    setSavedMessage("");

    window.setTimeout(() => {
      const panelTop = storeInfoRef.current?.getBoundingClientRect().top;

      if (panelTop === undefined) return;

      window.scrollTo({
        top: window.scrollY + panelTop - 120,
        behavior: "smooth"
      });
    }, 0);
  };

  const shareStore = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: business.name, text: business.description, url: storeUrl });
      } else {
        await navigator.clipboard.writeText(storeUrl);
      }
    } catch {
      // El boton de compartir es silencioso para no mostrar avisos si el navegador lo bloquea.
    }
  };

  return (
    <div className="page dashboard seller-dashboard-page">
      <section className="seller-store-hero">
        <div className="seller-store-hero-copy">
          <span className={business.status === "Verificada" ? "badge success seller-store-status" : "badge pending seller-store-status"}>
            {business.status}
          </span>
          <h1>{business.name}</h1>
          <p>
            Administra la información que verán tus clientes, revisa tus métricas principales
            y entra rápido a catálogo, pedidos o vista pública.
          </p>

          <div className="seller-store-actions">
            <button className="btn primary" type="button" onClick={startEdit}>
              <Edit3 size={18} /> Editar información
            </button>
            <Link className="btn outline" to={`/tienda/${business.id}`}>
              <Eye size={18} /> Ver tienda pública
            </Link>
            <button className="btn outline" type="button" onClick={shareStore}>
              <Share2 size={18} /> Compartir
            </button>
          </div>

          {savedMessage && <div className="seller-store-alert">{savedMessage}</div>}
        </div>

        <div className="seller-store-cover">
          <img src={business.image} alt={business.name} />
          <div>
            <strong>{business.name}</strong>
            <span>{business.category}</span>
          </div>
        </div>
      </section>

      <section className="seller-store-grid">
        <article className="card padded seller-store-info-card" ref={storeInfoRef}>
          <div className="seller-store-section-title">
            <span className="eyebrow">Información visible para clientes</span>
            <h2>Datos de la tienda</h2>
          </div>

          {isEditing ? (
            <div className="seller-store-form">
              <label>Nombre del negocio<input value={form.name} onChange={(event) => updateForm("name", event.target.value)} /></label>
              <label>Emprendedora<input value={form.owner} onChange={(event) => updateForm("owner", event.target.value)} /></label>
              <label>Descripción<textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} /></label>
              <label>WhatsApp<input value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} /></label>
              <label>Zona<input value={form.zone} onChange={(event) => updateForm("zone", event.target.value)} /></label>
              <label>Horario<input value={form.hours || ""} onChange={(event) => updateForm("hours", event.target.value)} /></label>
              <label className="full">Imagen principal<input value={form.image} onChange={(event) => updateForm("image", event.target.value)} /></label>

              <div className="seller-store-form-actions">
                <button className="btn primary" type="button" onClick={saveStore}><Save size={18} /> Guardar cambios</button>
                <button className="btn outline" type="button" onClick={cancelEdit}><X size={18} /> Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="seller-store-details">
              <p><b>Negocio:</b> {business.name}</p>
              <p><b>Emprendedora:</b> {business.owner}</p>
              <p><b>Descripción:</b> {business.description}</p>
              <p><b>WhatsApp:</b> {business.phone}</p>
              <p><b>Zona:</b> {business.zone}</p>
              <p><b>Horario:</b> {business.hours || "10:00 a 18:00"}</p>
            </div>
          )}
        </article>

        <aside className="seller-store-side-card card padded">
          <Sparkles />
          <h2>Accesos rápidos</h2>
          <p>Continúa administrando tu operación sin salir del panel.</p>
          <Link className="btn primary" to="/catalogo"><Package size={18} /> Gestionar catálogo</Link>
          <Link className="btn outline" to="/pedidos"><ClipboardList size={18} /> Revisar pedidos</Link>
          <Link className="btn outline" to={`/tienda/${business.id}`}><Eye size={18} /> Previsualizar tienda</Link>
        </aside>
      </section>

      <section className="seller-store-grid bottom">
        <article className="card padded seller-store-reviews">
          <div className="seller-store-section-title">
            <span className="eyebrow">Opiniones</span>
            <h2>Reseñas recibidas</h2>
          </div>

          <div className="reviews-grid one-col">
            {business.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </article>

        <article className="card padded">
          <div className="seller-store-section-title">
            <span className="eyebrow">Ubicación y confianza</span>
            <h2>Perfil comercial</h2>
          </div>
          <div className="seller-store-trust-list">
            <p><MapPin size={18} /> {business.zone}</p>
            <p><Star size={18} /> {business.rating} de calificación</p>
            <p><Eye size={18} /> {business.visits} visitas registradas</p>
            <p><Store size={18} /> {business.category}</p>
          </div>
        </article>
      </section>
    </div>
  );
}

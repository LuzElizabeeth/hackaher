import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { CalendarCheck, MessageCircle, MapPin, Share2, ShoppingBag, Star } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ReviewCard from "../components/ReviewCard";
import ConfirmationPanel from "../components/ConfirmationPanel";
import { addReview, getBusinesses } from "../lib/storage";
import type { CatalogItem, Review } from "../types";
import { useAuth } from "../auth/AuthContext";
import "../styles/reviews.css";

export default function StoreProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const reviewStorageKey = id ? `ctrl-she-reviewed-${id}` : "";

  const [business, setBusiness] = useState(
    getBusinesses().find((item) => item.id === id)
  );

  const [imageFailed, setImageFailed] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewError, setReviewError] = useState("");
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(() =>
    Boolean(reviewStorageKey && localStorage.getItem(reviewStorageKey))
  );

  if (!business) {
    return (
      <div className="page">
        <div className="empty">Tienda no encontrada.</div>
      </div>
    );
  }

  const canReview = isAuthenticated && role === "cliente";

  const selectItem = (item: CatalogItem) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    navigate(`/pedido?business=${business.id}&item=${item.id}`);
  };

  const wa = `https://wa.me/52${business.phone}?text=${encodeURIComponent(
    `Hola, vi tu negocio ${business.name} en Ctrl + She`
  )}`;

  const url = `${window.location.origin}/tienda/${business.id}`;

const shareStore = async () => {
  if (navigator.share) {
    await navigator.share({
      title: business.name,
      text: `Mira esta tienda en Ctrl + She: ${business.name}`,
      url
    });
  } else {
    await navigator.clipboard.writeText(url);
    alert("Enlace de la tienda copiado al portapapeles.");
  }
};

  const saveReview = () => {
    setReviewError("");

    if (!canReview) {
      setReviewError("Inicia sesión como cliente para publicar una reseña.");
      return;
    }

    if (hasReviewed) {
      setReviewError("Ya registraste una reseña para esta tienda.");
      return;
    }

    if (!reviewRating) {
      setReviewError("Selecciona una calificación antes de publicar tu reseña.");
      return;
    }

    if (!reviewText.trim()) {
      setReviewError("Escribe una reseña breve antes de publicarla.");
      return;
    }

    const review: Review = {
      id: crypto.randomUUID(),
      businessId: business.id,
      author: "Cliente demo",
      rating: reviewRating,
      text: reviewText.trim()
    };

    const updatedBusiness = addReview(business.id, review);

    if (updatedBusiness) {
      setBusiness(updatedBusiness);
    }

    if (reviewStorageKey) {
      localStorage.setItem(reviewStorageKey, "true");
    }

    setHasReviewed(true);
    setReviewText("");
    setReviewRating(0);
    setHoverRating(0);
    setReviewConfirmed(true);
  };

  return (
    <div className="page">
      <section className="store-hero">
        {!imageFailed ? (
          <img
            src={business.image}
            alt={business.name}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="store-image-fallback">
            {business.name.charAt(0)}
          </div>
        )}

        <div>
          <span className="badge pink">{business.category}</span>
          <h1>{business.name}</h1>
          <p>
            {business.owner} · {business.zone}
          </p>
          <p>{business.description}</p>

          <div className="row">
            <span className="rating">
              <Star size={16} fill="currentColor" /> {business.rating}
            </span>
            <span className="badge success">{business.status}</span>
          </div>
        </div>
      </section>

      <div className="action-strip">
  <a
    className="btn whatsapp"
    href={wa}
    target="_blank"
    rel="noreferrer"
  >
    <MessageCircle size={18} /> Contactar por WhatsApp
  </a>

  <Link className="btn outline" to="/ruta-local">
    <MapPin size={18} /> Ver ubicación
  </Link>

  <button
  className="btn secondary action-button"
  onClick={() =>
    document.getElementById("catalogo")?.scrollIntoView({
      behavior: "smooth"
    })
  }
>
  {business.type === "experiencia" ? (
    <>
      <CalendarCheck size={18} />
      Reservar experiencia
    </>
  ) : (
    <>
      <ShoppingBag size={18} />
      Hacer pedido
    </>
  )}
</button>

  <button className="btn primary" onClick={shareStore}>
  <Share2 size={18} /> Compartir
</button>
</div>

      <section className="section">
  <div>
    <h2 id="catalogo">Catálogo</h2>

    <div className="catalog-grid">
      {business.items.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
          onSelect={selectItem}
        />
      ))}
    </div>
  </div>
</section>

      <section className="section review-area">
        <div className="review-area-header">
          <div>
            <span className="eyebrow">Opiniones</span>
            <h2>Reseñas de clientes</h2>
            <p>Consulta experiencias reales de otras compradoras.</p>
          </div>
        </div>

        {reviewConfirmed && (
          <ConfirmationPanel
            title="Reseña publicada"
            message="Gracias, tu reseña quedó registrada en esta tienda."
            detailTo={`/tienda/${business.id}`}
            onBack={() => setReviewConfirmed(false)}
          />
        )}

        <div className="review-list">
          {business.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {!canReview && (
          <div className="review-disabled-panel">
            <strong>Reseñas disponibles solo para clientes</strong>
            <p>
              Para publicar una reseña necesitas iniciar sesión como cliente.
              Puedes seguir explorando la tienda como invitado, pero la opción de reseñar
              permanecerá deshabilitada.
            </p>

            {!isAuthenticated && (
              <Link className="btn primary" to="/login">
                Iniciar sesión
              </Link>
            )}
          </div>
        )}

        {canReview && (
          <div className="review-form-panel">
            <div>
              <span className="eyebrow">Tu opinión</span>
              <h3>Comparte tu experiencia</h3>
              <p>Solo puedes registrar una reseña por tienda desde este navegador.</p>
            </div>

            {hasReviewed ? (
              <div className="review-inline-alert success">
                Ya registraste una reseña para esta tienda.
              </div>
            ) : (
              <>
                <label className="review-rating-label">
                  Tu calificación
                </label>

                <div className="review-star-picker">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      type="button"
                      key={value}
                      className={
                        value <= (hoverRating || reviewRating)
                          ? "review-star-button is-active"
                          : "review-star-button"
                      }
                      onClick={() => setReviewRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Seleccionar ${value} ${value === 1 ? "estrella" : "estrellas"}`}
                      title={`${value} ${value === 1 ? "estrella" : "estrellas"}`}
                    >
                      <Star fill="currentColor" strokeWidth={2} />
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="Escribe tu reseña para esta tienda"
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                />

                {reviewError && (
                  <div className="review-inline-alert warning" role="alert">
                    {reviewError}
                  </div>
                )}

                <div className="review-form-actions">
                  <button
                    className="btn primary"
                    onClick={saveReview}
                    disabled={!reviewText.trim() || reviewRating === 0}
                  >
                    Publicar reseña
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, BellRing, CheckCircle2, Image, Megaphone, PackageCheck, PencilLine, Sparkles, TrendingUp, X } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

type StockLevel = "crítico" | "bajo" | "preventivo";
type SignalType = "Bajo stock" | "Alta visualización" | "Descripción" | "Imagen" | "Tendencia";

interface StockRecommendation {
  id: string;
  productName: string;
  businessName: string;
  metric: string;
  level: StockLevel;
  signal: SignalType;
  title: string;
  message: string;
  nextStep: string;
  confidence: string;
}

const SELLER_PATHS = ["/emprendedora", "/catalogo", "/pedidos", "/qr", "/ia"];

function isSellerView(pathname: string, role: ReturnType<typeof useAuth>["role"]) {
  return role === "emprendedora" || SELLER_PATHS.some((path) => pathname.startsWith(path));
}

function getStockRecommendations() {
  const recommendations: StockRecommendation[] = [
    {
      id: "ai-low-stock-bolsa",
      productName: "Bolsa tejida",
      businessName: "Artesanías Lupita",
      metric: "4 piezas",
      level: "bajo",
      signal: "Bajo stock",
      title: "Bajo stock en Bolsa tejida",
      message: "Quedan 4 piezas disponibles. Si este producto recibe pedidos esta semana, podrías quedarte sin unidades para entrega inmediata.",
      nextStep: "Reponer inventario o marcarlo como bajo pedido.",
      confidence: "Prioridad alta"
    },
    {
      id: "ai-high-views-pulsera",
      productName: "Pulsera Caribe Maya",
      businessName: "Artesanías Lupita",
      metric: "Alta visualización",
      level: "preventivo",
      signal: "Alta visualización",
      title: "Pulsera Caribe Maya está recibiendo más visitas",
      message: "Este producto concentra más atención que el resto del catálogo. Conviene mantenerlo visible y revisar que precio, stock e imagen estén actualizados.",
      nextStep: "Destacarlo en redes o convertirlo en producto principal.",
      confidence: "Confianza alta"
    },
    {
      id: "ai-description-collar",
      productName: "Collar de conchas",
      businessName: "Artesanías Lupita",
      metric: "Texto corto",
      level: "preventivo",
      signal: "Descripción",
      title: "Mejorar descripción de Collar de conchas",
      message: "La descripción explica el producto, pero no menciona ocasión de uso, materiales ni valor artesanal. Eso puede reducir la intención de compra.",
      nextStep: "Agregar materiales, estilo y una frase de uso: regalo, playa o recuerdo de Cancún.",
      confidence: "Confianza media"
    },
    {
      id: "ai-image-bolsa",
      productName: "Bolsa tejida",
      businessName: "Artesanías Lupita",
      metric: "Imagen oscura",
      level: "bajo",
      signal: "Imagen",
      title: "Mejorar imagen de Bolsa tejida",
      message: "La foto se percibe más oscura que las demás. Una imagen con mejor luz ayudaría a entender textura, tamaño y color.",
      nextStep: "Subir foto clara, con fondo neutro o mostrando la bolsa en uso.",
      confidence: "Confianza media"
    },
    {
      id: "ai-trend-caribe-stock",
      productName: "Accesorios Caribe",
      businessName: "Artesanías Lupita",
      metric: "Tendencia próxima",
      level: "preventivo",
      signal: "Tendencia",
      title: "Preparar stock para tendencia Caribe",
      message: "Viene una temporada con mayor interés en recuerdos de playa y piezas ligeras. Conviene tener más stock de pulseras, collares y accesorios fáciles de transportar.",
      nextStep: "Aumentar stock de Pulsera Caribe Maya y Collar de conchas.",
      confidence: "Confianza alta"
    }
  ];

  return recommendations;
}

function getLevelLabel(level: StockLevel) {
  if (level === "crítico") return "Crítico";
  if (level === "bajo") return "Stock bajo";
  return "Preventivo";
}

function getSignalIcon(signal: SignalType) {
  if (signal === "Alta visualización") return <TrendingUp size={15} />;
  if (signal === "Descripción") return <PencilLine size={15} />;
  if (signal === "Imagen") return <Image size={15} />;
  if (signal === "Tendencia") return <Megaphone size={15} />;
  return <PackageCheck size={15} />;
}

export default function SellerStockAssistant() {
  const { role } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const shouldShow = isSellerView(location.pathname, role);
  const recommendations = useMemo(() => getStockRecommendations(), []);
  const mainAlert = recommendations[0];
  const alertCount = recommendations.length;

  if (!shouldShow) return null;

  return (
    <section className="seller-stock-assistant" aria-label="Asistente de recomendaciones de stock">
      {isOpen && (
        <div className="stock-assistant-panel" role="dialog" aria-modal="false" aria-label="Recomendaciones de inventario">
          <header className="stock-assistant-header">
            <div className="stock-assistant-doll" aria-hidden="true">
              <Sparkles size={14} />
            </div>
            <div>
              <span>Asistente operativa</span>
              <h2>She te avisa</h2>
            </div>
            <button type="button" aria-label="Cerrar recomendaciones" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </header>

          {alertCount > 0 ? (
            <>
              <div className="stock-assistant-summary">
                  <BellRing size={18} />
                  <p>
                  Detecté {alertCount} recomendaciones claras para catálogo: stock, visualizaciones, descripción, imagen y tendencia.
                </p>
              </div>

              <div className="stock-alert-list">
                {recommendations.map((alert) => (
                  <article key={alert.id} className={`stock-alert-card ${alert.level}`}>
                    <div className="stock-alert-topline">
                      <span className="stock-alert-level">{getLevelLabel(alert.level)}</span>
                      <strong>{alert.metric}</strong>
                    </div>
                    <span className="stock-alert-signal">{getSignalIcon(alert.signal)} {alert.signal} · {alert.confidence}</span>
                    <h3>{alert.productName}</h3>
                    <small>{alert.businessName}</small>
                    <p>{alert.message}</p>
                    <div className="stock-alert-next">
                      <PackageCheck size={15} />
                      <span>{alert.nextStep}</span>
                    </div>
                  </article>
                ))}
              </div>

              <footer className="stock-assistant-actions">
                <Link to="/catalogo" onClick={() => setIsOpen(false)}>
                  Ir a catálogo
                  <ArrowRight size={16} />
                </Link>
              </footer>
            </>
          ) : (
            <div className="stock-assistant-empty">
              <CheckCircle2 size={24} />
              <h3>Sin alertas críticas</h3>
              <p>
                Por ahora no hay recomendaciones pendientes. Cuando detecte señales relevantes en tu catálogo, She las mostrará aquí.
              </p>
              <Link to="/catalogo" onClick={() => setIsOpen(false)}>
                Revisar catálogo
              </Link>
            </div>
          )}
        </div>
      )}

      <button className="stock-assistant-launcher" type="button" onClick={() => setIsOpen(true)} aria-label="Abrir avisos de stock bajo">
        <span className="stock-launcher-doll" aria-hidden="true">
          <Sparkles size={16} />
        </span>
        <span className="stock-launcher-copy">
          <strong>Señales IA</strong>
          <small>{mainAlert ? `${mainAlert.signal}: ${mainAlert.productName}` : "Revisar catálogo"}</small>
        </span>
        {alertCount > 0 && <span className="stock-launcher-badge">{alertCount}</span>}
      </button>
    </section>
  );
}

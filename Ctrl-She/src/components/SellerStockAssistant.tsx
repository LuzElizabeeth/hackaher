import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, ArrowRight, BellRing, Boxes, CheckCircle2, PackageCheck, Sparkles, X } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { businesses } from "../data/mockData";
import type { CatalogItem } from "../types";

type StockLevel = "crítico" | "bajo" | "preventivo";

interface StockRecommendation {
  id: string;
  productName: string;
  businessName: string;
  stock: number;
  level: StockLevel;
  title: string;
  message: string;
  nextStep: string;
}

const SELLER_PATHS = ["/emprendedora", "/catalogo", "/pedidos", "/qr", "/ia"];
const LOW_STOCK_LIMIT = 4;

function isSellerView(pathname: string, role: ReturnType<typeof useAuth>["role"]) {
  return role === "emprendedora" || SELLER_PATHS.some((path) => pathname.startsWith(path));
}

function getLevel(stock: number): StockLevel {
  if (stock <= 1) return "crítico";
  if (stock <= 3) return "bajo";
  return "preventivo";
}

function getRecommendation(item: CatalogItem, businessName: string): StockRecommendation | null {
  if (typeof item.stock !== "number" || item.stock > LOW_STOCK_LIMIT) return null;

  const level = getLevel(item.stock);

  const copyByLevel: Record<StockLevel, Pick<StockRecommendation, "title" | "message" | "nextStep">> = {
    crítico: {
      title: "Stock casi agotado",
      message: `Solo queda ${item.stock} pieza disponible. Conviene pausar la promoción o preparar más unidades antes de recibir nuevos pedidos.`,
      nextStep: "Surtir o actualizar disponibilidad hoy."
    },
    bajo: {
      title: "Stock bajo",
      message: `Quedan ${item.stock} piezas disponibles. Es buen momento para planear reposición y evitar que el producto se agote durante una venta.`,
      nextStep: "Preparar más piezas o ajustar el stock."
    },
    preventivo: {
      title: "Alerta preventiva",
      message: `Quedan ${item.stock} piezas. Todavía hay disponibilidad, pero ya conviene revisar si se debe surtir para mantener activo el producto.`,
      nextStep: "Revisar inventario y definir reposición."
    }
  };

  const copy = copyByLevel[level];

  return {
    id: item.id,
    productName: item.name,
    businessName,
    stock: item.stock,
    level,
    title: copy.title,
    message: copy.message,
    nextStep: copy.nextStep
  };
}

function getStockRecommendations() {
  return businesses.flatMap((business) =>
    business.items
      .map((item) => getRecommendation(item, business.name))
      .filter((recommendation): recommendation is StockRecommendation => Boolean(recommendation))
  );
}

function getLevelLabel(level: StockLevel) {
  if (level === "crítico") return "Crítico";
  if (level === "bajo") return "Stock bajo";
  return "Preventivo";
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
              <span>She</span>
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
                  Detecté {alertCount} producto{alertCount === 1 ? "" : "s"} con pocas piezas disponibles. Revisa la sugerencia antes de que se agote el catálogo.
                </p>
              </div>

              <div className="stock-alert-list">
                {recommendations.map((alert) => (
                  <article key={alert.id} className={`stock-alert-card ${alert.level}`}>
                    <div className="stock-alert-topline">
                      <span className="stock-alert-level">{getLevelLabel(alert.level)}</span>
                      <strong>{alert.stock} pieza{alert.stock === 1 ? "" : "s"}</strong>
                    </div>
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
                Por ahora no hay productos con stock bajo. Cuando un producto tenga {LOW_STOCK_LIMIT} piezas o menos, She mostrará una recomendación aquí.
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
          <strong>She te avisa</strong>
          <small>{mainAlert ? `${mainAlert.productName}: ${mainAlert.stock} disponibles` : "Revisar inventario"}</small>
        </span>
        {alertCount > 0 && <span className="stock-launcher-badge">{alertCount}</span>}
        <Boxes size={18} aria-hidden="true" />
      </button>
    </section>
  );
}

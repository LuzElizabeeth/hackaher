import { Link } from "react-router-dom";
import { CalendarDays, Image, PackageSearch, Sparkles, Sun, TrendingUp } from "lucide-react";

const alerts = [
  {
    title: "Tienes 2 pedidos pendientes por confirmar.",
    detail: "Conviene responderlos hoy para no perder ventas.",
    to: "/pedidos",
    icon: <PackageSearch size={18} />
  },
  {
    title: "Hay una reserva la proxima semana.",
    detail: "Prepara horarios, materiales y confirmacion con la clienta.",
    to: "/pedidos",
    icon: <CalendarDays size={18} />
  },
  {
    title: "Tu producto más consultado es Pulsera Caribe Maya.",
    detail: "Sube stock, mejora la foto o prepara una promoción corta.",
    to: "/catalogo",
    icon: <TrendingUp size={18} />
  }
];

const predictions = [
  { title: "Se acerca temporada alta", detail: "Prepara mas stock de piezas pequenas y listas para entrega rapida.", icon: <Sun size={18} /> },
  { title: "Aumentara la demanda en Zona Hotelera", detail: "Publica disponibilidad y entregas en puntos faciles para turistas.", icon: <TrendingUp size={18} /> },
  { title: "Los accesorios con tonos Caribe estan subiendo", detail: "Crea un paquete de pulsera + bolsa con precio especial.", icon: <PackageSearch size={18} /> },
  { title: "Clientes responden mejor a fotos claras", detail: "Actualiza imagenes de los productos mas consultados esta semana.", icon: <Image size={18} /> }
];

export default function ControlAssistant() {
  return (
    <section className="control-assistant card">
      <span className="badge ai"><Sparkles size={14} /> Asistente IA de alertas</span>
      <h2>Tu negocio necesita atencion aqui</h2>

      <div className="assistant-list">
        {alerts.map((alert) => (
          <Link className="assistant-card" to={alert.to} key={alert.title}>
            <span>{alert.icon}</span>
            <b>{alert.title}</b>
            <p>{alert.detail}</p>
          </Link>
        ))}
      </div>

      <div className="prediction-panel">
        <div>
          <h2>Predicciones IA</h2>
        </div>

        <div className="prediction-grid">
          {predictions.map((prediction) => (
            <article className="prediction-card" key={prediction.title}>
              <span>{prediction.icon}</span>
              <b>{prediction.title}</b>
              <p>{prediction.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

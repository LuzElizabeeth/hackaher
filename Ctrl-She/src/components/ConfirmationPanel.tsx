import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function ConfirmationPanel({
  title,
  message,
  detailTo,
  detailLabel = "Ver detalle",
  onBack
}: {
  title: string;
  message: string;
  detailTo?: string;
  detailLabel?: string;
  onBack?: () => void;
}) {
  return (
    <section className="confirmation card">
      <CheckCircle2 size={40} />
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      <div className="cta-row">
        <button className="btn outline" onClick={onBack || (() => history.back())}>Volver atras</button>
        <Link className="btn secondary" to="/">Ir al inicio</Link>
        {detailTo && <Link className="btn primary" to={detailTo}>{detailLabel}</Link>}
      </div>
    </section>
  );
}

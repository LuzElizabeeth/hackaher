import { Link } from "react-router-dom";
import { useState } from "react";
import ConfirmationPanel from "../components/ConfirmationPanel";
import QRBlock from "../components/QRBlock";
import { getBusinesses } from "../lib/storage";

export default function QRPage() {
  const business = getBusinesses().find((item) => item.id === "artesanias-lupita") || getBusinesses()[0];
  const url = `${window.location.origin}/tienda/${business.id}`;
  const [message, setMessage] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("El enlace publico de la tienda se copio correctamente.");
    } catch {
      setMessage(`Enlace listo para copiar: ${url}`);
    }
  };
  return (
    <div className="page narrow">
      <section className="page-header">
        <span className="eyebrow">QR de tienda</span>
        <h1>Comparte tu tienda publica</h1>
        <p>Usa el QR en hoteles, ferias, redes sociales y tarjetas impresas.</p>
      </section>
      {message && <ConfirmationPanel title="QR actualizado" message={message} detailTo={`/tienda/${business.id}`} detailLabel="Ver tienda publica" onBack={() => setMessage("")} />}
      <section className="qr-layout">
        <QRBlock url={url} size={230} />
        <article className="print-card card">
          <span className="badge success">Tienda activa</span>
          <h2>{business.name}</h2>
          <p>{business.owner}</p>
          <p>{business.category} · {business.zone}</p>
          <code>{url}</code>
          <div className="cta-row">
            <button className="btn primary" onClick={copy}>Copiar enlace</button>
            <button className="btn secondary" onClick={() => setMessage("Descarga QR simulada para fines de prototipo.")}>Descargar QR</button>
            <button className="btn outline" onClick={() => setMessage("QR listo para compartir en la demo.")}>Compartir</button>
            <Link className="btn primary" to={`/tienda/${business.id}`}>Ver tienda publica</Link>
          </div>
        </article>
      </section>
    </div>
  );
}

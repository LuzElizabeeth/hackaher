import { QRCodeSVG } from "qrcode.react";
import { Download, Share2 } from "lucide-react";

export default function QRBlock({ url, size = 156 }: { url: string; size?: number }) {
  const share = async () => {
    if (navigator.share) await navigator.share({ title: "Ctrl + She", url });
    else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Enlace copiado al portapapeles");
      } catch {
        alert(`Enlace de tienda: ${url}`);
      }
    }
  };
  return (
    <div className="qr-card card">
      <QRCodeSVG value={url} size={size} bgColor="#FFFFFF" fgColor="#3B247A" />
      <p>Comparte tu tienda con clientes, turistas, hoteles, ferias y redes sociales.</p>
      <code>{url}</code>
      <div className="row">
        <button className="btn secondary small" onClick={() => alert("Descarga QR simulada para demo")}>
          <Download size={16} /> Descargar QR
        </button>
        <button className="btn outline small" onClick={share}>
          <Share2 size={16} /> Compartir tienda
        </button>
      </div>
    </div>
  );
}

import { Link, useParams } from "react-router-dom";
import { BadgeCheck, Printer } from "lucide-react";
import { getOrders, money } from "../lib/storage";

export default function ReceiptPage() {
  const { folio } = useParams();
  const order = getOrders().find((entry) => entry.folio === folio);

  if (!order) {
    return (
      <div className="page">
        <div className="empty">No encontramos el comprobante solicitado.</div>
      </div>
    );
  }

  return (
    <div className="page narrow receipt-page">
      <section className="page-header receipt-page-header">
        <span className="eyebrow">Comprobante digital</span>
        <h1>{order.folio}</h1>
        <p>Consulta el resumen de tu compra o reserva y descarga el comprobante generado.</p>
      </section>

      <article className="receipt-sheet card">
        <div className="receipt-topline">
          <span className="brand-mini">Ctrl + She</span>
          <span>Comprobante digital</span>
        </div>

        <div className="receipt-title-row">
          <div>
            <span className="eyebrow">Folio</span>
            <h2>{order.folio}</h2>
          </div>
          <span className="badge success">{order.status}</span>
        </div>

        <div className="receipt-detail-list">
          <p><span>Cliente</span><b>{order.customerName}</b></p>
          <p><span>Negocio</span><b>{order.businessName}</b></p>
          <p><span>Concepto</span><b>{order.itemName}</b></p>
          <p><span>Cantidad / cupos</span><b>{order.quantity}</b></p>
          <p><span>Fecha</span><b>{order.date}</b></p>
          <p><span>Modalidad</span><b>{order.deliveryMode}</b></p>
          <p><span>Método de pago</span><b>{order.paymentMethod}</b></p>
          <p><span>Contacto</span><b>{order.contact}</b></p>
          <p className="receipt-total"><span>Total</span><b>{money(order.amount)}</b></p>
        </div>

        <div className="receipt-footer-note">
          <BadgeCheck size={18} />
          <span>Comprobante generado correctamente para seguimiento del pedido o reserva.</span>
        </div>

        <div className="receipt-actions">
          <button className="btn primary" onClick={() => window.print()}>
            <Printer size={17} /> Descargar / imprimir
          </button>
          <Link className="btn outline" to="/mis-pedidos">
            Volver a mis pedidos
          </Link>
        </div>
      </article>

    </div>
  );
}

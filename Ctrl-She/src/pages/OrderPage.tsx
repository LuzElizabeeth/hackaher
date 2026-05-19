import { Link, useSearchParams } from "react-router-dom";
import { type ReactNode, useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  Landmark,
  MapPin,
  Printer,
  ReceiptText,
  ShieldCheck,
  WalletCards,
  X
} from "lucide-react";
import { getBusinesses, makeFolio, money, saveOrder } from "../lib/storage";
import type { BusinessType, OrderStatus } from "../types";

const statuses: OrderStatus[] = [
  "Solicitado",
  "Confirmado",
  "En proceso",
  "Listo / reservado",
  "Entregado / realizado",
  "Cancelado"
];

type PaymentMethod = "Tarjeta bancaria" | "Transferencia SPEI" | "Billetera digital";

const paymentMethods: Array<{
  value: PaymentMethod;
  title: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    value: "Tarjeta bancaria",
    title: "Tarjeta bancaria",
    description: "Pago en línea con débito o crédito.",
    icon: <CreditCard size={20} />
  },
  {
    value: "Transferencia SPEI",
    title: "Transferencia SPEI",
    description: "Registro de transferencia bancaria en línea.",
    icon: <Landmark size={20} />
  },
  {
    value: "Billetera digital",
    title: "Billetera digital",
    description: "Pago con cuenta digital vinculada.",
    icon: <WalletCards size={20} />
  }
];

const flowCopy: Record<BusinessType, {
  eyebrow: string;
  title: string;
  intro: string;
  quantityLabel: string;
  dateLabel: string;
  modalityLabel: string;
  defaultModality: string;
  confirmLabel: string;
  operationLabel: string;
}> = {
  producto: {
    eyebrow: "Compra en línea",
    title: "Confirma tu compra",
    intro: "Completa los datos del comprador, selecciona la modalidad de entrega y registra el pago en línea.",
    quantityLabel: "Cantidad",
    dateLabel: "Fecha estimada de entrega",
    modalityLabel: "Modalidad de entrega",
    defaultModality: "Entrega en punto acordado",
    confirmLabel: "Confirmar compra",
    operationLabel: "Compra de producto"
  },
  servicio: {
    eyebrow: "Reserva de servicio",
    title: "Confirma tu cita",
    intro: "Agenda el servicio, registra tus datos de contacto y confirma el pago en línea para apartar el horario.",
    quantityLabel: "Personas o servicios",
    dateLabel: "Fecha de cita",
    modalityLabel: "Lugar o modalidad de atención",
    defaultModality: "Atención en estudio o domicilio acordado",
    confirmLabel: "Confirmar cita",
    operationLabel: "Reserva de servicio"
  },
  experiencia: {
    eyebrow: "Reserva turística",
    title: "Confirma tu experiencia",
    intro: "Aparta tus lugares, registra el punto de encuentro y confirma el pago en línea de la experiencia.",
    quantityLabel: "Cupos",
    dateLabel: "Fecha de la experiencia",
    modalityLabel: "Punto de encuentro",
    defaultModality: "Punto de encuentro por confirmar",
    confirmLabel: "Confirmar reserva",
    operationLabel: "Reserva de experiencia"
  }
};

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function OrderPage() {
  const [params] = useSearchParams();
  const business = getBusinesses().find((entry) => entry.id === params.get("business"));
  const item = business?.items.find((entry) => entry.id === params.get("item"));

  const copy = flowCopy[item?.type ?? "producto"];
  const defaultModality = item?.delivery || item?.locationMode || item?.meetingPoint || copy.defaultModality;

  const [name, setName] = useState("Cliente demo");
  const [contact, setContact] = useState("cliente@ctrlshe.demo");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [delivery, setDelivery] = useState(defaultModality);
  const [payment, setPayment] = useState<PaymentMethod>("Tarjeta bancaria");
  const [receipt, setReceipt] = useState(true);
  const [confirmedFolio, setConfirmedFolio] = useState<string | null>(null);
  const [receiptView, setReceiptView] = useState(false);

  const [cardName, setCardName] = useState("María Fernanda López");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [securityCode, setSecurityCode] = useState("123");
  const [bankReference, setBankReference] = useState("CTRL-SHE-2026");

  const amount = useMemo(() => (item?.price || 0) * quantity, [item, quantity]);

  if (!business || !item) {
    return (
      <div className="page">
        <div className="empty">Selecciona un producto, servicio o experiencia desde una tienda.</div>
      </div>
    );
  }

  const confirm = () => {
    const folio = makeFolio();

    saveOrder({
      folio,
      businessId: business.id,
      itemId: item.id,
      itemName: item.name,
      businessName: business.name,
      amount,
      quantity,
      customerName: name || "Cliente demo",
      contact: contact || "cliente@ctrlshe.demo",
      date,
      deliveryMode: delivery,
      paymentMethod: payment,
      needsReceipt: receipt,
      status: "Confirmado",
      createdAt: new Date().toISOString()
    });

    setConfirmedFolio(folio);
    setReceiptView(false);
  };

  const closeModal = () => {
    setConfirmedFolio(null);
    setReceiptView(false);
  };

  return (
    <div className="page narrow payment-page">
      <section className="page-header payment-header">
        <span className="eyebrow">{copy.eyebrow}</span>
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
      </section>

      <div className="order-layout payment-layout">
        <article className="card order-summary payment-summary">
          <span className="badge success">{copy.operationLabel}</span>
          <h2>{item.name}</h2>
          <p>{business.name}</p>

          <div className="payment-total-box">
            <span>Total a pagar</span>
            <strong>{money(amount)}</strong>
          </div>

          <div className="summary-list">
            <p>
              <CalendarCheck size={16} />
              {copy.dateLabel}: <b>{date}</b>
            </p>
            <p>
              <MapPin size={16} />
              {copy.modalityLabel}: <b>{delivery}</b>
            </p>
            <p>
              <ReceiptText size={16} />
              Comprobante: <b>{receipt ? "Solicitado" : "No solicitado"}</b>
            </p>
          </div>
        </article>

        <form
          className="card form payment-form"
          onSubmit={(event) => {
            event.preventDefault();
            confirm();
          }}
        >
          <section className="form-block">
            <div className="form-block-title">
              <span>1</span>
              <div>
                <h2>Datos de la solicitud</h2>
                <p>Información necesaria para confirmar la compra o reserva.</p>
              </div>
            </div>

            <div className="form-grid">
              <label>
                {copy.quantityLabel}
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
                />
              </label>

              <label>
                {copy.dateLabel}
                <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </label>

              <label>
                Nombre del cliente
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre" />
              </label>

              <label>
                Teléfono o correo
                <input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="correo o teléfono" />
              </label>
            </div>

            <label>
              {copy.modalityLabel}
              <input value={delivery} onChange={(event) => setDelivery(event.target.value)} />
            </label>
          </section>

          <section className="form-block">
            <div className="form-block-title">
              <span>2</span>
              <div>
                <h2>Pago en línea</h2>
                <p>Selecciona el medio de pago para completar la solicitud.</p>
              </div>
            </div>

            <div className="payment-method-grid">
              {paymentMethods.map((method) => (
                <button
                  className={payment === method.value ? "payment-method active" : "payment-method"}
                  key={method.value}
                  type="button"
                  onClick={() => setPayment(method.value)}
                >
                  {method.icon}
                  <span>
                    <b>{method.title}</b>
                    <small>{method.description}</small>
                  </span>
                </button>
              ))}
            </div>

            {payment === "Tarjeta bancaria" && (
              <div className="bank-form">
                <label>
                  Nombre en la tarjeta
                  <input value={cardName} onChange={(event) => setCardName(event.target.value)} />
                </label>

                <label>
                  Número de tarjeta
                  <input
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                    maxLength={19}
                  />
                </label>

                <div className="form-grid compact">
                  <label>
                    Vencimiento
                    <input value={expiry} onChange={(event) => setExpiry(formatExpiry(event.target.value))} maxLength={5} />
                  </label>

                  <label>
                    CVV
                    <input
                      inputMode="numeric"
                      value={securityCode}
                      onChange={(event) => setSecurityCode(event.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                    />
                  </label>
                </div>
              </div>
            )}

            {payment === "Transferencia SPEI" && (
              <div className="bank-form transfer-panel">
                <div>
                  <span>Banco receptor</span>
                  <b>Ctrl She Pagos</b>
                </div>
                <div>
                  <span>CLABE</span>
                  <b>6461 8000 0000 2026 01</b>
                </div>
                <label>
                  Referencia bancaria
                  <input value={bankReference} onChange={(event) => setBankReference(event.target.value)} />
                </label>
              </div>
            )}

            {payment === "Billetera digital" && (
              <div className="bank-form wallet-panel">
                <ShieldCheck size={22} />
                <div>
                  <b>Cuenta digital vinculada</b>
                  <p>La confirmación se registra con una cuenta de pago asociada al correo del cliente.</p>
                </div>
              </div>
            )}
          </section>

          <label className="check polished-check">
            <input type="checkbox" checked={receipt} onChange={(event) => setReceipt(event.target.checked)} />
            Generar comprobante digital al finalizar
          </label>

          <button className="btn primary full" type="submit">
            {copy.confirmLabel}
          </button>
        </form>
      </div>

      {confirmedFolio && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirmación de pago">
          <section className="payment-modal card">
            <button className="modal-close" type="button" onClick={closeModal} aria-label="Cerrar ventana">
              <X size={18} />
            </button>

            {!receiptView ? (
              <>
                <div className="modal-status-icon">
                  <CheckCircle2 size={34} />
                </div>

                <span className="eyebrow">Pago aprobado</span>
                <h2>{copy.operationLabel} confirmada</h2>
                <p className="modal-lead">
                  Tu solicitud quedó registrada y el negocio ya puede darle seguimiento desde su panel.
                </p>

                <div className="payment-detail-grid">
                  <div>
                    <span>Folio</span>
                    <b>{confirmedFolio}</b>
                  </div>
                  <div>
                    <span>Negocio</span>
                    <b>{business.name}</b>
                  </div>
                  <div>
                    <span>Concepto</span>
                    <b>{item.name}</b>
                  </div>
                  <div>
                    <span>Monto</span>
                    <b>{money(amount)}</b>
                  </div>
                  <div>
                    <span>Método</span>
                    <b>{payment}</b>
                  </div>
                  <div>
                    <span>Estado</span>
                    <b>Confirmado</b>
                  </div>
                </div>

                <div className="status-track modal-track">
                  {statuses.slice(0, 5).map((status, index) => (
                    <span className={index < 2 ? "done" : ""} key={status}>
                      {status}
                    </span>
                  ))}
                </div>

                <div className="modal-actions">
                  <button className="btn primary" type="button" onClick={() => setReceiptView(true)}>
                    Generar comprobante
                  </button>
                  <Link className="btn outline" to="/mis-pedidos">
                    Ver mis pedidos
                  </Link>
                  <Link className="btn secondary" to="/explorar">
                    Volver a explorar
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="receipt-sheet compact-receipt">
                  <div className="receipt-topline">
                    <span className="brand-mini">Ctrl + She</span>
                    <span>Comprobante digital</span>
                  </div>

                  <div className="receipt-title-row">
                    <div>
                      <span className="eyebrow">Folio</span>
                      <h2>{confirmedFolio}</h2>
                    </div>
                    <span className="badge success">Confirmado</span>
                  </div>

                  <div className="receipt-detail-list">
                    <p><span>Cliente</span><b>{name || "Cliente demo"}</b></p>
                    <p><span>Negocio</span><b>{business.name}</b></p>
                    <p><span>Concepto</span><b>{item.name}</b></p>
                    <p><span>Fecha</span><b>{date}</b></p>
                    <p><span>{copy.modalityLabel}</span><b>{delivery}</b></p>
                    <p><span>Método de pago</span><b>{payment}</b></p>
                    <p><span>Total</span><b>{money(amount)}</b></p>
                  </div>

                  <div className="receipt-footer-note">
                    <BadgeCheck size={18} />
                    <span>Comprobante generado correctamente para seguimiento del pedido o reserva.</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn primary" type="button" onClick={() => window.print()}>
                    <Printer size={17} /> Descargar / imprimir
                  </button>
                  <button className="btn outline" type="button" onClick={() => setReceiptView(false)}>
                    Volver a confirmación
                  </button>
                  <Link className="btn secondary" to="/mis-pedidos">
                    Ver mis pedidos
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
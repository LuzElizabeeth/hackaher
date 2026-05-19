import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Mail,
  PackageCheck,
  Search,
  ShoppingBag,
  UserRound,
  X
} from "lucide-react";
import ConfirmationPanel from "../components/ConfirmationPanel";
import { getBusinesses, getOrders, money, updateOrderStatus } from "../lib/storage";
import type { BusinessType, Order, OrderStatus } from "../types";
import "../styles/seller-orders.css";

const actions: Array<[OrderStatus, string]> = [
  ["Confirmado", "Confirmar"],
  ["En proceso", "En proceso"],
  ["Listo / reservado", "Listo / reservado"],
  ["Entregado / realizado", "Entregado / realizado"],
  ["Cancelado", "Cancelar"]
];

const statusFilters: Array<OrderStatus | "Todos"> = [
  "Todos",
  "Solicitado",
  "Confirmado",
  "En proceso",
  "Listo / reservado",
  "Entregado / realizado",
  "Cancelado"
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatDate(value: string) {
  if (!value) return "Sin fecha";

  try {
    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(`${value}T12:00:00`));
  } catch {
    return value;
  }
}

function getTypeLabel(type?: BusinessType) {
  if (type === "servicio") return "Servicio";
  if (type === "experiencia") return "Experiencia";
  return "Producto";
}

function getStatusClass(status: OrderStatus) {
  if (status === "Confirmado") return "confirmed";
  if (status === "En proceso") return "process";
  if (status === "Listo / reservado") return "ready";
  if (status === "Entregado / realizado") return "done";
  if (status === "Cancelado") return "cancelled";
  return "pending";
}

function getOrderVisual(order: Order) {
  const business = getBusinesses().find((item) => item.id === order.businessId);
  const catalogItem = business?.items.find((item) => item.id === order.itemId);

  return {
    image: catalogItem?.image,
    type: catalogItem?.type,
    category: business?.category || "Negocio local",
    owner: business?.owner || "Emprendedora",
    zone: business?.zone || "Zona no registrada"
  };
}

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "Todos">("Todos");
  const [confirmation, setConfirmation] = useState<{ folio: string; status: OrderStatus } | null>(null);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const term = normalize(query.trim());

    return sortedOrders.filter((order) => {
      const matchesStatus = statusFilter === "Todos" || order.status === statusFilter;

      const matchesQuery =
        !term ||
        normalize(order.folio).includes(term) ||
        normalize(order.itemName).includes(term) ||
        normalize(order.businessName).includes(term) ||
        normalize(order.customerName).includes(term) ||
        normalize(order.paymentMethod).includes(term) ||
        normalize(order.deliveryMode).includes(term);

      return matchesStatus && matchesQuery;
    });
  }, [query, sortedOrders, statusFilter]);

  const confirmedCount = orders.filter((order) => order.status === "Confirmado").length;

  const activeCount = orders.filter((order) =>
    ["Solicitado", "Confirmado", "En proceso", "Listo / reservado"].includes(order.status)
  ).length;

  const doneCount = orders.filter((order) => order.status === "Entregado / realizado").length;
  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);

  const changeStatus = (folio: string, status: OrderStatus) => {
    const updatedOrders = updateOrderStatus(folio, status);
    setOrders(updatedOrders);
    setConfirmation({ folio, status });
  };

  return (
    <div className="page seller-orders-page">
      <section className="seller-orders-hero">
        <div>
          <span className="eyebrow">Panel de emprendedora</span>
          <h1>Pedidos y reservas</h1>
          <p>
            Gestiona compras, servicios y experiencias desde una vista más clara. Revisa los datos del cliente,
            confirma estados y accede al comprobante sin salir del flujo de atención.
          </p>
        </div>

        <aside className="seller-orders-hero-card">
          <span>Ingresos registrados</span>
          <strong>{money(totalAmount)}</strong>
          <small>{orders.length} pedido(s) en seguimiento</small>
        </aside>
      </section>

      {confirmation && (
        <div
          className="seller-order-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Estado de pedido actualizado"
        >
          <section className="seller-order-modal">
            <button
              className="seller-order-modal-close"
              type="button"
              onClick={() => setConfirmation(null)}
              aria-label="Cerrar ventana"
            >
              <X size={18} />
            </button>

            <div className="seller-order-modal-icon">
              <CheckCircle2 size={34} />
            </div>

            <span className="eyebrow">Actualización guardada</span>

            <h2>Estado del pedido actualizado</h2>

            <p>
              El pedido <b>{confirmation.folio}</b> ahora se encuentra en estado:
            </p>

            <span className={`seller-order-status ${getStatusClass(confirmation.status)}`}>
              {confirmation.status}
            </span>

            <div className="seller-order-modal-actions">
              <Link
                className="btn primary"
                to={`/comprobante/${confirmation.folio}`}
              >
                Ver comprobante
              </Link>

              <button
                className="btn outline"
                type="button"
                onClick={() => setConfirmation(null)}
              >
                Seguir gestionando pedidos
              </button>
            </div>
          </section>
        </div>
      )}

      <section className="seller-orders-summary-grid">
        <article className="seller-orders-summary-card">
          <span>
            <ShoppingBag size={22} />
          </span>
          <div>
            <small>Total de pedidos</small>
            <strong>{orders.length}</strong>
          </div>
        </article>

        <article className="seller-orders-summary-card">
          <span>
            <ClipboardList size={22} />
          </span>
          <div>
            <small>En seguimiento</small>
            <strong>{activeCount}</strong>
          </div>
        </article>

        <article className="seller-orders-summary-card">
          <span>
            <CheckCircle2 size={22} />
          </span>
          <div>
            <small>Confirmados</small>
            <strong>{confirmedCount}</strong>
          </div>
        </article>

        <article className="seller-orders-summary-card">
          <span>
            <PackageCheck size={22} />
          </span>
          <div>
            <small>Finalizados</small>
            <strong>{doneCount}</strong>
          </div>
        </article>
      </section>

      <section className="seller-orders-toolbar">
        <label className="seller-orders-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por folio, cliente, negocio, producto o pago"
            aria-label="Buscar pedidos"
          />
        </label>

        <select
          className="seller-orders-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as OrderStatus | "Todos")}
          aria-label="Filtrar pedidos por estado"
        >
          {statusFilters.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </section>

      <section className="seller-orders-board">
        {filteredOrders.length === 0 ? (
          <div className="seller-orders-empty">
            <ShoppingBag size={38} />
            <h2>No hay pedidos para mostrar</h2>
            <p>
              Cuando una clienta confirme una compra, servicio o experiencia, aparecerá aquí con sus datos de seguimiento.
            </p>
            <Link className="btn primary" to="/explorar">
              Crear pedido de prueba
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const visual = getOrderVisual(order);

            return (
              <article className="seller-order-card" key={order.folio}>
                <div className="seller-order-main">
                  <div className="seller-order-image">
                    {visual.image ? (
                      <img src={visual.image} alt={order.itemName} />
                    ) : (
                      order.itemName.charAt(0)
                    )}
                  </div>

                  <div className="seller-order-title-block">
                    <div className="seller-order-meta-row">
                      <span className="seller-order-type">
                        {getTypeLabel(visual.type)}
                      </span>
                      <span className={`seller-order-status ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <h2>{order.itemName}</h2>
                    <p>
                      {order.businessName} · {visual.category}
                    </p>
                    <span className="seller-order-folio">
                      Folio {order.folio}
                    </span>
                  </div>
                </div>

                <div className="seller-order-details-grid">
                  <div>
                    <UserRound size={16} />
                    <span>Cliente</span>
                    <b>{order.customerName}</b>
                  </div>

                  <div>
                    <Mail size={16} />
                    <span>Contacto</span>
                    <b>{order.contact}</b>
                  </div>

                  <div>
                    <CalendarDays size={16} />
                    <span>Fecha</span>
                    <b>{formatDate(order.date)}</b>
                  </div>

                  <div>
                    <CreditCard size={16} />
                    <span>Pago</span>
                    <b>{order.paymentMethod}</b>
                  </div>
                </div>

                <div className="seller-order-extra-grid">
                  <p>
                    <b>Modalidad:</b> {order.deliveryMode}
                  </p>
                  <p>
                    <b>Cantidad / cupos:</b> {order.quantity}
                  </p>
                  <p>
                    <b>Zona:</b> {visual.zone}
                  </p>
                  <p className="seller-order-amount">
                    <b>Total:</b> {money(order.amount)}
                  </p>
                </div>

                <div className="seller-order-actions-panel">
                  <div>
                    <span className="seller-order-action-label">
                      Actualizar estado
                    </span>

                    <div className="seller-order-actions">
                      {actions.map(([status, label]) => (
                        <button
                          className={order.status === status ? "btn small primary" : "btn small outline"}
                          key={status}
                          type="button"
                          disabled={order.status === status}
                          onClick={() => changeStatus(order.folio, status)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Link className="btn small secondary" to={`/comprobante/${order.folio}`}>
                    Ver comprobante
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import { CalendarDays, CreditCard, PackageCheck, ReceiptText, Search, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { getBusinesses, getOrders, money } from "../lib/storage";
import "../styles/orders.css";

type StoredOrder = ReturnType<typeof getOrders>[number];

function getOrderVisual(order: StoredOrder) {
  const business = getBusinesses().find((item) => item.id === order.businessId);
  const catalogItem = business?.items.find((item) => item.id === order.itemId);

  return {
    image: catalogItem?.image,
    type: catalogItem?.type || "producto",
    businessCategory: business?.category || "Negocio local"
  };
}

function getTypeLabel(type: string) {
  if (type === "servicio") return "Servicio";
  if (type === "experiencia") return "Experiencia";
  return "Producto";
}

function getStatusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("confirmado")) return "confirmed";
  if (normalized.includes("entregado") || normalized.includes("realizado")) return "done";
  if (normalized.includes("solicitado") || normalized.includes("pendiente")) return "pending";

  return "";
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

export default function MyOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const orders = useMemo(() => {
    return getOrders().sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, []);

  const statuses = useMemo(() => {
    return ["Todos", ...Array.from(new Set(orders.map((order) => order.status)))];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "Todos" || order.status === statusFilter;

      const matchesSearch =
        !term ||
        order.folio.toLowerCase().includes(term) ||
        order.itemName.toLowerCase().includes(term) ||
        order.businessName.toLowerCase().includes(term) ||
        order.paymentMethod.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const confirmedCount = orders.filter((order) =>
    order.status.toLowerCase().includes("confirmado")
  ).length;

  const receiptCount = orders.filter((order) => order.needsReceipt).length;

  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="page orders-page-v2">
      <section className="orders-hero-v2">
        <span className="eyebrow">Área del cliente</span>
        <h1>Mis pedidos</h1>
        <p>
          Consulta tus compras, servicios reservados y experiencias turísticas desde una vista
          más clara, con imagen, estado, método de pago y acceso al comprobante.
        </p>
      </section>

      <section className="orders-summary-grid">
        <article className="orders-summary-card">
          <span className="orders-summary-icon">
            <ShoppingBag size={22} />
          </span>
          <div>
            <span>Total de pedidos</span>
            <strong>{orders.length}</strong>
          </div>
        </article>

        <article className="orders-summary-card">
          <span className="orders-summary-icon">
            <PackageCheck size={22} />
          </span>
          <div>
            <span>Confirmados</span>
            <strong>{confirmedCount}</strong>
          </div>
        </article>

        <article className="orders-summary-card">
          <span className="orders-summary-icon">
            <ReceiptText size={22} />
          </span>
          <div>
            <span>Con comprobante</span>
            <strong>{receiptCount}</strong>
          </div>
        </article>

        <article className="orders-summary-card">
          <span className="orders-summary-icon">
            <CreditCard size={22} />
          </span>
          <div>
            <span>Monto acumulado</span>
            <strong>{money(totalAmount)}</strong>
          </div>
        </article>
      </section>

      <section className="orders-toolbar">
        <div className="orders-search-wrap">
          <input
            className="orders-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por folio, negocio, producto o método de pago"
            aria-label="Buscar pedidos"
          />
        </div>

        <select
          className="orders-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filtrar por estado"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </section>

      <section className="orders-table-card">
        {filteredOrders.length === 0 ? (
          <div className="order-empty-state">
            <Search size={34} />
            <h2>No encontramos pedidos</h2>
            <p>
              Intenta cambiar el filtro o explora negocios para registrar una compra,
              servicio o experiencia.
            </p>
            <Link className="btn primary" to="/explorar">
              Explorar negocios
            </Link>
          </div>
        ) : (
          <div className="orders-table-scroll">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Fecha</th>
                  <th>Entrega / cita</th>
                  <th>Pago</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const visual = getOrderVisual(order);

                  return (
                    <tr key={order.folio}>
                      <td>
                        <div className="order-product-cell">
                          <div className="order-product-image">
                            {visual.image ? (
                              <img src={visual.image} alt={order.itemName} />
                            ) : (
                              order.itemName.charAt(0)
                            )}
                          </div>

                          <div className="order-product-info">
                            <span className="order-type-badge">
                              {getTypeLabel(visual.type)}
                            </span>
                            <strong>{order.itemName}</strong>
                            <span>{order.businessName}</span>
                            <span>Folio: {order.folio}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="order-detail-stack">
                          <b>{formatDate(order.date)}</b>
                          <span>
                            <CalendarDays size={14} /> {order.quantity} unidad(es)
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="order-detail-stack">
                          <b>{order.deliveryMode}</b>
                          <span>{visual.businessCategory}</span>
                        </div>
                      </td>

                      <td>
                        <div className="order-detail-stack">
                          <b>{order.paymentMethod}</b>
                          <span>{order.needsReceipt ? "Comprobante solicitado" : "Sin comprobante"}</span>
                        </div>
                      </td>

                      <td>
                        <span className={`order-status-badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>

                      <td>
                        <span className="order-amount">
                          {money(order.amount)}
                        </span>
                      </td>

                      <td>
                        <div className="order-actions-v2">
                          <Link className="btn small outline" to={`/comprobante/${order.folio}`}>
                            Ver comprobante
                          </Link>
                          <Link className="btn small primary" to={`/tienda/${order.businessId}`}>
                            Ver tienda
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
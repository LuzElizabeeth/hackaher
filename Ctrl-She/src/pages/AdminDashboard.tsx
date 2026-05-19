import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Building2,
  ClipboardCheck,
  FolderTree,
  MapPin,
  ShoppingBag,
  Star,
  Store,
  Users
} from "lucide-react";
import { getBusinesses, getOrders, money } from "../lib/storage";
import "../styles/admin.css";

type AdminTab =
  | "resumen"
  | "emprendedoras"
  | "validaciones"
  | "reportes"
  | "categorias"
  | "destacados";

type LocalReport = {
  id: string;
  title: string;
  description: string;
  status: "Pendiente" | "En revisión" | "Resuelto";
  type: "Perfil" | "Pedido" | "Reseña" | "Categoría";
};

function readLocalArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getInitialTab(pathname: string): AdminTab {
  if (pathname.includes("validaciones")) return "validaciones";
  if (pathname.includes("reportes")) return "reportes";
  if (pathname.includes("negocios")) return "emprendedoras";
  if (pathname.includes("destacados")) return "destacados";
  if (pathname.includes("metricas")) return "resumen";
  if (pathname.includes("categorias")) return "emprendedoras";
  return "resumen";
}

function getBusinessTypeLabel(type: string) {
  if (type === "servicio") return "Servicio";
  if (type === "experiencia") return "Experiencia";
  return "Producto";
}

function normalizeStatus(status: string) {
  const value = status.toLowerCase();

  if (
    value.includes("verificada") ||
    value.includes("validado") ||
    value.includes("activo") ||
    value.includes("confirmado") ||
    value.includes("resuelto")
  ) {
    return "success";
  }

  if (
    value.includes("pendiente") ||
    value.includes("revisión") ||
    value.includes("solicitado")
  ) {
    return "pending";
  }

  return "info";
}

function getPercent(value: number, total: number) {
  if (!total) return 0;
  return Math.max(8, Math.round((value / total) * 100));
}

export default function AdminDashboard() {
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<AdminTab>(() =>
    getInitialTab(location.pathname)
  );

  useEffect(() => {
  setActiveTab(getInitialTab(location.pathname));
  }, [location.pathname]);
  
  const [validatedIds, setValidatedIds] = useState<string[]>(() =>
    readLocalArray<string>("ctrl-she-admin-validated")
  );

  const [featuredIds, setFeaturedIds] = useState<string[]>(() =>
    readLocalArray<string>("ctrl-she-admin-featured")
  );

  const [reports, setReports] = useState<LocalReport[]>(() => {
    const stored = readLocalArray<LocalReport>("ctrl-she-admin-reports");

    if (stored.length) return stored;

    return [
      {
        id: "rep-001",
        title: "Perfil pendiente de validación",
        description: "Negocio con datos incompletos en contacto, zona o descripción.",
        status: "Pendiente",
        type: "Perfil"
      },
      {
        id: "rep-002",
        title: "Revisión de categoría",
        description: "Un negocio aparece en una categoría poco relacionada con su catálogo.",
        status: "En revisión",
        type: "Categoría"
      },
      {
        id: "rep-003",
        title: "Seguimiento de pedido",
        description: "Cliente solicita revisar el estado de una compra o reserva.",
        status: "Pendiente",
        type: "Pedido"
      }
    ];
  });

  const businesses = useMemo(() => getBusinesses(), []);
  const orders = useMemo(() => getOrders(), []);

  const metrics = useMemo(() => {
    const activeBusinesses = businesses.filter((business) =>
      business.status.toLowerCase().includes("verificada") ||
      business.status.toLowerCase().includes("activo")
    );

    const reservations = orders.filter((order) => {
      const business = businesses.find((item) => item.id === order.businessId);
      return business?.type === "servicio" || business?.type === "experiencia";
    });

    const pendingValidations = businesses.filter(
      (business) => !validatedIds.includes(business.id)
    ).length;

    const pendingReports = reports.filter(
      (report) => report.status !== "Resuelto"
    ).length;

    const categoryCount = businesses.reduce<Record<string, number>>(
      (acc, business) => {
        acc[business.category] = (acc[business.category] || 0) + 1;
        return acc;
      },
      {}
    );

    const zoneCount = businesses.reduce<Record<string, number>>(
      (acc, business) => {
        acc[business.zone] = (acc[business.zone] || 0) + 1;
        return acc;
      },
      {}
    );

    const topCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);
    const topZones = Object.entries(zoneCount).sort((a, b) => b[1] - a[1]);

    return {
      entrepreneurs: businesses.length,
      activeBusinesses: activeBusinesses.length,
      orders: orders.length,
      reservations: reservations.length,
      pendingValidations,
      pendingReports,
      topCategories,
      topZones,
      totalSales: orders.reduce((sum, order) => sum + order.amount, 0)
    };
  }, [businesses, orders, reports, validatedIds]);

  const categories = useMemo(() => {
    const grouped = businesses.reduce<
      Record<string, { count: number; items: number; orders: number }>
    >((acc, business) => {
      if (!acc[business.category]) {
        acc[business.category] = { count: 0, items: 0, orders: 0 };
      }

      acc[business.category].count += 1;
      acc[business.category].items += business.items.length;
      acc[business.category].orders += orders.filter(
        (order) => order.businessId === business.id
      ).length;

      return acc;
    }, {});

    return Object.entries(grouped).map(([name, data]) => ({ name, ...data }));
  }, [businesses, orders]);

  const saveValidated = (ids: string[]) => {
    setValidatedIds(ids);
    localStorage.setItem("ctrl-she-admin-validated", JSON.stringify(ids));
  };

  const saveFeatured = (ids: string[]) => {
    setFeaturedIds(ids);
    localStorage.setItem("ctrl-she-admin-featured", JSON.stringify(ids));
  };

  const validateProfile = (businessId: string) => {
    if (validatedIds.includes(businessId)) return;
    saveValidated([...validatedIds, businessId]);
  };

  const toggleFeatured = (businessId: string) => {
    if (featuredIds.includes(businessId)) {
      saveFeatured(featuredIds.filter((id) => id !== businessId));
      return;
    }

    saveFeatured([...featuredIds, businessId]);
  };

  const updateReport = (reportId: string, status: LocalReport["status"]) => {
    const updated = reports.map((report) =>
      report.id === reportId ? { ...report, status } : report
    );

    setReports(updated);
    localStorage.setItem("ctrl-she-admin-reports", JSON.stringify(updated));
  };

  return (
    <div className="page admin-dashboard-v2">
      <section className="admin-hero-v2">
        <div>
          <span className="eyebrow">Panel de administrador</span>
          <h1>Gestión general de Ctrl + She</h1>
          <p>
            Administra perfiles de emprendedoras, revisa validaciones, reportes,
            categorías, negocios destacados y métricas generales de operación.
          </p>
        </div>

        <aside className="admin-hero-card">
          <span>Actividad registrada</span>
          <strong>{metrics.orders}</strong>
          <span>pedidos y reservas generadas</span>
        </aside>
      </section>

      <nav className="admin-tabs-v2" aria-label="Secciones del panel administrador">
        {[
          ["resumen", "Resumen"],
          ["emprendedoras", "Negocios"],
          ["validaciones", "Validaciones"],
          ["reportes", "Reportes"],
          ["destacados", "Destacados"]
        ].map(([value, label]) => (
          <button
            key={value}
            className={
              activeTab === value ? "admin-tab-button active" : "admin-tab-button"
            }
            type="button"
            onClick={() => setActiveTab(value as AdminTab)}
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "resumen" && (
        <>
          <section className="admin-metrics-grid">
            <article className="admin-metric-card">
              <Users />
              <span>Emprendedoras registradas</span>
              <strong>{metrics.entrepreneurs}</strong>
            </article>

            <article className="admin-metric-card">
              <Store />
              <span>Negocios activos</span>
              <strong>{metrics.activeBusinesses}</strong>
            </article>

            <article className="admin-metric-card">
              <ShoppingBag />
              <span>Pedidos generados</span>
              <strong>{metrics.orders}</strong>
            </article>

            <article className="admin-metric-card">
              <ClipboardCheck />
              <span>Reservas realizadas</span>
              <strong>{metrics.reservations}</strong>
            </article>

            <article className="admin-metric-card">
              <BadgeCheck />
              <span>Validaciones pendientes</span>
              <strong>{metrics.pendingValidations}</strong>
            </article>

            <article className="admin-metric-card">
              <AlertTriangle />
              <span>Reportes abiertos</span>
              <strong>{metrics.pendingReports}</strong>
            </article>
          </section>

          <section className="admin-section-v2">
            <div className="admin-section-header">
              <div>
                <h2>Acciones del administrador</h2>
                <p>Accesos rápidos a las tareas principales del panel.</p>
              </div>
            </div>

            <div className="admin-mini-grid">
              <button
                className="admin-mini-card admin-action-card"
                type="button"
                onClick={() => setActiveTab("validaciones")}
              >
                <BadgeCheck />
                <h3>Validar perfiles</h3>
                <p>Revisar datos de negocios, responsable, categoría, zona y catálogo.</p>
              </button>

              <button
                className="admin-mini-card admin-action-card"
                type="button"
                onClick={() => setActiveTab("reportes")}
              >
                <AlertTriangle />
                <h3>Revisar reportes</h3>
                <p>Dar seguimiento a incidencias de perfiles, pedidos, reseñas o categorías.</p>
              </button>

              <button
                className="admin-mini-card admin-action-card"
                type="button"
                onClick={() => setActiveTab("emprendedoras")}
              >
                <FolderTree />
                <h3>Revisar clasificación</h3>
                <p>Consultar categorías y zonas como apoyo para organizar mejor los negocios.</p>
              </button>

              <button
                className="admin-mini-card admin-action-card"
                type="button"
                onClick={() => setActiveTab("destacados")}
              >
                <Star />
                <h3>Gestionar destacados</h3>
                <p>Seleccionar negocios recomendados para mejorar su visibilidad.</p>
              </button>
            </div>
          </section>

          <section className="admin-section-v2">
            <div className="admin-section-header">
              <div>
                <h2>Métricas generales</h2>
                <p>Resumen útil de operación sin datos innecesarios para el admin.</p>
              </div>
            </div>

            <div className="admin-mini-grid">
              <article className="admin-mini-card">
                <BarChart3 />
                <h3>Ventas registradas</h3>
                <p>Monto acumulado en compras, servicios y experiencias.</p>
                <strong>{money(metrics.totalSales)}</strong>
              </article>

              <article className="admin-mini-card">
                <FolderTree />
                <h3>Categoría más usada</h3>
                <p>{metrics.topCategories[0]?.[0] || "Sin datos"}</p>
                <div className="admin-progress">
                  <span
                    style={{
                      width: `${getPercent(
                        metrics.topCategories[0]?.[1] || 0,
                        businesses.length
                      )}%`
                    }}
                  />
                </div>
              </article>

              <article className="admin-mini-card">
                <MapPin />
                <h3>Zona con mayor actividad</h3>
                <p>{metrics.topZones[0]?.[0] || "Sin datos"}</p>
                <div className="admin-progress">
                  <span
                    style={{
                      width: `${getPercent(
                        metrics.topZones[0]?.[1] || 0,
                        businesses.length
                      )}%`
                    }}
                  />
                </div>
              </article>
            </div>
          </section>
        </>
      )}

      {activeTab === "emprendedoras" && (
        <section className="admin-section-v2">
          <div className="admin-section-header">
            <div>
              <h2>Emprendedoras registradas</h2>
              <p>Listado general de negocios disponibles en la plataforma.</p>
            </div>
          </div>

          <div className="admin-panel-card admin-table-wrap">
            <table className="admin-table-v2">
              <thead>
                <tr>
                  <th>Negocio</th>
                  <th>Responsable</th>
                  <th>Categoría</th>
                  <th>Zona</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Pedidos</th>
                </tr>
              </thead>

              <tbody>
                {businesses.map((business) => {
                  const orderCount = orders.filter(
                    (order) => order.businessId === business.id
                  ).length;

                  return (
                    <tr key={business.id}>
                      <td>
                        <div className="admin-business-cell">
                          <div className="admin-business-image">
                            {business.image ? (
                              <img src={business.image} alt={business.name} />
                            ) : (
                              business.name.charAt(0)
                            )}
                          </div>

                          <div className="admin-business-info">
                            <strong>{business.name}</strong>
                            <span>{business.description}</span>
                          </div>
                        </div>
                      </td>

                      <td>{business.owner}</td>
                      <td>{business.category}</td>
                      <td>{business.zone}</td>
                      <td>
                        <span className="admin-badge info">
                          {getBusinessTypeLabel(business.type)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-badge ${normalizeStatus(
                            validatedIds.includes(business.id)
                              ? "Validado"
                              : business.status
                          )}`}
                        >
                          {validatedIds.includes(business.id)
                            ? "Validado"
                            : business.status}
                        </span>
                      </td>
                      <td>{orderCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "validaciones" && (
        <section className="admin-section-v2">
          <div className="admin-section-header">
            <div>
              <h2>Validar perfiles</h2>
              <p>Marca como revisados los perfiles de negocios registrados.</p>
            </div>
          </div>

          <div className="admin-panel-card admin-table-wrap">
            <table className="admin-table-v2">
              <thead>
                <tr>
                  <th>Perfil</th>
                  <th>Datos revisados</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {businesses.map((business) => {
                  const isValidated = validatedIds.includes(business.id);

                  return (
                    <tr key={business.id}>
                      <td>
                        <div className="admin-business-cell">
                          <div className="admin-business-image">
                            {business.image ? (
                              <img src={business.image} alt={business.name} />
                            ) : (
                              business.name.charAt(0)
                            )}
                          </div>

                          <div className="admin-business-info">
                            <strong>{business.name}</strong>
                            <span>
                              {business.owner} · {business.zone}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>Contacto, categoría, zona, catálogo y descripción.</td>

                      <td>
                        <span
                          className={isValidated ? "admin-badge success" : "admin-badge pending"}
                        >
                          {isValidated ? "Validado" : "Pendiente"}
                        </span>
                      </td>

                      <td>
                        <div className="admin-actions">
                          <button
                            className="btn small primary"
                            type="button"
                            disabled={isValidated}
                            onClick={() => validateProfile(business.id)}
                          >
                            <BadgeCheck size={15} />
                            Validar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "reportes" && (
        <section className="admin-section-v2">
          <div className="admin-section-header">
            <div>
              <h2>Reportes</h2>
              <p>Seguimiento simple de incidencias o revisiones internas.</p>
            </div>
          </div>

          <div className="admin-report-list">
            {reports.map((report) => (
              <article className="admin-report-item" key={report.id}>
                <div>
                  <span className="admin-badge info">
                    <AlertTriangle size={14} />
                    {report.type}
                  </span>
                  <h3>{report.title}</h3>
                  <p>{report.description}</p>
                </div>

                <div className="admin-actions">
                  <span className={`admin-badge ${normalizeStatus(report.status)}`}>
                    {report.status}
                  </span>

                  <button
                    className="btn small outline"
                    type="button"
                    onClick={() => updateReport(report.id, "En revisión")}
                  >
                    Revisar
                  </button>

                  <button
                    className="btn small primary"
                    type="button"
                    onClick={() => updateReport(report.id, "Resuelto")}
                  >
                    Resolver
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "categorias" && (
        <section className="admin-section-v2">
          <div className="admin-section-header">
            <div>
              <h2>Administrar categorías</h2>
              <p>Consulta categorías usadas por los negocios registrados.</p>
            </div>
          </div>

          <div className="admin-mini-grid">
            {categories.map((category) => (
              <article className="admin-mini-card" key={category.name}>
                <FolderTree />
                <h3>{category.name}</h3>
                <p>
                  {category.count} negocio(s) · {category.items} producto(s) o servicio(s)
                </p>
                <p>{category.orders} pedido(s) asociados</p>
                <div className="admin-progress">
                  <span
                    style={{
                      width: `${getPercent(category.count, businesses.length)}%`
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "destacados" && (
        <section className="admin-section-v2">
          <div className="admin-section-header">
            <div>
              <h2>Negocios destacados</h2>
              <p>Selecciona negocios recomendados para mejorar su visibilidad.</p>
            </div>
          </div>

          <div className="admin-mini-grid">
            {businesses.map((business) => {
              const isFeatured = featuredIds.includes(business.id);

              return (
                <article className="admin-mini-card" key={business.id}>
                  <Star />
                  <h3>{business.name}</h3>
                  <p>
                    {business.category} · {business.zone}
                  </p>
                  <span className={isFeatured ? "admin-badge success" : "admin-badge info"}>
                    {isFeatured ? "Destacado" : "Disponible"}
                  </span>
                  <button
                    className={isFeatured ? "btn small outline" : "btn small primary"}
                    type="button"
                    onClick={() => toggleFeatured(business.id)}
                  >
                    {isFeatured ? "Quitar destacado" : "Marcar destacado"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
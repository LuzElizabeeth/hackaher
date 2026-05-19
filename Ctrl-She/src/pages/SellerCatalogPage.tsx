import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Image,
  Package,
  PackagePlus,
  Save,
  Search,
  Trash2,
  X
} from "lucide-react";
import { getBusinesses, money, saveBusinesses } from "../lib/storage";
import type { BusinessType, CatalogItem } from "../types";
import "../styles/seller-catalog.css";

type CatalogForm = {
  type: BusinessType;
  name: string;
  price: string;
  description: string;
  image: string;
  stock: string;
  delivery: string;
  duration: string;
  schedule: string;
  locationMode: string;
  capacity: string;
  language: string;
  meetingPoint: string;
};

type FormMode = "create" | "edit";

function createEmptyForm(type: BusinessType): CatalogForm {
  return {
    type,
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
    delivery: "Entrega en punto acordado",
    duration: "",
    schedule: "",
    locationMode: "Atención en estudio o domicilio acordado",
    capacity: "",
    language: "Español",
    meetingPoint: "Punto de encuentro por confirmar"
  };
}

function getTypeLabel(type: BusinessType) {
  if (type === "servicio") return "Servicio personal";
  if (type === "experiencia") return "Experiencia turística";
  return "Producto físico";
}

function getTypeDescription(type: BusinessType) {
  if (type === "servicio") {
    return "Administra servicios con duración, horarios y modalidad de atención.";
  }

  if (type === "experiencia") {
    return "Administra experiencias con cupo, duración, idioma y punto de encuentro.";
  }

  return "Administra productos con precio, stock, imagen y modalidad de entrega.";
}

function parseSchedule(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formFromItem(item: CatalogItem): CatalogForm {
  return {
    type: item.type,
    name: item.name,
    price: String(item.price),
    description: item.description,
    image: item.image || "",
    stock: item.stock !== undefined ? String(item.stock) : "",
    delivery: item.delivery || "Entrega en punto acordado",
    duration: item.duration || "",
    schedule: item.schedule?.join(", ") || "",
    locationMode: item.locationMode || "Atención en estudio o domicilio acordado",
    capacity: item.capacity !== undefined ? String(item.capacity) : "",
    language: item.language || "Español",
    meetingPoint: item.meetingPoint || "Punto de encuentro por confirmar"
  };
}

export default function SellerCatalogPage() {
  const [businesses, setBusinesses] = useState(getBusinesses());
  const business = businesses.find((item) => item.id === "artesanias-lupita") || businesses[0];

  const allowedType = business.type;
  const [query, setQuery] = useState("");
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CatalogForm>(() => createEmptyForm(allowedType));
  const [formError, setFormError] = useState("");
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string } | null>(null);

  const catalogItems = useMemo(() => {
    return business.items.filter((item) => item.type === allowedType);
  }, [business.items, allowedType]);

  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return catalogItems;

    return catalogItems.filter((item) =>
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
  }, [catalogItems, query]);

  const previewImage = form.image.trim() || business.image;
  const previewPrice = Number(form.price || 0);

  const openCreateModal = () => {
    setFormMode("create");
    setEditingId(null);
    setForm(createEmptyForm(allowedType));
    setFormError("");
  };

  const openEditModal = (item: CatalogItem) => {
    setFormMode("edit");
    setEditingId(item.id);
    setForm(formFromItem(item));
    setFormError("");
  };

  const closeFormModal = () => {
    setFormMode(null);
    setEditingId(null);
    setForm(createEmptyForm(allowedType));
    setFormError("");
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Escribe el nombre del elemento.";
    if (!form.description.trim()) return "Agrega una descripción.";
    if (!form.price || Number(form.price) <= 0) return "Ingresa un precio válido.";

    if (allowedType === "producto") {
      if (form.stock === "" || Number(form.stock) < 0) {
        return "Ingresa el stock disponible.";
      }

      if (!form.delivery.trim()) {
        return "Indica la modalidad de entrega.";
      }
    }

    if (allowedType === "servicio") {
      if (!form.duration.trim()) return "Indica la duración del servicio.";
      if (!form.locationMode.trim()) return "Indica el lugar o modalidad de atención.";
    }

    if (allowedType === "experiencia") {
      if (!form.capacity || Number(form.capacity) <= 0) return "Indica el cupo máximo.";
      if (!form.duration.trim()) return "Indica la duración de la experiencia.";
      if (!form.meetingPoint.trim()) return "Indica el punto de encuentro.";
    }

    return "";
  };

  const buildCatalogItem = (existingId?: string): CatalogItem => {
    return {
      id: existingId || crypto.randomUUID(),
      businessId: business.id,
      type: allowedType,
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      image: previewImage,
      stock: allowedType === "producto" ? Number(form.stock || 0) : undefined,
      delivery: allowedType === "producto" ? form.delivery.trim() : undefined,
      duration: allowedType !== "producto" ? form.duration.trim() : undefined,
      schedule: allowedType !== "producto" ? parseSchedule(form.schedule) : undefined,
      locationMode: allowedType === "servicio" ? form.locationMode.trim() : undefined,
      capacity: allowedType === "experiencia" ? Number(form.capacity || 0) : undefined,
      language: allowedType === "experiencia" ? form.language.trim() : undefined,
      meetingPoint: allowedType === "experiencia" ? form.meetingPoint.trim() : undefined
    };
  };

  const saveItem = () => {
    const validation = validateForm();

    if (validation) {
      setFormError(validation);
      return;
    }

    const updatedBusinesses = businesses.map((entry) => {
      if (entry.id !== business.id) return entry;

      if (editingId) {
        return {
          ...entry,
          items: entry.items.map((item) =>
            item.id === editingId ? buildCatalogItem(editingId) : item
          )
        };
      }

      return {
        ...entry,
        items: [buildCatalogItem(), ...entry.items]
      };
    });

    saveBusinesses(updatedBusinesses);
    setBusinesses(updatedBusinesses);

    setConfirmModal({
      title: editingId ? "Elemento actualizado" : "Elemento agregado",
      message: editingId
        ? `${form.name} fue actualizado correctamente en tu catálogo.`
        : `${form.name} fue agregado correctamente a tu catálogo.`
    });

    closeFormModal();
  };

  const deleteItem = (itemId: string, itemName: string) => {
    const updatedBusinesses = businesses.map((entry) =>
      entry.id === business.id
        ? {
            ...entry,
            items: entry.items.filter((item) => item.id !== itemId)
          }
        : entry
    );

    saveBusinesses(updatedBusinesses);
    setBusinesses(updatedBusinesses);

    setConfirmModal({
      title: "Elemento retirado",
      message: `${itemName} fue retirado del catálogo.`
    });
  };

  return (
    <div className="page seller-catalog-page">
      <section className="seller-catalog-hero">
        <div>
          <span className="eyebrow">Catálogo de la tienda</span>
          <h1>Gestionar catálogo</h1>
          <p>
            Administra los elementos que aparecen en tu tienda. Este negocio está configurado como{" "}
            <b>{getTypeLabel(allowedType)}</b>, por eso solo puedes agregar elementos de ese tipo.
          </p>
        </div>

        <aside className="seller-catalog-hero-card">
          <span>{getTypeLabel(allowedType)}</span>
          <strong>{catalogItems.length}</strong>
          <small>elemento(s) publicados</small>
        </aside>
      </section>

      <section className="seller-catalog-toolbar">
        <label className="seller-catalog-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar en tu catálogo"
            aria-label="Buscar en catálogo"
          />
        </label>

        <button className="btn primary" type="button" onClick={openCreateModal}>
          <PackagePlus size={18} />
          Agregar {allowedType === "producto" ? "producto" : allowedType}
        </button>
      </section>

      <section className="seller-catalog-main-layout">
        <article className="seller-catalog-info-card">
          <Package size={24} />
          <h2>Tipo de catálogo permitido</h2>
          <p>{getTypeDescription(allowedType)}</p>
          <span>{getTypeLabel(allowedType)}</span>
        </article>

        <article className="seller-catalog-info-card">
          <Edit3 size={24} />
          <h2>Edición sin cambiar de vista</h2>
          <p>
            Al editar un elemento se abrirá una ventana emergente con el formulario,
            sin mover la pantalla ni confundirte.
          </p>
          <span>Flujo más claro</span>
        </article>
      </section>

      <section className="seller-catalog-list-card">
        <div className="seller-catalog-section-title">
          <span className="eyebrow">Tu catálogo</span>
          <h2>Elementos publicados</h2>
          <p>Edita o retira elementos desde esta misma página, sin navegar como cliente.</p>
        </div>

        {filteredItems.length === 0 ? (
          <div className="seller-catalog-empty">
            <Package size={36} />
            <h3>No hay elementos para mostrar</h3>
            <p>Agrega un nuevo elemento o cambia el término de búsqueda.</p>
            <button className="btn primary" type="button" onClick={openCreateModal}>
              Agregar elemento
            </button>
          </div>
        ) : (
          <div className="seller-catalog-list">
            {filteredItems.map((item) => (
              <article className="seller-catalog-item" key={item.id}>
                <div className="seller-catalog-item-image">
                  <img src={item.image || business.image} alt={item.name} />
                </div>

                <div className="seller-catalog-item-info">
                  <span className="seller-catalog-type-badge">
                    {getTypeLabel(item.type)}
                  </span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>

                <div className="seller-catalog-item-meta">
                  <strong>{money(item.price)}</strong>
                  {item.type === "producto" && <span>Stock: {item.stock ?? 0}</span>}
                  {item.type === "servicio" && <span>{item.duration || "Duración no definida"}</span>}
                  {item.type === "experiencia" && <span>Cupo: {item.capacity || 0}</span>}
                </div>

                <div className="seller-catalog-item-actions">
                  <button className="btn small primary" type="button" onClick={() => openEditModal(item)}>
                    <Edit3 size={15} />
                    Editar
                  </button>

                  <button
                    className="btn small outline seller-catalog-danger"
                    type="button"
                    onClick={() => deleteItem(item.id, item.name)}
                  >
                    <Trash2 size={15} />
                    Quitar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {formMode && (
        <div className="seller-catalog-modal-backdrop" role="dialog" aria-modal="true" aria-label="Formulario de catálogo">
          <section className="seller-catalog-form-modal">
            <button
              className="seller-catalog-modal-close"
              type="button"
              onClick={closeFormModal}
              aria-label="Cerrar ventana"
            >
              <X size={18} />
            </button>

            <div className="seller-catalog-modal-header">
              <span className="eyebrow">
                {formMode === "edit" ? "Editar elemento" : "Nuevo elemento"}
              </span>
              <h2>{formMode === "edit" ? "Editar catálogo" : "Agregar al catálogo"}</h2>
              <p>{getTypeDescription(allowedType)}</p>
            </div>

            <div className="seller-catalog-form-modal-layout">
              <form
                className="seller-catalog-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  saveItem();
                }}
              >
                <div className="seller-catalog-type-lock">
                  <Package size={20} />
                  <div>
                    <b>Tipo permitido</b>
                    <span>{getTypeLabel(allowedType)}</span>
                  </div>
                </div>

                <div className="form-grid">
                  <label>
                    Nombre
                    <input
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      placeholder="Ej. Pulsera artesanal"
                    />
                  </label>

                  <label>
                    Precio
                    <input
                      type="number"
                      min="1"
                      value={form.price}
                      onChange={(event) => setForm({ ...form, price: event.target.value })}
                      placeholder="Ej. 350"
                    />
                  </label>
                </div>

                <label>
                  Descripción
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    placeholder="Describe qué incluye, para quién es y qué debe saber el cliente."
                  />
                </label>

                <label>
                  URL de imagen
                  <input
                    value={form.image}
                    onChange={(event) => setForm({ ...form, image: event.target.value })}
                    placeholder="Pega una URL de imagen o deja vacío para usar la imagen del negocio"
                  />
                </label>

                {allowedType === "producto" && (
                  <div className="form-grid">
                    <label>
                      Stock disponible
                      <input
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={(event) => setForm({ ...form, stock: event.target.value })}
                        placeholder="Ej. 15"
                      />
                    </label>

                    <label>
                      Modalidad de entrega
                      <input
                        value={form.delivery}
                        onChange={(event) => setForm({ ...form, delivery: event.target.value })}
                        placeholder="Entrega en punto acordado"
                      />
                    </label>
                  </div>
                )}

                {allowedType === "servicio" && (
                  <div className="form-grid">
                    <label>
                      Duración
                      <input
                        value={form.duration}
                        onChange={(event) => setForm({ ...form, duration: event.target.value })}
                        placeholder="Ej. 1 hora 30 minutos"
                      />
                    </label>

                    <label>
                      Horarios disponibles
                      <input
                        value={form.schedule}
                        onChange={(event) => setForm({ ...form, schedule: event.target.value })}
                        placeholder="10:00, 13:00, 16:00"
                      />
                    </label>

                    <label>
                      Lugar o modalidad de atención
                      <input
                        value={form.locationMode}
                        onChange={(event) => setForm({ ...form, locationMode: event.target.value })}
                        placeholder="Estudio / domicilio acordado"
                      />
                    </label>
                  </div>
                )}

                {allowedType === "experiencia" && (
                  <div className="form-grid">
                    <label>
                      Cupo máximo
                      <input
                        type="number"
                        min="1"
                        value={form.capacity}
                        onChange={(event) => setForm({ ...form, capacity: event.target.value })}
                        placeholder="Ej. 8"
                      />
                    </label>

                    <label>
                      Duración
                      <input
                        value={form.duration}
                        onChange={(event) => setForm({ ...form, duration: event.target.value })}
                        placeholder="Ej. 2 horas"
                      />
                    </label>

                    <label>
                      Idioma
                      <input
                        value={form.language}
                        onChange={(event) => setForm({ ...form, language: event.target.value })}
                        placeholder="Español / Inglés"
                      />
                    </label>

                    <label>
                      Horarios disponibles
                      <input
                        value={form.schedule}
                        onChange={(event) => setForm({ ...form, schedule: event.target.value })}
                        placeholder="09:00, 12:00, 17:00"
                      />
                    </label>

                    <label>
                      Punto de encuentro
                      <input
                        value={form.meetingPoint}
                        onChange={(event) => setForm({ ...form, meetingPoint: event.target.value })}
                        placeholder="Parque de las Palapas"
                      />
                    </label>
                  </div>
                )}

                {formError && (
                  <div className="seller-catalog-error">
                    {formError}
                  </div>
                )}

                <div className="seller-catalog-actions">
                  <button className="btn primary" type="submit">
                    <Save size={18} />
                    {formMode === "edit" ? "Guardar cambios" : "Agregar al catálogo"}
                  </button>

                  <button className="btn outline" type="button" onClick={closeFormModal}>
                    Cancelar
                  </button>
                </div>
              </form>

              <aside className="seller-catalog-preview-card in-modal">
                <span className="eyebrow">Vista previa interna</span>

                <div className="seller-catalog-preview-image">
                  {previewImage ? (
                    <img src={previewImage} alt={form.name || "Vista previa"} />
                  ) : (
                    <Image size={40} />
                  )}
                </div>

                <span className="seller-catalog-type-badge">
                  {getTypeLabel(allowedType)}
                </span>

                <h3>{form.name || "Nombre del elemento"}</h3>
                <strong>{money(previewPrice)}</strong>
                <p>{form.description || "Aquí aparecerá la descripción del catálogo."}</p>

                <div className="seller-catalog-preview-details">
                  {allowedType === "producto" && (
                    <>
                      <span>Stock: {form.stock || "0"}</span>
                      <span>{form.delivery || "Modalidad de entrega"}</span>
                    </>
                  )}

                  {allowedType === "servicio" && (
                    <>
                      <span>{form.duration || "Duración"}</span>
                      <span>{form.locationMode || "Lugar de atención"}</span>
                    </>
                  )}

                  {allowedType === "experiencia" && (
                    <>
                      <span>Cupo: {form.capacity || "0"}</span>
                      <span>{form.meetingPoint || "Punto de encuentro"}</span>
                    </>
                  )}
                </div>
              </aside>
            </div>
          </section>
        </div>
      )}

      {confirmModal && (
        <div className="seller-catalog-modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirmación de catálogo">
          <section className="seller-catalog-confirm-modal">
            <button
              className="seller-catalog-modal-close"
              type="button"
              onClick={() => setConfirmModal(null)}
              aria-label="Cerrar ventana"
            >
              <X size={18} />
            </button>

            <div className="seller-catalog-modal-icon">
              <CheckCircle2 size={34} />
            </div>

            <span className="eyebrow">Catálogo actualizado</span>
            <h2>{confirmModal.title}</h2>
            <p>{confirmModal.message}</p>

            <div className="seller-catalog-modal-actions">
              <button className="btn primary" type="button" onClick={() => setConfirmModal(null)}>
                Entendido
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
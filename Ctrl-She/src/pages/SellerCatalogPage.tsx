import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Image,
  Package,
  PackagePlus,
  Save,
  Search,
  Sparkles,
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

type AiCatalogSuggestion = {
  name: string;
  description: string;
  category: string;
  price: string;
  priceValue: number;
  tags: string[];
  recommendation: string;
};

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
  return "Producto o servicio";
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

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function capitalizeText(value: string) {
  const cleaned = cleanText(value);

  if (!cleaned) return "";

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function inferSuggestedName(form: CatalogForm, businessCategory: string) {
  const name = cleanText(form.name);
  const normalizedName = name.toLowerCase();

  if (!name) {
    if (form.type === "servicio") return "Servicio personalizado destacado";
    if (form.type === "experiencia") return "Experiencia local para visitantes";

    return businessCategory === "Artesanías y souvenirs"
      ? "Pieza artesanal caribeña"
      : "Producto destacado de la tienda";
  }

  if (form.type === "producto" && businessCategory === "Artesanías y souvenirs") {
    if (!normalizedName.includes("artesanal") && !normalizedName.includes("hecho a mano")) {
      return `${capitalizeText(name)} artesanal`;
    }
  }

  if (form.type === "servicio" && !normalizedName.includes("personalizado")) {
    return `${capitalizeText(name)} personalizado`;
  }

  if (form.type === "experiencia" && !normalizedName.includes("local")) {
    return `${capitalizeText(name)} local`;
  }

  return capitalizeText(name);
}

function inferSuggestedPrice(form: CatalogForm) {
  const currentPrice = Number(form.price);
  const name = `${form.name} ${form.description}`.toLowerCase();

  if (currentPrice > 0) return currentPrice;

  if (form.type === "servicio") {
    if (name.includes("foto") || name.includes("sesión") || name.includes("sesion")) return 900;
    if (name.includes("uñas") || name.includes("unas") || name.includes("cejas")) return 300;
    return 450;
  }

  if (form.type === "experiencia") {
    if (name.includes("recorrido") || name.includes("tour")) return 400;
    if (name.includes("taller")) return 250;
    return 350;
  }

  if (name.includes("bolsa")) return 350;
  if (name.includes("collar")) return 180;
  if (name.includes("pulsera")) return 120;
  if (name.includes("arete") || name.includes("aretes")) return 150;
  if (name.includes("llavero") || name.includes("souvenir")) return 90;

  return 180;
}

function buildAiTags(form: CatalogForm, businessCategory: string) {
  const baseTags = ["Local", "Mujer emprendedora"];

  if (form.type === "producto") {
    return businessCategory === "Artesanías y souvenirs"
      ? ["Hecho a mano", "Artesanal", "Souvenir", "Regalo", ...baseTags]
      : ["Producto local", "Regalo", "Disponible", ...baseTags];
  }

  if (form.type === "servicio") {
    return ["Servicio", "Atención personalizada", "Reserva en línea", "Confianza", ...baseTags];
  }

  return ["Experiencia turística", "Cancún", "Reserva en línea", "Actividad local", ...baseTags];
}

function buildAiRecommendation(form: CatalogForm) {
  if (form.type === "producto") {
    return "Conserva el stock, la modalidad de entrega y la imagen como datos reales. La IA solo te ayuda a hacer más vendible la ficha del producto.";
  }

  if (form.type === "servicio") {
    return "Revisa que la duración, horarios y modalidad de atención sean correctos antes de publicar el servicio.";
  }

  return "Verifica cupo, idioma y punto de encuentro antes de publicar la experiencia para evitar confusiones con clientes.";
}

function buildAiCatalogSuggestion(
  form: CatalogForm,
  businessName: string,
  businessCategory: string
): AiCatalogSuggestion {
  const suggestedName = inferSuggestedName(form, businessCategory);
  const currentDescription = cleanText(form.description);
  const suggestedPriceValue = inferSuggestedPrice(form);

  if (form.type === "servicio") {
    const duration = cleanText(form.duration);
    const locationMode = cleanText(form.locationMode);

    return {
      name: suggestedName,
      category: businessCategory,
      priceValue: suggestedPriceValue,
      price: money(suggestedPriceValue),
      tags: buildAiTags(form, businessCategory),
      recommendation: buildAiRecommendation(form),
      description: cleanText(
        `${suggestedName} de ${businessName}, pensado para brindar una atención clara, cercana y personalizada.` +
          `${duration ? ` Tiene una duración aproximada de ${duration}.` : ""}` +
          `${locationMode ? ` La atención se realiza mediante ${locationMode.toLowerCase()}.` : ""}` +
          `${currentDescription ? ` ${currentDescription}` : ""}` +
          " Ideal para clientes que buscan una experiencia confiable, bien organizada y fácil de reservar."
      )
    };
  }

  if (form.type === "experiencia") {
    const duration = cleanText(form.duration);
    const meetingPoint = cleanText(form.meetingPoint);
    const language = cleanText(form.language);

    return {
      name: suggestedName,
      category: businessCategory,
      priceValue: suggestedPriceValue,
      price: money(suggestedPriceValue),
      tags: buildAiTags(form, businessCategory),
      recommendation: buildAiRecommendation(form),
      description: cleanText(
        `${suggestedName} organizada por ${businessName}, creada para disfrutar una actividad local auténtica y bien acompañada.` +
          `${duration ? ` La experiencia tiene una duración aproximada de ${duration}.` : ""}` +
          `${language ? ` Se ofrece en ${language}.` : ""}` +
          `${meetingPoint ? ` El punto de encuentro es ${meetingPoint}.` : ""}` +
          `${currentDescription ? ` ${currentDescription}` : ""}` +
          " Recomendada para visitantes que desean conocer más de la zona con una opción segura y sencilla de reservar."
      )
    };
  }

  const delivery = cleanText(form.delivery);
  const stock = cleanText(form.stock);

  return {
    name: suggestedName,
    category: businessCategory,
    priceValue: suggestedPriceValue,
    price: money(suggestedPriceValue),
    tags: buildAiTags(form, businessCategory),
    recommendation: buildAiRecommendation(form),
    description: cleanText(
      `${suggestedName} de ${businessName}, ideal para quienes buscan un detalle local, bonito y con identidad propia.` +
        `${currentDescription ? ` ${currentDescription}` : ""}` +
        `${stock ? ` Disponibilidad actual: ${stock} pieza(s).` : ""}` +
        `${delivery ? ` La entrega se coordina mediante ${delivery.toLowerCase()}.` : ""}` +
        " Una opción práctica para regalar, conservar como recuerdo o complementar una compra especial."
    )
  };
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
  const [aiSuggestion, setAiSuggestion] = useState<AiCatalogSuggestion | null>(null);
  const [aiWasApplied, setAiWasApplied] = useState(false);
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
    setAiSuggestion(null);
    setAiWasApplied(false);
  };

  const openEditModal = (item: CatalogItem) => {
    setFormMode("edit");
    setEditingId(item.id);
    setForm(formFromItem(item));
    setFormError("");
    setAiSuggestion(null);
    setAiWasApplied(false);
  };

  const closeFormModal = () => {
    setFormMode(null);
    setEditingId(null);
    setForm(createEmptyForm(allowedType));
    setFormError("");
    setAiSuggestion(null);
    setAiWasApplied(false);
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

  const generateAiSuggestion = () => {
    setAiSuggestion(buildAiCatalogSuggestion(form, business.name, business.category));
    setAiWasApplied(false);
  };

  const applyAiDescription = () => {
    if (!aiSuggestion) return;

    setForm({ ...form, description: aiSuggestion.description });
    setAiWasApplied(true);
  };

  const applyAiMainFields = () => {
    if (!aiSuggestion) return;

    setForm({
      ...form,
      name: aiSuggestion.name,
      description: aiSuggestion.description,
      price: String(aiSuggestion.priceValue)
    });
    setAiWasApplied(true);
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
            Administra los elementos que aparecen en tu tienda. Agrega, edita o retira productos, servicios o experiencias sin complicaciones y con sugerencias para hacerlos más atractivos.
          </p>
        </div>

        <aside className="seller-catalog-hero-card">
          <span>Elemento(s) publicados</span>
          <strong>{catalogItems.length}</strong>
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
                    onChange={(event) => {
                      setForm({ ...form, description: event.target.value });
                      setAiWasApplied(false);
                    }}
                    placeholder="Describe qué incluye, para quién es y qué debe saber el cliente."
                  />
                </label>

                {formMode === "create" && (
                  <section className="seller-catalog-ai-helper" aria-live="polite">
                    <div className="seller-catalog-ai-helper-header">
                      <span className="seller-catalog-ai-icon">
                        <Sparkles size={18} />
                      </span>
                      <div>
                        <h3>IA de sugerencias para catálogo</h3>
                        <p>
                          Genera una ficha más completa a partir del nombre, tipo de negocio y datos capturados.
                          No es un chatbot: solo propone mejoras que tú decides aplicar.
                        </p>
                      </div>
                    </div>

                    {aiSuggestion ? (
                      <div className="seller-catalog-ai-suggestion">
                        <span>Sugerencias IA</span>

                        <div className="seller-catalog-ai-suggestion-grid">
                          <div className="seller-catalog-ai-field">
                            <small>Nombre sugerido</small>
                            <b>{aiSuggestion.name}</b>
                          </div>

                          <div className="seller-catalog-ai-field">
                            <small>Categoría sugerida</small>
                            <b>{aiSuggestion.category}</b>
                          </div>

                          <div className="seller-catalog-ai-field">
                            <small>Precio sugerido</small>
                            <b>{aiSuggestion.price}</b>
                          </div>
                        </div>

                        <div className="seller-catalog-ai-description">
                          <small>Descripción sugerida</small>
                          <p>{aiSuggestion.description}</p>
                        </div>

                        <div className="seller-catalog-ai-tags" aria-label="Etiquetas recomendadas">
                          {aiSuggestion.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>

                        <div className="seller-catalog-ai-recommendation">
                          <small>Recomendación</small>
                          <p>{aiSuggestion.recommendation}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="seller-catalog-ai-empty">
                        Escribe al menos el nombre del elemento y presiona generar para recibir nombre mejorado,
                        descripción, categoría, precio sugerido, etiquetas y recomendaciones comerciales.
                      </div>
                    )}

                    <div className="seller-catalog-ai-actions">
                      <button className="btn small outline" type="button" onClick={generateAiSuggestion}>
                        <Sparkles size={15} />
                        {aiSuggestion ? "Actualizar sugerencias" : "Generar sugerencias con IA"}
                      </button>

                      {aiSuggestion && (
                        <>
                          <button className="btn small outline" type="button" onClick={applyAiDescription}>
                            Usar descripción
                          </button>

                          <button className="btn small primary" type="button" onClick={applyAiMainFields}>
                            Aplicar nombre, precio y descripción
                          </button>
                        </>
                      )}
                    </div>

                    {aiWasApplied && (
                      <small className="seller-catalog-ai-applied">
                        Sugerencia aplicada. Revisa y edita los campos antes de guardar el producto.
                      </small>
                    )}
                  </section>
                )}

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
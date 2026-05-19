import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Bot,
  HelpCircle,
  MessageCircle,
  Send,
  Sparkles,
  Store,
  UserRound,
  X
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";

type AssistantAudience = "seller" | "client";
type MessageSender = "bot" | "user";

interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
}

interface AssistantFaq {
  id: string;
  audience: AssistantAudience;
  question: string;
  answer: string;
  keywords: string[];
}

const sellerFaqs: AssistantFaq[] = [
  {
    id: "seller-catalog",
    audience: "seller",
    question: "¿Cómo agrego un producto al catálogo?",
    answer:
      "Entra a Catálogo, presiona Agregar elemento y completa nombre, precio, stock, entrega e imagen. Antes de guardar puedes usar la ayuda de IA del formulario para mejorar la descripción, el nombre comercial, la categoría y las etiquetas.",
    keywords: ["catalogo", "producto", "agregar", "elemento", "descripcion", "stock"]
  },
  {
    id: "seller-ai-catalog",
    audience: "seller",
    question: "¿Para qué sirve la IA de catálogo?",
    answer:
      "Sirve como ayuda de llenado para crear fichas de producto más claras. No reemplaza tus datos reales: solo sugiere texto, categoría, precio estimado y etiquetas para que tú decidas qué aplicar.",
    keywords: ["ia", "inteligencia", "sugerencia", "descripcion", "precio", "etiqueta", "categoria"]
  },
  {
    id: "seller-orders",
    audience: "seller",
    question: "¿Dónde reviso mis pedidos pendientes?",
    answer:
      "En la sección Pedidos puedes revisar solicitudes nuevas, pedidos confirmados y pedidos en proceso. La idea es actualizar el estado para que el cliente sepa si su compra ya fue recibida, preparada o entregada.",
    keywords: ["pedido", "pendiente", "confirmado", "entrega", "solicitud", "estado"]
  },
  {
    id: "seller-stock",
    audience: "seller",
    question: "¿Qué hago si me queda poco stock?",
    answer:
      "Si te queda poco stock, conviene preparar más piezas, actualizar la cantidad disponible o avisar en la descripción si el producto se trabaja bajo pedido. Así evitas vender algo que no puedas entregar a tiempo.",
    keywords: ["stock", "agotado", "surtir", "inventario", "producto", "existencia"]
  },
  {
    id: "seller-qr",
    audience: "seller",
    question: "¿Cómo comparto mi tienda?",
    answer:
      "En Mi tienda puedes usar el botón QR de tienda para mostrar el código de difusión, copiar el enlace o compartir la tienda. Es útil para WhatsApp, redes sociales, tarjetas o material impreso.",
    keywords: ["qr", "compartir", "tienda", "enlace", "difusion"]
  }
];

const clientFaqs: AssistantFaq[] = [
  {
    id: "client-buy",
    audience: "client",
    question: "¿Cómo compro o reservo?",
    answer:
      "Explora negocios, abre una tienda, elige un producto o servicio y presiona Pedir o reservar. Después confirmas tus datos, modalidad de entrega o cita y generas tu comprobante.",
    keywords: ["comprar", "reservar", "pedido", "producto", "servicio", "pagar"]
  },
  {
    id: "client-orders",
    audience: "client",
    question: "¿Dónde veo mis pedidos?",
    answer:
      "En Mis pedidos puedes revisar el folio, negocio, estado de compra o reserva y monto. Esa sección te sirve para dar seguimiento después de confirmar.",
    keywords: ["mis pedidos", "folio", "estado", "seguimiento", "compra"]
  },
  {
    id: "client-invoice",
    audience: "client",
    question: "¿Puedo solicitar factura?",
    answer:
      "Sí. Durante el flujo de compra puedes marcar que necesitas factura y capturar tus datos fiscales. La solicitud queda asociada al folio del pedido.",
    keywords: ["factura", "fiscal", "rfc", "comprobante"]
  },
  {
    id: "client-store",
    audience: "client",
    question: "¿Cómo contacto a una tienda?",
    answer:
      "Desde el perfil público de cada negocio puedes revisar su catálogo, zona, descripción y botones de acción. También puedes abrir tiendas desde el marketplace o desde la ruta local.",
    keywords: ["contacto", "tienda", "negocio", "perfil", "whatsapp"]
  },
  {
    id: "client-verified",
    audience: "client",
    question: "¿Qué significa tienda verificada?",
    answer:
      "Significa que el negocio aparece validado dentro del prototipo y cuenta con información revisada. Te ayuda a identificar emprendimientos con datos más completos.",
    keywords: ["verificada", "segura", "confianza", "negocio", "validada"]
  }
];

const allFaqs = [...sellerFaqs, ...clientFaqs];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getAudience(pathname: string, role: ReturnType<typeof useAuth>["role"]): AssistantAudience {
  const sellerPaths = ["/emprendedora", "/catalogo", "/pedidos", "/qr", "/ia"];
  if (role === "emprendedora" || sellerPaths.some((path) => pathname.startsWith(path))) return "seller";
  return "client";
}

function getGreeting(audience: AssistantAudience) {
  if (audience === "seller") {
    return "Hola, soy tu asistente de tienda. Puedo responder dudas rápidas sobre catálogo, pedidos, stock, QR e IA de sugerencias.";
  }

  return "Hola, soy tu asistente de Ctrl + She. Puedo ayudarte con compras, reservas, pedidos, facturación y tiendas verificadas.";
}

function findFaqAnswer(text: string, audience: AssistantAudience) {
  const normalized = normalizeText(text);
  const availableFaqs = allFaqs.filter((faq) => faq.audience === audience);

  return availableFaqs.find((faq) =>
    faq.keywords.some((keyword) => normalized.includes(normalizeText(keyword)))
  );
}

function getFallbackAnswer(audience: AssistantAudience) {
  if (audience === "seller") {
    return "Puedo ayudarte con catálogo, IA de sugerencias, pedidos pendientes, stock bajo o QR de tienda. Prueba escribiendo: catálogo, pedidos, stock, IA o QR.";
  }

  return "Puedo ayudarte con compras, reservas, pedidos, factura o tiendas verificadas. Prueba escribiendo: comprar, mis pedidos, factura o tienda.";
}

export default function FloatingAssistant() {
  const { role } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const audience = useMemo(() => getAudience(location.pathname, role), [location.pathname, role]);
  const faqs = useMemo(() => allFaqs.filter((faq) => faq.audience === audience), [audience]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", sender: "bot", text: getGreeting(audience) }
  ]);

  const resetWelcomeIfNeeded = () => {
    const welcome = getGreeting(audience);
    if (messages.length === 1 && messages[0].id === "welcome" && messages[0].text !== welcome) {
      setMessages([{ id: "welcome", sender: "bot", text: welcome }]);
    }
  };

  const sendQuestion = (question: string) => {
    const faq = findFaqAnswer(question, audience);
    const answer = faq?.answer || getFallbackAnswer(audience);
    const timestamp = Date.now();

    setMessages((current) => [
      ...current,
      { id: `user-${timestamp}`, sender: "user", text: question },
      { id: `bot-${timestamp}`, sender: "bot", text: answer }
    ]);
    setInput("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    sendQuestion(value);
  };

  const openAssistant = () => {
    resetWelcomeIfNeeded();
    setIsOpen(true);
  };

  return (
    <section className="floating-assistant" aria-label="Asistente de Ctrl + She">
      {isOpen && (
        <div className="assistant-panel" role="dialog" aria-modal="false" aria-label="Ventana del chatbot de ayuda">
          <header className="assistant-header">
            <div className="assistant-avatar" aria-hidden="true">
              <span className="assistant-avatar-face">She</span>
              <span className="assistant-avatar-spark"><Sparkles size={14} /></span>
            </div>
            <div>
              <span className="assistant-mode">{audience === "seller" ? "Preguntas de vendedora" : "Preguntas de cliente"}</span>
              <h2>{audience === "seller" ? "Chatbot de tienda" : "Chatbot de ayuda"}</h2>
            </div>
            <button className="assistant-close" type="button" aria-label="Cerrar chatbot" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </header>

          <div className="assistant-alert-strip">
            <HelpCircle size={17} />
            <p>{audience === "seller" ? "Resuelve dudas frecuentes sobre tu operación sin salir del panel." : "Encuentra respuestas rápidas para comprar, reservar o dar seguimiento."}</p>
          </div>

          <div className="assistant-chat-area">
            <div className="assistant-messages" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={`assistant-message ${message.sender}`}>
                  {message.sender === "bot" ? <Bot size={15} /> : <UserRound size={15} />}
                  <p>{message.text}</p>
                </div>
              ))}
            </div>

            <div className="assistant-faq-list" aria-label="Preguntas frecuentes sugeridas">
              {faqs.map((faq) => (
                <button key={faq.id} type="button" onClick={() => sendQuestion(faq.question)}>
                  <MessageCircle size={14} />
                  {faq.question}
                </button>
              ))}
            </div>

            <form className="assistant-input-row" onSubmit={handleSubmit}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={audience === "seller" ? "Pregunta por stock, pedidos, catálogo..." : "Pregunta por compras, factura, pedidos..."}
                aria-label="Escribir pregunta al chatbot"
              />
              <button type="submit" aria-label="Enviar pregunta">
                <Send size={17} />
              </button>
            </form>
          </div>

          <footer className="assistant-panel-footer">
            <Store size={15} />
            <span>{audience === "seller" ? "Chatbot de apoyo para la vendedora." : "Chatbot de apoyo para clientes de Ctrl + She."}</span>
          </footer>
        </div>
      )}

      <button className="assistant-launcher" type="button" onClick={openAssistant} aria-label="Abrir chatbot de Ctrl + She">
        <span className="assistant-launcher-doll" aria-hidden="true">
          <Sparkles size={17} />
        </span>
        <span className="assistant-launcher-text">Ayuda</span>
      </button>
    </section>
  );
}

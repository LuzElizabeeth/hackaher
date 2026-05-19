import { useState } from "react";
import { Copy, Sparkles } from "lucide-react";

type AiMode = "descripcion" | "ingles" | "post" | "precio" | "faqs";

function generate(text: string, variant = 0) {
  const subject = text || "Pulsera hecha a mano con conchas";
  return {
    descripcion: variant % 2 === 0
      ? `${subject}: propuesta creada con detalle, identidad local y una historia que conecta con clientes que buscan algo autentico en Cancun.`
      : `${subject}: opcion especial para clientes que valoran productos y servicios locales, con atencion clara y compra sencilla.`,
    ingles: `${subject}. A local offer from Cancun, designed with care and ready to share with visitors looking for authentic experiences.`,
    post: `Haz que tu visita a Cancun tenga una historia local. Descubre ${subject.toLowerCase()} y apoya a mujeres emprendedoras.`,
    precio: "Rango sugerido: $120 a $180 MXN si es producto artesanal; ajusta segun materiales, tiempo y demanda.",
    faqs: ["Esta disponible?", "Donde puedo recogerlo?", "Aceptas transferencia?", "Se puede personalizar?", "Cuanto tarda la entrega?"]
  };
}

const modes: Array<[AiMode, string]> = [
  ["descripcion", "Mejorar descripcion"],
  ["ingles", "Traducir al ingles"],
  ["post", "Crear publicacion"],
  ["precio", "Sugerir precio"],
  ["faqs", "Preguntas frecuentes"]
];

export default function AiAssistant() {
  const [input, setInput] = useState("Pulsera hecha a mano con conchas");
  const [mode, setMode] = useState<AiMode>("descripcion");
  const [variant, setVariant] = useState(0);
  const [message, setMessage] = useState("");
  const result = generate(input, variant);
  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(`${label} copiado.`);
    } catch {
      setMessage(`${label} listo para copiar manualmente.`);
    }
  };

  return (
    <section className="ai-workspace card">
      <aside className="ai-sidebar">
        <span className="badge ai">IA comercial simulada</span>
        <h2>Convierte una idea en material listo para vender</h2>
        <label>Idea base<textarea value={input} onChange={(event) => setInput(event.target.value)} /></label>
        <div className="ai-options">
          {modes.map(([value, label]) => <button key={value} className={mode === value ? "chip active" : "chip"} onClick={() => setMode(value)}>{label}</button>)}
        </div>
        <button className="btn ai-btn" onClick={() => setVariant(variant + 1)}><Sparkles size={18} /> Generar otra version</button>
        {message && <div className="alert success">{message}</div>}
      </aside>
      <div className="ai-output">
        <article className="ai-result-card">
          <b>{modes.find(([value]) => value === mode)?.[1]}</b>
          {mode === "faqs" ? <ul>{result.faqs.map((faq) => <li key={faq}>{faq}</li>)}</ul> : <p>{result[mode]}</p>}
          <div className="cta-row">
            {mode === "descripcion" && <button className="btn outline small" onClick={() => copy(result.descripcion, "Descripcion")}><Copy size={15} /> Copiar descripcion</button>}
            {mode === "descripcion" && <button className="btn secondary small" onClick={() => setMessage("Descripcion lista para pegar en tu catalogo.")}>Usar en catalogo</button>}
            {mode === "post" && <button className="btn outline small" onClick={() => copy(result.post, "Publicacion")}><Copy size={15} /> Copiar publicacion</button>}
            {mode !== "descripcion" && mode !== "post" && <button className="btn outline small" onClick={() => copy(Array.isArray(result[mode]) ? result.faqs.join("\\n") : String(result[mode]), "Resultado")}><Copy size={15} /> Copiar resultado</button>}
          </div>
        </article>
        <div className="ai-mini-grid">
          <article><b>Descripcion</b><p>{result.descripcion}</p></article>
          <article><b>Ingles</b><p>{result.ingles}</p></article>
          <article><b>Post</b><p>{result.post}</p></article>
          <article><b>Precio</b><p>{result.precio}</p></article>
        </div>
      </div>
    </section>
  );
}

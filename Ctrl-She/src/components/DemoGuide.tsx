import { useState } from "react";
import { ClipboardList } from "lucide-react";

const steps = [
  "Entrar al landing.",
  "Explorar negocios.",
  "Abrir una tienda.",
  "Hacer pedido o reserva.",
  "Simular pago.",
  "Generar comprobante.",
  "Dejar resena.",
  "Iniciar sesion como emprendedora.",
  "Entrar al panel de emprendedora.",
  "Usar IA comercial.",
  "Ver QR.",
  "Cerrar sesion.",
  "Iniciar sesion como admin.",
  "Entrar al panel admin y validar una emprendedora."
];

export default function DemoGuide() {
  const [open, setOpen] = useState(false);
  return (
    <aside className={open ? "demo-guide open" : "demo-guide"}>
      <button className="demo-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Abrir guia de demo">
        <ClipboardList size={18} /> Guia de demo
      </button>
      {open && (
        <div className="demo-content card">
          <h2>Flujo de presentacion</h2>
          <ol>{steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </div>
      )}
    </aside>
  );
}

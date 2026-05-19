import { useState } from "react";
import { Link } from "react-router-dom";
import QRBlock from "./QRBlock";
import { getBusinesses, saveBusinesses } from "../lib/storage";
import type { BusinessType } from "../types";

export default function StoreOnboarding() {
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState({
    businessName: "Artesanias Lupita",
    owner: "Lupita Hernandez",
    phone: "9981234567",
    zone: "Mercado 28",
    type: "producto" as BusinessType,
    itemName: "Pulsera Caribe Maya",
    price: 120,
    description: "Pulsera artesanal inspirada en el mar Caribe.",
    extra: "8"
  });

  const save = () => {
    const businesses = getBusinesses();
    const updated = businesses.map((business) => business.id === "artesanias-lupita" ? {
      ...business,
      name: data.businessName,
      owner: data.owner,
      phone: data.phone,
      zone: data.zone,
      type: data.type,
      items: [{
        ...business.items[0],
        type: data.type,
        name: data.itemName,
        price: Number(data.price),
        description: data.description,
        stock: data.type === "producto" ? Number(data.extra || 1) : undefined,
        duration: data.type === "servicio" ? data.extra || "1 hora" : undefined,
        capacity: data.type === "experiencia" ? Number(data.extra || 6) : undefined
      }, ...business.items.slice(1)]
    } : business);
    saveBusinesses(updated);
    setSaved(true);
    setStep(4);
  };

  return (
    <section className="onboarding card">
      <div className="row between">
        <div><span className="badge admin">Configura tu tienda</span><h2>Crear tienda en minutos</h2></div>
        <span className="step-pill">Paso {step} de 4</span>
      </div>
      {step === 1 && (
        <div className="form-grid">
          <label>Nombre del negocio<input value={data.businessName} onChange={(e) => setData({ ...data, businessName: e.target.value })} /></label>
          <label>Nombre de la emprendedora<input value={data.owner} onChange={(e) => setData({ ...data, owner: e.target.value })} /></label>
          <label>WhatsApp<input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} /></label>
          <label>Zona de Cancun<input value={data.zone} onChange={(e) => setData({ ...data, zone: e.target.value })} /></label>
        </div>
      )}
      {step === 2 && (
        <div className="type-picker" role="group" aria-label="Tipo de negocio">
          {[
            ["producto", "Producto fisico"],
            ["servicio", "Servicio personal / creativo"],
            ["experiencia", "Experiencia turistica"]
          ].map(([value, label]) => <button className={data.type === value ? "chip active" : "chip"} key={value} onClick={() => setData({ ...data, type: value as BusinessType })}>{label}</button>)}
        </div>
      )}
      {step === 3 && (
        <div className="form-grid">
          <label>Nombre<input value={data.itemName} onChange={(e) => setData({ ...data, itemName: e.target.value })} /></label>
          <label>Precio<input type="number" value={data.price} onChange={(e) => setData({ ...data, price: Number(e.target.value) })} /></label>
          <label>Descripcion<textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} /></label>
          <label>{data.type === "producto" ? "Stock" : data.type === "servicio" ? "Duracion" : "Cupo"}<input value={data.extra} onChange={(e) => setData({ ...data, extra: e.target.value })} /></label>
        </div>
      )}
      {step === 4 && (
        <div className="onboarding-result">
          {saved && <div className="alert success">Tienda guardada en localStorage para la demo.</div>}
          <QRBlock url={`${window.location.origin}/tienda/artesanias-lupita`} />
          <div className="cta-row">
            <Link className="btn primary" to="/tienda/artesanias-lupita">Ver tienda</Link>
          </div>
        </div>
      )}
      <div className="row">
        {step > 1 && <button className="btn outline" onClick={() => setStep(step - 1)}>Anterior</button>}
        {step < 3 && <button className="btn primary" onClick={() => setStep(step + 1)}>Continuar</button>}
        {step === 3 && <button className="btn primary" onClick={save}>Generar QR</button>}
      </div>
    </section>
  );
}

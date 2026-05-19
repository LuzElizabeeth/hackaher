const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Ctrl + She";
pptx.company = "Ctrl + She";
pptx.subject = "Diagrama de flujo editable de la plataforma";
pptx.title = "Diagrama de flujo Ctrl + She";
pptx.lang = "es-MX";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "es-MX"
};

const C = {
  navy: "0F172A",
  blue: "1D4ED8",
  purple: "7C3AED",
  pink: "EC4899",
  green: "16A34A",
  amber: "F59E0B",
  bg: "F8FAFC",
  softBlue: "EAF1FF",
  softPurple: "F2ECFF",
  softGreen: "EAFBF0",
  softPink: "FFF0F8",
  gray: "64748B",
  line: "CBD5E1",
  white: "FFFFFF"
};

const W = 13.333;
const H = 7.5;

function addTitle(slide, eyebrow, title, subtitle) {
  slide.background = { color: C.bg };
  slide.addText(eyebrow, {
    x: 0.55,
    y: 0.35,
    w: 4,
    h: 0.25,
    fontSize: 10,
    bold: true,
    color: C.purple,
    margin: 0,
    breakLine: false,
    charSpace: 1.5
  });
  slide.addText(title, {
    x: 0.55,
    y: 0.68,
    w: 8.4,
    h: 0.55,
    fontSize: 28,
    bold: true,
    color: C.navy,
    margin: 0
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.57,
      y: 1.18,
      w: 8.8,
      h: 0.38,
      fontSize: 11.5,
      color: C.gray,
      margin: 0
    });
  }
}

function box(slide, text, x, y, w, h, opts = {}) {
  const fill = opts.fill || C.white;
  const line = opts.line || C.line;
  const color = opts.color || C.navy;
  const shape = opts.shape || "roundRect";
  slide.addShape(pptx.ShapeType[shape], {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: fill },
    line: { color: line, width: opts.lineWidth || 1 },
    shadow: opts.shadow === false ? undefined : { type: "outer", color: "D8DEE9", opacity: 0.14, blur: 1, angle: 45, distance: 1 }
  });
  slide.addText(text, {
    x: x + 0.08,
    y: y + 0.07,
    w: w - 0.16,
    h: h - 0.14,
    fontSize: opts.fontSize || 10,
    bold: opts.bold ?? true,
    color,
    align: "center",
    valign: "mid",
    fit: "shrink",
    margin: 0
  });
}

function decision(slide, text, x, y, w, h, opts = {}) {
  box(slide, text, x, y, w, h, {
    ...opts,
    shape: "flowChartDecision",
    fill: opts.fill || "FFF7ED",
    line: opts.line || C.amber,
    fontSize: opts.fontSize || 9.4
  });
}

function arrow(slide, x1, y1, x2, y2, label, opts = {}) {
  slide.addShape(pptx.ShapeType.line, {
    x: x1,
    y: y1,
    w: x2 - x1,
    h: y2 - y1,
    line: {
      color: opts.color || C.line,
      width: opts.width || 1.4,
      beginArrowType: "none",
      endArrowType: "triangle"
    }
  });
  if (label) {
    const lx = (x1 + x2) / 2 - 0.28;
    const ly = (y1 + y2) / 2 - 0.13;
    slide.addText(label, {
      x: lx,
      y: ly,
      w: 0.7,
      h: 0.24,
      fontSize: 7.5,
      bold: true,
      color: opts.labelColor || C.gray,
      fill: { color: C.bg, transparency: 8 },
      align: "center",
      margin: 0.02
    });
  }
}

function lane(slide, title, x, y, w, h, color) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    fill: { color: C.white },
    line: { color: "DFE7F3", width: 1 },
    radius: 0.16
  });
  slide.addText(title, {
    x: x + 0.22,
    y: y + 0.18,
    w: w - 0.44,
    h: 0.28,
    fontSize: 12,
    bold: true,
    color,
    margin: 0
  });
}

function chip(slide, text, x, y, color) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w: 1.4,
    h: 0.34,
    fill: { color },
    line: { color, transparency: 100 }
  });
  slide.addText(text, {
    x,
    y: y + 0.06,
    w: 1.4,
    h: 0.18,
    fontSize: 8.5,
    bold: true,
    color: C.white,
    align: "center",
    margin: 0
  });
}

// Slide 1
{
  const slide = pptx.addSlide();
  addTitle(slide, "DIAGRAMA DE FLUJO", "Ctrl + She", "Mapa editable de navegación y operación por rol.");
  slide.addText("La plataforma conecta tres experiencias: clientes que descubren y compran, vendedoras que gestionan tienda y pedidos, y administradoras que supervisan negocios, validaciones y reportes.", {
    x: 0.8,
    y: 2.0,
    w: 11.7,
    h: 0.62,
    fontSize: 18,
    color: C.navy,
    bold: true,
    align: "center",
    margin: 0
  });
  chip(slide, "Cliente", 2.2, 3.15, C.blue);
  chip(slide, "Vendedora", 5.95, 3.15, C.purple);
  chip(slide, "Administrador", 9.65, 3.15, C.pink);
  box(slide, "Explora tiendas\ncompra o reserva\nsigue pedidos\nreseña", 1.55, 3.65, 2.7, 1.35, { fill: C.softBlue, line: "B9CFFF", fontSize: 14 });
  box(slide, "Administra tienda\npublica productos/servicios\natiende pedidos\nrevisa señales IA", 5.3, 3.65, 2.9, 1.35, { fill: C.softPurple, line: "D9C7FF", fontSize: 13.5 });
  box(slide, "Supervisa negocios\nvalidaciones\nreportes\ndestacados", 9.05, 3.65, 2.75, 1.35, { fill: C.softPink, line: "FFD0EA", fontSize: 13.5 });
  box(slide, "Resultado: más visibilidad, operación más clara y decisiones apoyadas por IA.", 2.15, 5.75, 9.0, 0.62, { fill: C.navy, line: C.navy, color: C.white, fontSize: 16 });
}

// Slide 2
{
  const slide = pptx.addSlide();
  addTitle(slide, "FLUJO CLIENTE / VISITANTE", "Descubrimiento, compra y reseña", "Proceso principal desde entrada hasta seguimiento del pedido.");
  const y = 2.1;
  box(slide, "Inicio", 0.55, y, 1.05, 0.58, { fill: C.navy, line: C.navy, color: C.white });
  decision(slide, "Forma\nde entrada", 1.95, y - 0.07, 1.3, 0.72);
  box(slide, "Explorar\nnegocios", 3.65, y, 1.35, 0.58, { fill: C.softBlue, line: "B9CFFF", color: C.blue });
  box(slide, "Seleccionar\ntienda", 5.35, y, 1.35, 0.58, { fill: C.white });
  box(slide, "Ver catálogo", 7.05, y, 1.35, 0.58, { fill: C.white });
  decision(slide, "¿Compra o\nreserva?", 8.82, y - 0.07, 1.35, 0.72);
  box(slide, "Datos de\nsolicitud", 10.5, y, 1.35, 0.58, { fill: C.softBlue, line: "B9CFFF", color: C.blue });
  box(slide, "Pago", 12.08, y, 0.78, 0.58, { fill: C.blue, line: C.blue, color: C.white });

  arrow(slide, 1.6, y + 0.29, 1.95, y + 0.29);
  arrow(slide, 3.25, y + 0.29, 3.65, y + 0.29);
  arrow(slide, 5.0, y + 0.29, 5.35, y + 0.29);
  arrow(slide, 6.7, y + 0.29, 7.05, y + 0.29);
  arrow(slide, 8.4, y + 0.29, 8.82, y + 0.29);
  arrow(slide, 10.17, y + 0.29, 10.5, y + 0.29, "Sí");
  arrow(slide, 11.85, y + 0.29, 12.08, y + 0.29);

  box(slide, "Confirmar compra", 5.05, 3.8, 1.7, 0.6, { fill: C.blue, line: C.blue, color: C.white });
  box(slide, "Comprobante\ndigital", 7.25, 3.8, 1.55, 0.6, { fill: C.softBlue, line: "B9CFFF", color: C.blue });
  box(slide, "Pedido\nregistrado", 9.25, 3.8, 1.55, 0.6, { fill: C.softGreen, line: "B8E8C6", color: C.green });
  box(slide, "Seguimiento", 11.25, 3.8, 1.35, 0.6, { fill: C.white });
  box(slide, "Reseña", 11.25, 5.15, 1.35, 0.58, { fill: C.softPurple, line: "D9C7FF", color: C.purple });
  arrow(slide, 12.46, y + 0.58, 6.0, 3.8, undefined, { color: C.blue });
  arrow(slide, 6.75, 4.1, 7.25, 4.1);
  arrow(slide, 8.8, 4.1, 9.25, 4.1);
  arrow(slide, 10.8, 4.1, 11.25, 4.1);
  arrow(slide, 11.92, 4.4, 11.92, 5.15);

  box(slide, "Si la persona es vendedora y está viendo su propia tienda, la compra se bloquea.", 0.9, 5.25, 6.2, 0.48, { fill: "FFF7ED", line: "FED7AA", color: "9A3412", fontSize: 10.5 });
  arrow(slide, 9.5, 2.72, 4.1, 5.25, "No", { color: C.amber });
}

// Slide 3
{
  const slide = pptx.addSlide();
  addTitle(slide, "FLUJO INTERNO", "Vendedora y administrador", "Gestión de catálogo, pedidos, reseñas, señales IA y supervisión.");

  lane(slide, "Vendedora", 0.5, 1.65, 6.0, 5.25, C.purple);
  lane(slide, "Administrador", 6.85, 1.65, 6.0, 5.25, C.pink);

  box(slide, "Panel de\nvendedora", 0.9, 2.35, 1.35, 0.6, { fill: C.purple, line: C.purple, color: C.white });
  decision(slide, "¿Qué desea\ngestionar?", 2.65, 2.27, 1.35, 0.76, { fill: C.softPurple, line: "D9C7FF" });
  box(slide, "Mi tienda\neditar info", 4.45, 1.95, 1.55, 0.62, { fill: C.white });
  box(slide, "Catálogo\nproducto/servicio", 4.45, 2.95, 1.55, 0.62, { fill: C.white });
  box(slide, "Pedidos y\nreservas", 4.45, 3.95, 1.55, 0.62, { fill: C.white });
  box(slide, "Reseñas y\nseñales IA", 4.45, 4.95, 1.55, 0.62, { fill: C.white });

  arrow(slide, 2.25, 2.65, 2.65, 2.65);
  arrow(slide, 4.0, 2.55, 4.45, 2.25);
  arrow(slide, 4.0, 2.65, 4.45, 3.25);
  arrow(slide, 4.0, 2.76, 4.45, 4.25);
  arrow(slide, 4.0, 2.87, 4.45, 5.25);

  box(slide, "Panel\nadministrador", 7.25, 2.35, 1.55, 0.6, { fill: C.pink, line: C.pink, color: C.white });
  decision(slide, "¿Qué área\nrevisa?", 9.25, 2.27, 1.35, 0.76, { fill: C.softPink, line: "FFD0EA" });
  box(slide, "Negocios\nregistrados", 11.05, 1.85, 1.35, 0.58, { fill: C.white });
  box(slide, "Validaciones", 11.05, 2.65, 1.35, 0.58, { fill: C.white });
  box(slide, "Reportes", 11.05, 3.45, 1.35, 0.58, { fill: C.white });
  box(slide, "Destacados", 11.05, 4.25, 1.35, 0.58, { fill: C.white });

  arrow(slide, 8.8, 2.65, 9.25, 2.65);
  arrow(slide, 10.6, 2.55, 11.05, 2.14);
  arrow(slide, 10.6, 2.65, 11.05, 2.94);
  arrow(slide, 10.6, 2.76, 11.05, 3.74);
  arrow(slide, 10.6, 2.87, 11.05, 4.54);

  box(slide, "Señales IA: bajo stock, alta visualización, mejorar descripción, mejorar imagen y tendencias.", 1.1, 6.1, 5.0, 0.45, { fill: C.navy, line: C.navy, color: C.white, fontSize: 9.8 });
  box(slide, "Supervisión: validar negocios, atender reportes y destacar tiendas.", 7.5, 6.1, 4.9, 0.45, { fill: C.navy, line: C.navy, color: C.white, fontSize: 9.8 });
}

pptx.writeFile({ fileName: "/Users/geraldinegarciaverduzco/Desktop/hackaher/Ctrl-She/docs/diagrama-flujo-ctrl-she.pptx" });

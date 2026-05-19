from PIL import Image, ImageDraw, ImageFont
import os
import textwrap
import math

OUT = "/Users/geraldinegarciaverduzco/Desktop/hackaher/Ctrl-She/docs/diagrama-flujo-ctrl-she.png"
W, H = 2400, 3000

C = {
    "bg": "#F8FAFC",
    "white": "#FFFFFF",
    "navy": "#0F172A",
    "muted": "#64748B",
    "line": "#CBD5E1",
    "blue": "#1D4ED8",
    "purple": "#7C3AED",
    "pink": "#EC4899",
    "green": "#16A34A",
    "amber": "#F59E0B",
    "soft_blue": "#EAF1FF",
    "soft_purple": "#F2ECFF",
    "soft_pink": "#FFF0F8",
    "soft_green": "#EAFBF0",
    "soft_amber": "#FFF7ED",
}

FONT_DIRS = ["/System/Library/Fonts/Supplemental", "/System/Library/Fonts", "/Library/Fonts"]

def find_font(names):
    for d in FONT_DIRS:
        for name in names:
            path = os.path.join(d, name)
            if os.path.exists(path):
                return path
    return None

FONT_REG = find_font(["Arial.ttf", "Helvetica.ttc"])
FONT_BOLD = find_font(["Arial Bold.ttf", "Helvetica.ttc"])

def font(size, bold=False):
    path = FONT_BOLD if bold else FONT_REG
    return ImageFont.truetype(path, size) if path else ImageFont.load_default()

img = Image.new("RGB", (W, H), C["bg"])
draw = ImageDraw.Draw(img)

def centered_text(text, rect, size=30, color=C["navy"], bold=True, spacing=8):
    x1, y1, x2, y2 = rect
    f = font(size, bold)
    max_chars = max(8, int((x2 - x1) / (size * 0.56)))
    lines = []
    for raw in text.split("\n"):
        lines.extend(textwrap.wrap(raw, max_chars, break_long_words=False) or [""])
    dims = [draw.textbbox((0, 0), line, font=f) for line in lines]
    widths = [b[2] - b[0] for b in dims]
    heights = [b[3] - b[1] for b in dims]
    total_h = sum(heights) + spacing * (len(lines) - 1)
    y = y1 + (y2 - y1 - total_h) / 2
    for i, line in enumerate(lines):
        x = x1 + (x2 - x1 - widths[i]) / 2
        draw.text((x, y), line, font=f, fill=color)
        y += heights[i] + spacing

def box(text, x, y, w, h, fill=C["white"], outline=C["line"], text_color=C["navy"], size=30, radius=34, bold=True, width=3):
    draw.rounded_rectangle((x, y, x + w, y + h), radius=radius, fill=fill, outline=outline, width=width)
    centered_text(text, (x + 28, y + 18, x + w - 28, y + h - 18), size, text_color, bold)

def decision(text, x, y, w, h, fill=C["soft_amber"], outline=C["amber"], size=27):
    pts = [(x + w / 2, y), (x + w, y + h / 2), (x + w / 2, y + h), (x, y + h / 2)]
    draw.polygon(pts, fill=fill)
    draw.line(pts + [pts[0]], fill=outline, width=4)
    centered_text(text, (x + 70, y + 32, x + w - 70, y + h - 32), size, C["navy"], True)

def arrow(x1, y1, x2, y2, color=C["line"], width=5, label=None):
    draw.line((x1, y1, x2, y2), fill=color, width=width)
    ang = math.atan2(y2 - y1, x2 - x1)
    l = 24
    a = 0.55
    p1 = (x2 - l * math.cos(ang - a), y2 - l * math.sin(ang - a))
    p2 = (x2 - l * math.cos(ang + a), y2 - l * math.sin(ang + a))
    draw.polygon([(x2, y2), p1, p2], fill=color)
    if label:
        f = font(24, True)
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        tw = draw.textbbox((0, 0), label, font=f)[2]
        draw.rounded_rectangle((mx - tw / 2 - 16, my - 22, mx + tw / 2 + 16, my + 22), radius=18, fill=C["bg"])
        draw.text((mx - tw / 2, my - 15), label, font=f, fill=C["muted"])

def header():
    draw.text((110, 90), "DIAGRAMA DE FLUJO", font=font(34, True), fill=C["purple"])
    draw.text((110, 145), "Ctrl + She", font=font(86, True), fill=C["navy"])
    draw.text((110, 252), "Navegación y operación de la plataforma por rol", font=font(38, False), fill=C["muted"])
    box("Roles conectados por exploración, compra,\ngestión, reseñas y señales IA.", 1550, 110, 720, 120, fill=C["white"], outline=C["line"], size=28)

def section_title(text, x, y, color):
    draw.text((x, y), text, font=font(44, True), fill=color)

header()

# Access flow
box("Inicio", 140, 405, 240, 90, fill=C["navy"], outline=C["navy"], text_color=C["white"], size=32)
box("Pantalla de acceso", 520, 405, 390, 90, size=31)
decision("Seleccionar\nforma de entrada", 1065, 365, 300, 170, size=28)
box("Explorar como\nvisitante", 1510, 325, 330, 95, fill=C["soft_blue"], outline="#B9CFFF", text_color=C["blue"], size=29)
box("Iniciar sesión\no registrarse", 1510, 480, 330, 95, fill=C["soft_purple"], outline="#D9C7FF", text_color=C["purple"], size=29)
decision("Seleccionar rol", 1990, 390, 280, 145, size=29)
arrow(380, 450, 520, 450)
arrow(910, 450, 1065, 450)
arrow(1365, 430, 1510, 372)
arrow(1365, 472, 1510, 528)
arrow(1840, 528, 1990, 462)

# Columns
col_y = 720
col_h = 2100
cols = [
    ("Cliente / visitante", 110, C["blue"], C["soft_blue"], "#B9CFFF"),
    ("Vendedora", 845, C["purple"], C["soft_purple"], "#D9C7FF"),
    ("Administrador", 1580, C["pink"], C["soft_pink"], "#FFD0EA"),
]
for title, x, color, fill, outline in cols:
    draw.rounded_rectangle((x, col_y, x + 660, col_y + col_h), radius=42, fill=C["white"], outline="#E2E8F0", width=3)
    draw.rounded_rectangle((x + 35, col_y + 34, x + 625, col_y + 105), radius=34, fill=fill, outline=outline, width=2)
    centered_text(title, (x + 45, col_y + 38, x + 615, col_y + 101), size=34, color=color, bold=True)

# Client/visitor flow
x = 160
y = 885
w = 560
h = 88
client_steps = [
    ("Buscar o filtrar negocios", "box"),
    ("Seleccionar tienda", "box"),
    ("Ver tienda pública", "box"),
    ("Consultar productos y servicios", "box"),
    ("¿Desea comprar o reservar?", "decision"),
    ("¿Es vendedora en su propia tienda?", "decision"),
    ("Pantalla de compra", "box_green"),
    ("Capturar datos de solicitud", "box"),
    ("Seleccionar método de pago", "box"),
    ("Confirmar compra", "box_blue"),
    ("Generar comprobante digital", "box"),
    ("Pedido registrado", "box_green"),
    ("Seguimiento del pedido", "box"),
    ("Cliente puede dejar reseña", "box_purple"),
]
prev_mid = None
for i, (text, kind) in enumerate(client_steps):
    yy = y + i * 130
    if kind == "decision":
        decision(text, x + 95, yy - 15, 370, 115, size=24)
        mid_top = (x + 280, yy - 15)
        mid_bot = (x + 280, yy + 100)
    else:
        fill = C["white"]
        outline = C["line"]
        color = C["navy"]
        if kind == "box_green":
            fill, outline, color = C["soft_green"], "#B8E8C6", C["green"]
        if kind == "box_blue":
            fill, outline, color = C["blue"], C["blue"], C["white"]
        if kind == "box_purple":
            fill, outline, color = C["soft_purple"], "#D9C7FF", C["purple"]
        box(text, x, yy, w, h, fill=fill, outline=outline, text_color=color, size=27)
        mid_top = (x + w / 2, yy)
        mid_bot = (x + w / 2, yy + h)
    if prev_mid:
        label = None
        if client_steps[i - 1][0] == "¿Es vendedora en su propia tienda?":
            label = "No"
        arrow(prev_mid[0], prev_mid[1] + 6, mid_top[0], mid_top[1] - 6, label=label)
    prev_mid = mid_bot

box("Compra bloqueada", x + 385, y + 5 * 130 - 8, 250, 66, fill=C["soft_amber"], outline="#FED7AA", text_color="#9A3412", size=23)
arrow(x + 465, y + 5 * 130 + 40, x + 385, y + 5 * 130 + 25, color=C["amber"], label="Sí")

# Seller flow
x = 895
y = 885
seller_steps = [
    ("Panel de vendedora", "box_purple"),
    ("Mi tienda", "box"),
    ("Editar información de tienda", "box"),
    ("Ver tienda pública / compartir", "box"),
    ("Gestionar catálogo", "box"),
    ("Agregar elemento", "box"),
    ("¿Producto o servicio?", "decision"),
    ("Publicar en catálogo", "box_green"),
    ("Pedidos y reservas", "box"),
    ("Actualizar estado del pedido", "box"),
    ("Reseñas recibidas", "box"),
    ("Señales IA", "box_purple"),
]
prev_mid = None
for i, (text, kind) in enumerate(seller_steps):
    yy = y + i * 150
    if kind == "decision":
        decision(text, x + 95, yy - 16, 370, 120, fill=C["soft_purple"], outline="#D9C7FF", size=25)
        mid_top = (x + 280, yy - 16)
        mid_bot = (x + 280, yy + 104)
    else:
        fill, outline, color = C["white"], C["line"], C["navy"]
        if kind == "box_purple":
            fill, outline, color = C["soft_purple"], "#D9C7FF", C["purple"]
        if kind == "box_green":
            fill, outline, color = C["soft_green"], "#B8E8C6", C["green"]
        box(text, x, yy, w, h, fill=fill, outline=outline, text_color=color, size=27)
        mid_top = (x + w / 2, yy)
        mid_bot = (x + w / 2, yy + h)
    if prev_mid:
        arrow(prev_mid[0], prev_mid[1] + 6, mid_top[0], mid_top[1] - 6)
    prev_mid = mid_bot

box("Bajo stock\nAlta visualización\nMejorar descripción\nMejorar imagen\nTendencia detectada", x + 40, 2600, 480, 170, fill=C["navy"], outline=C["navy"], text_color=C["white"], size=21)

# Admin flow
x = 1630
y = 885
admin_steps = [
    ("Panel administrador", "box_pink"),
    ("Resumen general", "box"),
    ("Negocios registrados", "box"),
    ("Revisar negocios", "box"),
    ("Validaciones", "box"),
    ("Aprobar o rechazar validación", "box"),
    ("Reportes", "box"),
    ("Atender reportes", "box"),
    ("Destacados", "box"),
    ("Gestionar negocios destacados", "box_green"),
]
prev_mid = None
for i, (text, kind) in enumerate(admin_steps):
    yy = y + i * 160
    fill, outline, color = C["white"], C["line"], C["navy"]
    if kind == "box_pink":
        fill, outline, color = C["soft_pink"], "#FFD0EA", C["pink"]
    if kind == "box_green":
        fill, outline, color = C["soft_green"], "#B8E8C6", C["green"]
    box(text, x, yy, w, h, fill=fill, outline=outline, text_color=color, size=27)
    mid_top = (x + w / 2, yy)
    mid_bot = (x + w / 2, yy + h)
    if prev_mid:
        arrow(prev_mid[0], prev_mid[1] + 6, mid_top[0], mid_top[1] - 6)
    prev_mid = mid_bot

# Role arrows from top into columns
arrow(2130, 535, 440, col_y, color=C["blue"])
arrow(2130, 535, 1175, col_y, color=C["purple"])
arrow(2130, 535, 1910, col_y, color=C["pink"])
centered_text("Cliente", (318, 650, 562, 698), size=28, color=C["blue"], bold=True)
centered_text("Vendedora", (1038, 650, 1312, 698), size=28, color=C["purple"], bold=True)
centered_text("Administrador", (1742, 650, 2090, 698), size=28, color=C["pink"], bold=True)

img.save(OUT, quality=95)
print(OUT)

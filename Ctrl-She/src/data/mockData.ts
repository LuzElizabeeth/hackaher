import type { Business, Category } from "../types";

export const categories: Category[] = [
  "Artesanías y souvenirs",
  "Moda y accesorios",
  "Belleza y cuidado personal",
  "Servicios creativos",
  "Experiencias turísticas"
];

export const businesses: Business[] = [
  {
    id: "artesanias-lupita",
    name: "Artesanías Lupita",
    owner: "Lupita Hernández",
    category: "Artesanías y souvenirs",
    type: "producto",
    zone: "Mercado 28",
    phone: "9981234567",
    status: "Verificada",
    rating: 4.9,
    visits: 18,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
    description: "Piezas artesanales inspiradas en el Caribe, hechas a mano por talento local de Cancún.",
    items: [
      {
        id: "pulsera-caribe",
        businessId: "artesanias-lupita",
        type: "producto",
        name: "Pulsera Caribe Maya",
        description: "Pulsera artesanal con conchas y tonos del mar Caribe.",
        price: 120,
        stock: 8,
        delivery: "Entrega en punto de venta",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80"
      },
      {
        id: "bolsa-tejida",
        businessId: "artesanias-lupita",
        type: "producto",
        name: "Bolsa tejida",
        description: "Bolsa ligera tejida a mano para paseo o playa.",
        price: 350,
        stock: 4,
        delivery: "Entrega en punto de venta",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80"
      }
    ],
    reviews: [
      { id: "r1", businessId: "artesanias-lupita", author: "Valeria", rating: 5, text: "Excelente atención y productos muy bonitos." },
      { id: "r2", businessId: "artesanias-lupita", author: "Megan", rating: 5, text: "El QR hizo muy sencillo compartir la tienda." }
    ]
  },
  {
    id: "nails-carmen",
    name: "Nails Carmen Studio",
    owner: "Carmen Diaz",
    category: "Belleza y cuidado personal",
    type: "servicio",
    zone: "Centro de Cancún",
    phone: "9987654321",
    status: "Verificada",
    rating: 4.8,
    visits: 12,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80",
    description: "Estudio de belleza con citas ordenadas, anticipos y atención cercana.",
    items: [
      { id: "unas-acrilicas", businessId: "nails-carmen", type: "servicio", name: "Unas acrilicas", description: "Aplicación personalizada con diseño a elegir.", price: 380, duration: "2 horas", schedule: ["10:00", "13:00", "17:00"], locationMode: "Estudio o domicilio cercano", deposit: "30%", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=80" },
      { id: "diseno-cejas", businessId: "nails-carmen", type: "servicio", name: "Diseño de cejas", description: "Perfilado y diseño natural.", price: 180, duration: "45 minutos", schedule: ["11:00", "15:00"], locationMode: "Estudio", deposit: "Opcional", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=80" }
    ],
    reviews: [{ id: "r3", businessId: "nails-carmen", author: "Sofía", rating: 5, text: "Me encantó poder contactar rápido y ver el catálogo." }]
  },
  {
    id: "foto-caribe",
    name: "Foto Caribe",
    owner: "Andrea Solis",
    category: "Servicios creativos",
    type: "servicio",
    zone: "Zona Hotelera",
    phone: "9981112233",
    status: "Pendiente",
    rating: 4.6,
    visits: 9,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    description: "Fotografía para turistas y emprendimientos con entrega digital.",
    items: [
      { id: "sesion-turistica", businessId: "foto-caribe", type: "servicio", name: "Sesión de fotos turística", description: "Fotos profesionales en playas y puntos icónicos.", price: 900, duration: "1 hora", schedule: ["08:00", "16:30"], locationMode: "Zona Hotelera", deposit: "30%", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" },
      { id: "foto-emprendimientos", businessId: "foto-caribe", type: "servicio", name: "Fotografía para emprendimientos", description: "Imágenes para catálogo, redes y tienda digital.", price: 1200, duration: "2 horas", schedule: ["12:00", "18:00"], locationMode: "Locación del cliente", deposit: "40%", image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80" }
    ],
    reviews: [{ id: "r4", businessId: "foto-caribe", author: "Camila", rating: 4, text: "Muy buena experiencia, fácil de reservar." }]
  },
  {
    id: "experiencia-maya",
    name: "Experiencia Maya Local",
    owner: "Ixchel Canul",
    category: "Experiencias turísticas",
    type: "experiencia",
    zone: "Parque de las Palapas",
    phone: "9982223344",
    status: "Verificada",
    rating: 4.9,
    visits: 20,
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=900&q=80",
    description: "Actividades culturales locales para descubrir Cancún desde sus creadoras.",
    items: [
      { id: "taller-pulseras", businessId: "experiencia-maya", type: "experiencia", name: "Taller de pulseras artesanales", description: "Crea una pieza única con materiales inspirados en el Caribe.", price: 250, duration: "1 hora", capacity: 6, language: "Español / inglés", meetingPoint: "Parque de las Palapas", image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80" },
      { id: "recorrido-cultural", businessId: "experiencia-maya", type: "experiencia", name: "Recorrido cultural local", description: "Ruta guiada por espacios cotidianos y creativos del centro.", price: 400, duration: "2 horas", capacity: 10, language: "Español", meetingPoint: "Fuente principal", image: "https://images.unsplash.com/photo-1533193773788-92826ee86674?auto=format&fit=crop&w=900&q=80" }
    ],
    reviews: [{ id: "r5", businessId: "experiencia-maya", author: "Julia", rating: 5, text: "Muy buena experiencia, fácil de reservar." }]
  },
  {
    id: "brilla-accesorios",
    name: "Brilla Accesorios",
    owner: "Mariana Pérez",
    category: "Moda y accesorios",
    type: "producto",
    zone: "Plaza Las Américas",
    phone: "9983334455",
    status: "Verificada",
    rating: 4.7,
    visits: 15,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    description: "Accesorios con color, identidad local y piezas listas para regalo.",
    items: [
      { id: "aretes-artesanales", businessId: "brilla-accesorios", type: "producto", name: "Aretes artesanales", description: "Aretes ligeros con detalles hechos a mano.", price: 150, stock: 12, delivery: "Entrega en plaza o punto acordado", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80" },
      { id: "collar-piedra", businessId: "brilla-accesorios", type: "producto", name: "Collar con piedra local", description: "Collar con piedra decorativa inspirado en tonos de Cancún.", price: 280, stock: 5, delivery: "Entrega en plaza o punto acordado", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=80" }
    ],
    reviews: [{ id: "r6", businessId: "brilla-accesorios", author: "Natalia", rating: 5, text: "Excelente atención y productos muy bonitos." }]
  },
  {
    id: "deco-eventos-ella",
    name: "Deco Eventos Ella",
    owner: "Sofía Martínez",
    category: "Servicios creativos",
    type: "servicio",
    zone: "Cancún Centro",
    phone: "9984445566",
    status: "Pendiente",
    rating: 4.5,
    visits: 7,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    description: "Decoración para momentos especiales con agenda y reservas claras.",
    items: [
      { id: "deco-cumple", businessId: "deco-eventos-ella", type: "servicio", name: "Decoración para cumpleaños", description: "Montaje con colores, mesa y detalles decorativos.", price: 1500, duration: "3 horas", schedule: ["09:00", "14:00"], locationMode: "A domicilio", deposit: "50%", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80" },
      { id: "deco-propuestas", businessId: "deco-eventos-ella", type: "servicio", name: "Decoración para propuestas", description: "Ambientación romántica para propuestas especiales.", price: 2200, duration: "4 horas", schedule: ["17:00", "19:00"], locationMode: "A domicilio o playa", deposit: "50%", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80" }
    ],
    reviews: [{ id: "r7", businessId: "deco-eventos-ella", author: "Fernanda", rating: 4, text: "Me encantó poder contactar rápido y ver el catálogo." }]
  }
];

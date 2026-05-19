export type BusinessType = "producto" | "servicio" | "experiencia";
export type ValidationStatus = "Verificada" | "Pendiente" | "Rechazada";
export type Category =
  | "Artesanías y souvenirs"
  | "Moda y accesorios"
  | "Belleza y cuidado personal"
  | "Servicios creativos"
  | "Experiencias turísticas";

export interface CatalogItem {
  id: string;
  businessId: string;
  type: BusinessType;
  name: string;
  description: string;
  price: number;
  image: string;
  stock?: number;
  delivery?: string;
  duration?: string;
  schedule?: string[];
  locationMode?: string;
  deposit?: string;
  capacity?: number;
  language?: string;
  meetingPoint?: string;
}

export interface Review {
  id: string;
  businessId: string;
  author: string;
  rating: number;
  text: string;
}

export interface Business {
  id: string;
  name: string;
  owner: string;
  category: Category;
  type: BusinessType;
  zone: string;
  hours?: string;
  phone: string;
  status: ValidationStatus;
  rating: number;
  description: string;
  image: string;
  visits: number;
  items: CatalogItem[];
  reviews: Review[];
}

export type OrderStatus =
  | "Solicitado"
  | "Confirmado"
  | "En proceso"
  | "Listo / reservado"
  | "Entregado / realizado"
  | "Cancelado";

export interface Order {
  folio: string;
  businessId: string;
  itemId: string;
  itemName: string;
  businessName: string;
  amount: number;
  quantity: number;
  customerName: string;
  contact: string;
  date: string;
  deliveryMode: string;
  paymentMethod: string;
  needsReceipt: boolean;
  status: OrderStatus;
  createdAt: string;
}

export type InvoiceRequest = {
  id: string;
  folio: string;
  businessId: string;
  customerName: string;
  rfc: string;
  email: string;
  amount: number;
  status: "Solicitada" | "En revisión" | "Emitida";
  createdAt: string;
};
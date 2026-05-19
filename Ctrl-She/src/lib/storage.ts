import { businesses } from "../data/mockData";
import type { Business, BusinessType, InvoiceRequest, Order, Review } from "../types";

const keys = {
  businesses: "ctrl-she-businesses",
  orders: "ctrl-she-orders",
  invoices: "ctrl-she-invoices"
};

export function getBusinesses(): Business[] {
  const saved = localStorage.getItem(keys.businesses);
  return saved ? JSON.parse(saved) : businesses;
}

export function saveBusinesses(value: Business[]) {
  localStorage.setItem(keys.businesses, JSON.stringify(value));
}

export function resetDemoData() {
  localStorage.removeItem(keys.businesses);
  localStorage.removeItem(keys.orders);
  localStorage.removeItem(keys.invoices);
}

export function getOrders(): Order[] {
  return JSON.parse(localStorage.getItem(keys.orders) || "[]");
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(keys.orders, JSON.stringify(orders));
}

export function saveOrder(order: Order) {
  localStorage.setItem(keys.orders, JSON.stringify([order, ...getOrders()]));
}

export function updateOrderStatus(folio: string, status: Order["status"]) {
  const updated = getOrders().map((order) => order.folio === folio ? { ...order, status } : order);
  saveOrders(updated);
  return updated;
}

export function addReview(businessId: string, review: Review) {
  const updated = getBusinesses().map((business) =>
    business.id === businessId ? { ...business, reviews: [review, ...business.reviews] } : business
  );
  saveBusinesses(updated);
  return updated.find((business) => business.id === businessId);
}

export function money(value: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);
}

export function makeFolio() {
  const next = getOrders().length + 1;
  return `CTRL-2026-${String(next).padStart(4, "0")}`;
}

export function configureSellerDemoBusiness(type: BusinessType) {
  const sellerBusinessId = "artesanias-lupita";

  const sourceBusiness =
    businesses.find((business) => business.type === type) || businesses[0];

  const demoBusiness: Business = {
    ...sourceBusiness,
    id: sellerBusinessId,
    status: "Verificada",
    items: sourceBusiness.items
      .filter((item) => item.type === type)
      .map((item, index) => ({
        ...item,
        id: `demo-${type}-${index + 1}`,
        businessId: sellerBusinessId,
        type
      })),
    reviews: sourceBusiness.reviews.map((review, index) => ({
      ...review,
      id: `demo-review-${type}-${index + 1}`,
      businessId: sellerBusinessId
    }))
  };

  const remainingBusinesses = getBusinesses().filter(
    (business) => business.id !== sellerBusinessId
  );

  saveBusinesses([demoBusiness, ...remainingBusinesses]);

  localStorage.removeItem(keys.orders);
  localStorage.removeItem(keys.invoices);

  return demoBusiness;
}
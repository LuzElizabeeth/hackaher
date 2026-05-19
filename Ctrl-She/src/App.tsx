import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ClientHomePage from "./pages/ClientHomePage";
import MarketplacePage from "./pages/MarketplacePage";
import StoreProfilePage from "./pages/StoreProfilePage";
import OrderPage from "./pages/OrderPage";
import ReceiptPage from "./pages/ReceiptPage";
import EntrepreneurDashboard from "./pages/EntrepreneurDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LocalRoutePage from "./pages/LocalRoutePage";
import AiPage from "./pages/AiPage";
import LoginPage from "./pages/LoginPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import OrdersManagementPage from "./pages/OrdersManagementPage";
import QRPage from "./pages/QRPage";
import SellerCatalogPage from "./pages/SellerCatalogPage";

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          {/* Landing pública para invitadas/invitados */}
          <Route path="/" element={<LandingPage />} />

          {/* Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Inicio privado del cliente */}
          <Route
            path="/cliente"
            element={
              <ProtectedRoute roles={["cliente"]}>
                <ClientHomePage />
              </ProtectedRoute>
            }
          />

          {/* Vistas del cliente/comprador */}
          <Route path="/explorar" element={<MarketplacePage />} />
          <Route path="/tienda/:id" element={<StoreProfilePage />} />
          <Route path="/pedido" element={<OrderPage />} />
          <Route path="/comprobante/:folio" element={<ReceiptPage />} />
          <Route path="/mis-pedidos" element={<MyOrdersPage />} />
          <Route path="/ruta-local" element={<LocalRoutePage />} />

          {/* Vistas de emprendedora */}
          <Route
            path="/emprendedora"
            element={
              <ProtectedRoute roles={["emprendedora"]}>
                <EntrepreneurDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pedidos"
            element={
              <ProtectedRoute roles={["emprendedora"]}>
                <OrdersManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/qr"
            element={
              <ProtectedRoute roles={["emprendedora"]}>
                <QRPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogo"
            element={
              <ProtectedRoute roles={["emprendedora"]}>
                <SellerCatalogPage />
              </ProtectedRoute>
            }
          />

          {/* Vistas de administración */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/validaciones"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reportes"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/negocios"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/destacados"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/metricas"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* IA solo para emprendedora/admin */}
          <Route
            path="/ia"
            element={
              <ProtectedRoute roles={["emprendedora", "admin"]}>
                <AiPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta no encontrada */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="footer">
        Ctrl + She · Controla, conecta y crece.
      </footer>
    </>
  );
}
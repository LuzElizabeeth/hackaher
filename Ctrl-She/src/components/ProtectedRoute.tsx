import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth, type UserRole } from "../auth/AuthContext";

export default function ProtectedRoute({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { role, isAuthenticated } = useAuth();
  if (role && roles.includes(role)) return <>{children}</>;
  return (
    <div className="page narrow">
      <section className="access-card card">
        <span className="badge pending">Acceso restringido</span>
        <h1>No tienes acceso a esta seccion</h1>
        <p>{isAuthenticated ? "Tu rol actual no tiene permiso para entrar aqui." : "Inicia sesion con una cuenta demo para continuar."}</p>
        <div className="cta-row">
          <Link className="btn primary" to="/login">Iniciar sesion</Link>
          <Link className="btn outline" to="/">Volver al inicio</Link>
        </div>
      </section>
    </div>
  );
}

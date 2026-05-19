import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

type NavItem = [label: string, href: string];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { role, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const links: NavItem[] = role === "cliente"
    ? [
        ["Inicio", "/cliente"],
        ["Explorar", "/explorar"],
        ["Ruta local", "/ruta-local"],
        ["Mis pedidos", "/mis-pedidos"]
      ]
          : role === "emprendedora"
        ? [
            ["Mi tienda", "/emprendedora"],
            ["Catálogo", "/catalogo"],
            ["Pedidos", "/pedidos"],
            ["IA comercial", "/ia"],
            ["QR", "/qr"]
          ]
            : role === "admin"
        ? [
            ["Panel admin", "/admin"],
            ["Validaciones", "/validaciones"],
            ["Reportes", "/reportes"],
            ["Negocios", "/negocios"],
            ["Destacados", "/destacados"]
          ]
        : [
            ["Inicio", "/"],
            ["Explorar", "/explorar"],
            ["Ruta local", "/ruta-local"],
            ["Iniciar sesión", "/login"]
          ];

  const brandTarget =
  role === "cliente" ? "/cliente" :
  role === "admin" ? "/admin" :
  "/";

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link className="brand" to={brandTarget} onClick={() => setOpen(false)}>
        <span className="brand-mark">
          <img src="/logo.png" alt="Ctrl + She" />
        </span>
        Ctrl + She
      </Link>

      <button
        className="icon-button mobile-only"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Abrir menú"
      >
        <Menu />
      </button>

      <nav className={open ? "nav-links open" : "nav-links"}>
        {links.map(([label, href]) => (
          <NavLink key={href} to={href} onClick={() => setOpen(false)}>
            {label}
          </NavLink>
        ))}

        {currentUser && (
          <button
            className="nav-logout"
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        )}
      </nav>
    </header>
  );
}

import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { UserRole } from "../auth/AuthContext";
import type { BusinessType } from "../types";
import { configureSellerDemoBusiness } from "../lib/storage";
import "../styles/auth-flow.css";

const redirectByRole: Record<UserRole, string> = {
  cliente: "/cliente",
  emprendedora: "/emprendedora",
  admin: "/admin"
};

const businessTypeOptions: Array<{
  value: BusinessType;
  title: string;
  description: string;
}> = [
  {
    value: "producto",
    title: "Producto físico",
    description: "Artesanías, accesorios, ropa, regalos o productos con stock."
  },
  {
    value: "servicio",
    title: "Servicio personal",
    description: "Belleza, fotografía, decoración, asesorías o citas."
  },
  {
    value: "experiencia",
    title: "Experiencia turística",
    description: "Talleres, recorridos, actividades culturales o cupos."
  }
];

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] =
    useState<Exclude<UserRole, "admin">>("cliente");

  const [businessType, setBusinessType] = useState<BusinessType>("producto");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (mode === "register") {
      if (selectedRole === "emprendedora") {
        configureSellerDemoBusiness(businessType);
      }

      const user = register(
        email || `demo-${selectedRole}-${Date.now()}@ctrlshe.local`,
        password || "demo123",
        selectedRole
      );

      navigate(redirectByRole[user.role]);
      return;
    }

    const user = login(email, password, selectedRole);
    navigate(redirectByRole[user.role]);
  };

  const startSellerDemo = (type: BusinessType) => {
    configureSellerDemoBusiness(type);

    const user = register(
      `demo-${type}-${Date.now()}@ctrlshe.local`,
      "demo123",
      "emprendedora"
    );

    navigate(redirectByRole[user.role]);
  };

  return (
    <div className="page login-page">
      <section className="login-card card">
        <div className="login-brand">
          <span className="login-logo-mark">
            <img src="/logo.png" alt="Ctrl + She" />
          </span>

          <h1>Ctrl + She</h1>

          <p>
            {mode === "login"
              ? "Inicia sesión para continuar"
              : "Crea tu cuenta demo"}
          </p>
        </div>

        <div className="auth-tabs" aria-label="Seleccionar acceso">
          <button
            type="button"
            className={mode === "login" ? "chip active" : "chip"}
            onClick={() => setMode("login")}
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            className={mode === "register" ? "chip active" : "chip"}
            onClick={() => setMode("register")}
          >
            Registrarte
          </button>
        </div>

        <form className="form" onSubmit={submit}>
          <label htmlFor="email">
            Correo
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Opcional para demo"
            />
          </label>

          <label htmlFor="password">
            Contraseña
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Opcional para demo"
            />
          </label>

          <fieldset className="role-field">
            <legend>
              {mode === "login"
                ? "¿Cómo quieres entrar?"
                : "¿Qué tipo de cuenta quieres crear?"}
            </legend>

            <div className="role-choice">
              <button
                type="button"
                className={selectedRole === "emprendedora" ? "chip active" : "chip"}
                onClick={() => setSelectedRole("emprendedora")}
              >
                Soy vendedora
              </button>

              <button
                type="button"
                className={selectedRole === "cliente" ? "chip active" : "chip"}
                onClick={() => setSelectedRole("cliente")}
              >
                Soy cliente
              </button>
            </div>
          </fieldset>

          {mode === "register" && selectedRole === "emprendedora" && (
            <section className="auth-demo-flow">
              <div>
                <h3>Tipo de negocio</h3>
                <p>
                  Para la exposición puedes elegir el tipo de tienda sin capturar
                  datos reales. Esto define qué podrá administrar después en Catálogo.
                </p>
              </div>

              <div className="auth-business-type-grid">
                {businessTypeOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={
                      businessType === option.value
                        ? "auth-business-type-card active"
                        : "auth-business-type-card"
                    }
                    onClick={() => setBusinessType(option.value)}
                  >
                    <b>{option.title}</b>
                    <span>{option.description}</span>
                  </button>
                ))}
              </div>

              <div className="auth-demo-note">
                Selección actual:{" "}
                {
                  businessTypeOptions.find((option) => option.value === businessType)
                    ?.title
                }
              </div>

              <button
                className="btn primary full"
                type="button"
                onClick={() => startSellerDemo(businessType)}
              >
                Entrar a demo como vendedora
              </button>
            </section>
          )}

          <button className="btn primary full" type="submit">
            {mode === "login" ? "Iniciar sesión" : "Registrarme"}
          </button>

          <Link className="btn outline full" to="/explorar">
            Explorar como visitante
          </Link>
        </form>
      </section>
    </div>
  );
}
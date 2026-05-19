import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type UserRole = "cliente" | "emprendedora" | "admin";

export interface DemoUser {
  email: string;
  name: string;
  role: UserRole;
}

const demoUsers: Array<DemoUser & { password: string }> = [
  { email: "cliente@ctrlshe.demo", password: "demo123", name: "Cliente turista", role: "cliente" },
  { email: "lupita@ctrlshe.demo", password: "demo123", name: "Lupita Hernandez", role: "emprendedora" },
  { email: "admin@ctrlshe.demo", password: "demo123", name: "Admin Ctrl + She", role: "admin" }
];

interface AuthContextValue {
  currentUser: DemoUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string, role?: Exclude<UserRole, "admin">) => DemoUser;
  register: (email: string, password: string, role: Exclude<UserRole, "admin">) => DemoUser;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const sessionKey = "ctrl-she-session";
const usersKey = "ctrl-she-users";
const adminEmail = "adminCtrlShe@gmail.com";
const adminPassword = "Ctrl+She";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function fallbackEmail(email: string) {
  return email.trim() || `invitada-${Date.now()}@ctrlshe.local`;
}

function getSavedUsers() {
  const saved = localStorage.getItem(usersKey);
  return saved ? JSON.parse(saved) as DemoUser[] : [];
}

function saveUser(user: DemoUser) {
  const users = getSavedUsers();
  const nextUsers = [
    ...users.filter((savedUser) => normalizeEmail(savedUser.email) !== normalizeEmail(user.email)),
    user
  ];
  localStorage.setItem(usersKey, JSON.stringify(nextUsers));
}

function startSession(user: DemoUser, setCurrentUser: (user: DemoUser) => void) {
  localStorage.setItem(sessionKey, JSON.stringify(user));
  setCurrentUser(user);
  return user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(() => {
    const saved = localStorage.getItem(sessionKey);
    return saved ? JSON.parse(saved) : null;
  });

  const value = useMemo<AuthContextValue>(() => ({
    currentUser,
    isAuthenticated: Boolean(currentUser),
    role: currentUser?.role || null,
    login(email, password, role = "cliente") {
      if (normalizeEmail(email) === normalizeEmail(adminEmail) && password === adminPassword) {
        return startSession({ email: adminEmail, name: "Admin Ctrl + She", role: "admin" }, setCurrentUser);
      }

      const savedUser = getSavedUsers().find((user) => normalizeEmail(user.email) === normalizeEmail(email));
      if (savedUser) return startSession(savedUser, setCurrentUser);

      const demoUser = demoUsers.find((user) => normalizeEmail(user.email) === normalizeEmail(email));
      if (demoUser) return startSession({ email: demoUser.email, name: demoUser.name, role: demoUser.role }, setCurrentUser);

      return startSession({
        email: fallbackEmail(email),
        name: role === "emprendedora" ? "Vendedora Ctrl + She" : "Cliente Ctrl + She",
        role
      }, setCurrentUser);
    },
    register(email, _password, role) {
      const user = {
        email: fallbackEmail(email),
        name: role === "emprendedora" ? "Vendedora Ctrl + She" : "Cliente Ctrl + She",
        role
      };
      saveUser(user);
      return startSession(user, setCurrentUser);
    },
    logout() {
      localStorage.removeItem(sessionKey);
      setCurrentUser(null);
    }
  }), [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}

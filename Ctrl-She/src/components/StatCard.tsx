import type { ReactNode } from "react";

export default function StatCard({ label, value, tone = "info", icon }: { label: string; value: string | number; tone?: string; icon?: ReactNode }) {
  return (
    <article className={`stat-card ${tone}`}>
      <span>{icon}</span>
      <strong>{value}</strong>
      <p>{label}</p>
    </article>
  );
}

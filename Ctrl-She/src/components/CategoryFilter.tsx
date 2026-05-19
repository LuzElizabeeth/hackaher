import { categories } from "../data/mockData";
import type { Category } from "../types";

export default function CategoryFilter({ value, onChange }: { value: Category | "Todas"; onChange: (value: Category | "Todas") => void }) {
  return (
    <div className="filter-row">
      {(["Todas", ...categories] as Array<Category | "Todas">).map((category) => (
        <button key={category} className={value === category ? "chip active" : "chip"} onClick={() => onChange(category)}>
          {category}
        </button>
      ))}
    </div>
  );
}

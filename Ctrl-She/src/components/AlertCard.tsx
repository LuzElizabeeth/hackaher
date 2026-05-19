export default function AlertCard({ tone, text }: { tone: "info" | "success" | "pending" | "ai" | "admin"; text: string }) {
  return <div className={`alert ${tone}`}>{text}</div>;
}

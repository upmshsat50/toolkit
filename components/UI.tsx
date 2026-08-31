import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icons";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

export function StatCard({ label, value, note, icon, tone = "neutral" }: { label: string; value: string | number; note?: string; icon: string; tone?: "neutral" | "maroon" | "green" | "gold" }) {
  return <div className={`stat-card tone-${tone}`}><div className="stat-icon"><Icon name={icon} /></div><div><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div></div>;
}

export function StatusBadge({ status }: { status: string }) {
  const cls = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="empty-state"><Icon name="folder"/><strong>{title}</strong><span>{text}</span></div>;
}

export function SectionTitle({ title, actionHref, actionLabel }: { title: string; actionHref?: string; actionLabel?: string }) {
  return <div className="section-title"><h2>{title}</h2>{actionHref && <Link href={actionHref}>{actionLabel ?? "View all"} <Icon name="arrow"/></Link>}</div>;
}

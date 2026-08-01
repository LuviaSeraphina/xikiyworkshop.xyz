import type { ReactNode } from "react";

export function PanelCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="hand-card-tight p-6">
      <h2 className="font-hand text-3xl leading-none">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-muted">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border-2 border-line bg-cream px-3 py-2 text-sm outline-none transition focus:border-orange";

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn-ink h-10 px-4 text-sm ${className}`}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-xl border-2 border-berry/60 px-4 text-sm font-medium text-berry transition hover:bg-berry/10 ${className}`}
    >
      {children}
    </button>
  );
}

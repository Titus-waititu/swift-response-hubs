import type { LucideIcon } from "lucide-react";

export function TopSignalCard({
  label,
  value,
  caption,
  icon: Icon,
  iconColor,
}: {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/55 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 font-mono text-3xl font-black text-foreground">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background/70">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{caption}</p>
    </div>
  );
}

export function AccessSignal({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/75 p-4 backdrop-blur-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-secondary/80">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

export function SignalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-secondary/55 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

export function FocusRow({
  title,
  value,
  helper,
}: {
  title: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="font-mono text-lg font-black text-foreground">{value}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{helper}</p>
    </div>
  );
}

export function MetricStrip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-mono text-base font-semibold text-foreground">{value}</span>
      </div>
    </div>
  );
}

export function InfoChip({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/65 px-3 py-1.5 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span>{label}</span>
    </div>
  );
}

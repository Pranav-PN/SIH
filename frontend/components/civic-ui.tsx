import { cn } from '@/lib/utils'

/* ---------- Card ---------- */
export function Card({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5 shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ---------- Section heading ---------- */
export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2 className={cn('text-base font-semibold text-foreground', className)}>
      {children}
    </h2>
  )
}

/* ---------- Severity badge ---------- */
export type Severity = 'HIGH' | 'MEDIUM' | 'LOW'

const severityStyles: Record<Severity, string> = {
  HIGH: 'bg-status-red-bg text-status-red border-status-red/30',
  MEDIUM: 'bg-status-amber-bg text-status-amber border-status-amber/30',
  LOW: 'bg-muted text-muted-foreground border-border',
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide',
        severityStyles[severity],
      )}
    >
      {severity}
    </span>
  )
}

/* ---------- Status dot ---------- */
export type StatusTone = 'green' | 'amber' | 'red'

const dotColor: Record<StatusTone, string> = {
  green: 'bg-status-green',
  amber: 'bg-status-amber',
  red: 'bg-status-red',
}

export function StatusDot({ tone }: { tone: StatusTone }) {
  return (
    <span
      className={cn('inline-block size-2.5 rounded-full', dotColor[tone])}
      aria-hidden
    />
  )
}

/* ---------- Indicator chip ---------- */
export function IndicatorChip({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  value: string
  tone?: 'up' | 'down' | 'neutral'
}) {
  const toneClass =
    tone === 'up'
      ? 'text-status-red'
      : tone === 'down'
        ? 'text-status-green'
        : 'text-foreground'
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-semibold', toneClass)}>{value}</span>
    </span>
  )
}

/* ---------- Confidence badge ---------- */
export function ConfidenceBadge({ level }: { level: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
      Confidence: {level}
    </span>
  )
}

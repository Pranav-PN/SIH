'use client'

import { useEffect, useState } from 'react'
import { ArrowDownRight, Lightbulb, Loader2 } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, SectionTitle } from '@/components/civic-ui'
import { api } from '@/lib/api'

type ImpactMetric = {
  label: string
  before: number
  after: number
  tone: 'green' | 'amber'
}

type ImpactTrackerResponse = {
  metrics: ImpactMetric[]
  chart: Array<{ metric: string; Before: number; After: number }>
  aiInterpretation: string
}

const toneStyles = {
  green: { text: 'text-status-green', bg: 'bg-status-green-bg', border: 'border-status-green/30' },
  amber: { text: 'text-status-amber', bg: 'bg-status-amber-bg', border: 'border-status-amber/30' },
}

export function ImpactTracker() {
  const [data, setData] = useState<ImpactTrackerResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadImpact() {
      try {
        const response = await api.get<ImpactTrackerResponse>('/api/impact-tracker')
        setData(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load impact data')
      } finally {
        setLoading(false)
      }
    }

    loadImpact()
  }, [])

  if (loading) {
    return (
      <Card className="flex items-center gap-3">
        <Loader2 className="size-5 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading impact tracker...</p>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="border-status-red/30 bg-status-red-bg">
        <p className="font-semibold text-status-red">Impact data unavailable</p>
        <p className="mt-1 text-sm text-foreground">{error ?? 'No data returned.'}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <SectionTitle>Outcome Verification</SectionTitle>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {data.metrics.map((m) => {
          const s = toneStyles[m.tone]
          return (
            <Card key={m.label}>
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-2xl font-semibold text-muted-foreground line-through decoration-1">{m.before}%</span>
                <ArrowDownRight className={`size-5 ${s.text}`} />
                <span className={`text-3xl font-semibold ${s.text}`}>{m.after}%</span>
              </div>
              <span className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text} ${s.border}`}>
                {m.tone === 'green' ? 'Improved outcome' : 'Framed positively'}
              </span>
            </Card>
          )
        })}
      </div>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-foreground">Before vs After — Intervention Comparison</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.chart} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="metric" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} unit="%" />
              <Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Bar dataKey="Before" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="After" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-chart-5" /> Before</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-chart-1" /> After</span>
        </div>
      </Card>

      <div className="rounded-xl border border-primary/30 bg-accent p-5">
        <div className="flex items-start gap-3">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">AI Interpretation</p>
            <p className="mt-1 text-sm text-foreground">{data.aiInterpretation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

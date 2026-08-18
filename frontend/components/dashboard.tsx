'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  EyeOff,
  Flame,
  FileText,
  Activity,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, StatusDot, type StatusTone } from '@/components/civic-ui'
import { api } from '@/lib/api'

type DashboardResponse = {
  summaryCards: Array<{ label: string; value: string; tone: string; icon?: string }>
  kpis: Array<{ label: string; value: string; tone: StatusTone }>
  trendData: Array<{ month: string; resolutionRate: number; repeatComplaints: number }>
  alert: { title: string; description: string }
}

const iconMap = {
  EyeOff,
  Flame,
  FileText,
  Activity,
}

const statTone: Record<string, string> = {
  blue: 'bg-accent text-primary',
  red: 'bg-status-red-bg text-status-red',
  amber: 'bg-status-amber-bg text-status-amber',
}

export function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        const response = await api.get<DashboardResponse>('/api/dashboard')
        setData(response)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <Card className="flex items-center gap-3">
        <Loader2 className="size-5 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="border-status-red/30 bg-status-red-bg">
        <p className="font-semibold text-status-red">Dashboard unavailable</p>
        <p className="mt-1 text-sm text-foreground">{error ?? 'No data returned by the backend.'}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.summaryCards.map((stat) => {
          const Icon = iconMap[(stat.icon as keyof typeof iconMap) ?? 'EyeOff'] ?? EyeOff
          return (
            <Card key={stat.label} className="flex items-center gap-4">
              <div className={`flex size-11 items-center justify-center rounded-lg ${statTone[stat.tone] ?? statTone.blue}`}>
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <Card key={kpi.label} className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{kpi.value}</p>
            </div>
            <StatusDot tone={kpi.tone} />
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-1 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Resolution Rate vs Repeat Complaints
            </h2>
            <p className="text-sm text-muted-foreground">Rolling 6-month trend</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-chart-1" /> Resolution Rate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-chart-2" /> Repeat Complaints
            </span>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trendData} margin={{ top: 16, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ display: 'none' }} />
              <Line type="monotone" dataKey="resolutionRate" name="Resolution Rate" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="repeatComplaints" name="Repeat Complaints" stroke="var(--chart-2)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-status-amber/30 bg-status-amber-bg p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-status-amber" />
          <div>
            <p className="font-semibold text-foreground">{data.alert.title}</p>
            <p className="text-sm text-muted-foreground">{data.alert.description}</p>
          </div>
        </div>
        <Link href="/blind-spots" className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          View Details
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}

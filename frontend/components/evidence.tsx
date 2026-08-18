'use client'

import { useEffect, useState } from 'react'
import { Gauge, MessageSquare, Cog, Archive, BadgeCheck, Loader2 } from 'lucide-react'
import { Card } from '@/components/civic-ui'
import { api } from '@/lib/api'

type EvidenceItem = {
  id: string
  title: string
  detail: string
  source: string
}

const iconMap = {
  kpi: Gauge,
  citizen: MessageSquare,
  operational: Cog,
  historical: Archive,
}

export function Evidence() {
  const [items, setItems] = useState<EvidenceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEvidence() {
      try {
        const data = await api.get<EvidenceItem[]>('/api/evidence')
        setItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load evidence chain')
      } finally {
        setLoading(false)
      }
    }

    loadEvidence()
  }, [])

  if (loading) {
    return (
      <Card className="flex items-center gap-3">
        <Loader2 className="size-5 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading evidence chain...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-status-red/30 bg-status-red-bg">
        <p className="font-semibold text-status-red">Evidence chain unavailable</p>
        <p className="mt-1 text-sm text-foreground">{error}</p>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ol className="relative space-y-4 border-l border-border pl-6">
        {items.map((item) => {
          const Icon = iconMap[item.id as keyof typeof iconMap] ?? Gauge
          return (
            <li key={item.id} className="relative">
              <span className="absolute -left-[35px] flex size-6 items-center justify-center rounded-full border border-border bg-card">
                <span className="size-2.5 rounded-full bg-primary" />
              </span>
              <Card className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                  <p className="mt-1 text-sm text-foreground">
                    <span className="text-muted-foreground">Source:</span> {item.source}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-status-green/30 bg-status-green-bg px-2.5 py-1 text-xs font-medium text-status-green">
                    <BadgeCheck className="size-3.5" />
                    Data verified: synthetic prototype dataset
                  </span>
                </div>
              </Card>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

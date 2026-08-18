'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Users, ArrowRight, Loader2 } from 'lucide-react'
import {
  Card,
  SeverityBadge,
  IndicatorChip,
  type Severity,
} from '@/components/civic-ui'
import { api } from '@/lib/api'

type BlindSpot = {
  id: string
  title: string
  severity: Severity
  evidenceStrength: string
  affected: string
  indicators: { label: string; value: string; tone: 'up' | 'down' | 'neutral' }[]
  explanation: string
  defaultExpanded: boolean
}

function BlindSpotCard({ spot }: { spot: BlindSpot }) {
  const [expanded, setExpanded] = useState(spot.defaultExpanded)

  return (
    <Card className="p-0">
      <button onClick={() => setExpanded((v) => !v)} className="flex w-full items-start justify-between gap-4 p-5 text-left">
        <div className="flex items-start gap-3">
          <SeverityBadge severity={spot.severity} />
          <div>
            <p className="font-semibold text-foreground">{spot.title}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="size-3.5" />
              Affected population: {spot.affected}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="size-5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-5 shrink-0 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-border p-5">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              Evidence Strength:{' '}
              <span className="font-semibold text-foreground">{spot.evidenceStrength}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {spot.indicators.map((ind) => (
              <IndicatorChip key={ind.label} label={ind.label} value={ind.value} tone={ind.tone as 'up' | 'down' | 'neutral'} />
            ))}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Potential explanation</p>
            <p className="mt-1 text-sm text-foreground">{spot.explanation}</p>
          </div>

          <Link href="/investigations" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            View Investigation
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </Card>
  )
}

export function BlindSpots() {
  const [spots, setSpots] = useState<BlindSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSpots() {
      try {
        const data = await api.get<BlindSpot[]>('/api/blind-spots')
        setSpots(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load blind spots')
      } finally {
        setLoading(false)
      }
    }

    loadSpots()
  }, [])

  if (loading) {
    return (
      <Card className="flex items-center gap-3">
        <Loader2 className="size-5 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading blind spots...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-status-red/30 bg-status-red-bg">
        <p className="font-semibold text-status-red">Unable to load blind spots</p>
        <p className="mt-1 text-sm text-foreground">{error}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {spots.map((spot) => (
        <BlindSpotCard key={spot.id} spot={spot} />
      ))}
    </div>
  )
}

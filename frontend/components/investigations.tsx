'use client'

import { useEffect, useState } from 'react'
import { Square, AlertTriangle, Check, Pencil, X, Loader2 } from 'lucide-react'
import { Card, SectionTitle, SeverityBadge } from '@/components/civic-ui'
import { api } from '@/lib/api'

type InvestigationResponse = {
  id: string
  title: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  hypotheses: Array<{ label: string; confidence: number }>
  evidenceGaps: string[]
  brief: {
    problem: string
    observedContradiction: string
    evidence: string
    possibleHypotheses: string
    uncertainty: string
    affectedGroups: string
    additionalEvidenceRequired: string
    recommendedInvestigationSteps: string
  }
}

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  )
}

export function Investigations() {
  const [investigation, setInvestigation] = useState<InvestigationResponse | null>(null)
  const [decision, setDecision] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadInvestigation() {
      try {
        const data = await api.get<InvestigationResponse[]>('/api/investigations')
        if (data.length > 0) setInvestigation(data[0])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load investigation')
      } finally {
        setLoading(false)
      }
    }

    loadInvestigation()
  }, [])

  async function submitDecision(nextDecision: 'accept' | 'modify' | 'reject') {
    if (!investigation) return
    try {
      const response = await api.post<{ decision: string }>(`/api/investigations/${investigation.id}/review`, { decision: nextDecision })
      setDecision(response.decision)
    } catch (err) {
      setDecision(err instanceof Error ? err.message : 'Decision failed')
    }
  }

  if (loading) {
    return (
      <Card className="flex items-center gap-3">
        <Loader2 className="size-5 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading investigation...</p>
      </Card>
    )
  }

  if (error || !investigation) {
    return (
      <Card className="border-status-red/30 bg-status-red-bg">
        <p className="font-semibold text-status-red">Investigation unavailable</p>
        <p className="mt-1 text-sm text-foreground">{error ?? 'No investigation data returned.'}</p>
      </Card>
    )
  }

  const briefFields = [
    { label: 'Problem', value: investigation.brief.problem },
    { label: 'Observed Contradiction', value: investigation.brief.observedContradiction },
    { label: 'Evidence', value: investigation.brief.evidence },
    { label: 'Possible Hypotheses', value: investigation.brief.possibleHypotheses },
    { label: 'Uncertainty', value: investigation.brief.uncertainty },
    { label: 'Affected Groups', value: investigation.brief.affectedGroups },
    { label: 'Additional Evidence Required', value: investigation.brief.additionalEvidenceRequired },
    { label: 'Recommended Investigation Steps', value: investigation.brief.recommendedInvestigationSteps },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <SeverityBadge severity={investigation.severity} />
        <h2 className="text-lg font-semibold text-foreground">{investigation.title}</h2>
      </div>

      <Card className="space-y-4">
        <SectionTitle>Root-Cause Hypotheses</SectionTitle>
        <div className="space-y-4">
          {investigation.hypotheses.map((h) => (
            <div key={h.label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{h.label}</p>
                <span className="text-sm font-semibold text-foreground">{h.confidence}%</span>
              </div>
              <ConfidenceBar value={h.confidence} />
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Hypothesis — Not Confirmed</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-status-amber/30 bg-status-amber-bg">
        <SectionTitle className="text-foreground">Insufficient evidence to determine root cause with certainty</SectionTitle>
        <p className="mt-2 text-sm font-medium text-muted-foreground">Additional evidence required:</p>
        <ul className="mt-3 space-y-2">
          {investigation.evidenceGaps.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-foreground">
              <Square className="size-4 text-muted-foreground" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-5">
        <SectionTitle>Investigation Brief</SectionTitle>
        <div className="divide-y divide-border">
          {briefFields.map((field) => (
            <div key={field.label} className="grid gap-1 py-3 sm:grid-cols-[200px_1fr] sm:gap-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{field.label}</p>
              <p className="text-sm text-foreground">{field.value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle>Human Review Required</SectionTitle>
        <div className="flex items-start gap-3 rounded-lg border border-status-amber/30 bg-status-amber-bg p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-status-amber" />
          <p className="text-sm text-foreground">This is an AI-generated investigation brief. It does not constitute a final decision.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => submitDecision('accept')} className="inline-flex items-center gap-2 rounded-md bg-status-green px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
            <Check className="size-4" />
            Accept Investigation
          </button>
          <button onClick={() => submitDecision('modify')} className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <Pencil className="size-4" />
            Modify
          </button>
          <button onClick={() => submitDecision('reject')} className="inline-flex items-center gap-2 rounded-md border border-status-red/40 bg-card px-4 py-2 text-sm font-medium text-status-red transition-colors hover:bg-status-red-bg">
            <X className="size-4" />
            Reject
          </button>
        </div>

        {decision && (
          <p className="rounded-md border border-border bg-muted px-4 py-2.5 text-sm text-foreground">{decision}</p>
        )}
      </Card>
    </div>
  )
}

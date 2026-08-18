'use client'

import { useState } from 'react'
import { Play, Loader2, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react'
import { Card, ConfidenceBadge } from '@/components/civic-ui'
import { api } from '@/lib/api'

type RealityCheckResponse = {
  kpiAnalyzed: string
  contradictingSignals: string[]
  finding: string
  confidence: string
  requires_investigation: boolean
  evidence_strength?: string
}

export function RealityCheck() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [result, setResult] = useState<RealityCheckResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function runCheck() {
    setStatus('loading')
    setError(null)

    try {
      const response = await api.post<RealityCheckResponse>('/api/reality-check', {})
      setResult(response)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reality check failed')
      setStatus('idle')
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        onClick={runCheck}
        disabled={status === 'loading'}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {status === 'loading' ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Play className="size-4" />
        )}
        RUN REALITY CHECK
      </button>

      {status === 'loading' && (
        <Card className="flex items-center gap-3">
          <Loader2 className="size-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Analyzing KPI, citizen, and operational signals...</p>
        </Card>
      )}

      {error && (
        <Card className="border-status-red/30 bg-status-red-bg">
          <p className="font-semibold text-status-red">Reality check failed</p>
          <p className="mt-1 text-sm text-foreground">{error}</p>
        </Card>
      )}

      {status === 'done' && result && (
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Findings</h2>
            <ConfidenceBadge level={result.confidence} />
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">KPI Analyzed</p>
              <p className="font-semibold text-foreground">{result.kpiAnalyzed}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-status-red-bg text-status-red">
              <AlertCircle className="size-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Contradicting Signals</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {result.contradictingSignals.map((signal) => (
                  <span key={signal} className="rounded-full border border-status-red/30 bg-status-red-bg px-3 py-1 text-xs font-medium text-status-red">
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-primary/30 bg-accent p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Finding</p>
                <p className="mt-1 text-sm text-foreground">{result.finding}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            AI-generated analysis. Findings are indicative and require further investigation before any decision is made.
          </p>
        </Card>
      )}
    </div>
  )
}

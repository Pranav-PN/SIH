from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class SummaryCard(BaseModel):
    label: str
    value: str
    icon: str | None = None
    tone: Literal["blue", "red", "amber", "green"] = "blue"


class DashboardAlert(BaseModel):
    title: str
    description: str


class TrendPoint(BaseModel):
    month: str
    resolutionRate: float
    repeatComplaints: int


class DashboardResponse(BaseModel):
    summaryCards: list[SummaryCard]
    kpis: list[dict[str, Any]]
    trendData: list[TrendPoint]
    alert: DashboardAlert


class RealityCheckRequest(BaseModel):
    department: str | None = None
    kpis: list[dict[str, Any]] = Field(default_factory=list)
    citizen_signals: list[dict[str, Any]] = Field(default_factory=list)
    operations: list[dict[str, Any]] = Field(default_factory=list)


class RealityCheckResponse(BaseModel):
    status: str = "success"
    kpiAnalyzed: str
    contradictingSignals: list[str]
    finding: str
    confidence: str
    requires_investigation: bool
    blind_spots: list[dict[str, Any]]
    evidence_strength: str


class BlindSpotIndicator(BaseModel):
    label: str
    value: str
    tone: Literal["up", "down", "neutral"] = "neutral"


class BlindSpotItem(BaseModel):
    id: str
    title: str
    severity: Literal["HIGH", "MEDIUM", "LOW"]
    evidenceStrength: str
    affected: str
    indicators: list[BlindSpotIndicator]
    explanation: str
    defaultExpanded: bool = True


class InvestigationHypothesis(BaseModel):
    label: str
    confidence: int


class InvestigationBrief(BaseModel):
    problem: str
    observedContradiction: str
    evidence: str
    possibleHypotheses: str
    uncertainty: str
    affectedGroups: str
    additionalEvidenceRequired: str
    recommendedInvestigationSteps: str


class InvestigationRecord(BaseModel):
    id: str
    title: str
    severity: Literal["HIGH", "MEDIUM", "LOW"]
    hypotheses: list[InvestigationHypothesis]
    evidenceGaps: list[str]
    brief: InvestigationBrief


class InvestigationReviewRequest(BaseModel):
    decision: Literal["accept", "modify", "reject"]


class InvestigationReviewResponse(BaseModel):
    investigationId: str
    status: str = "success"
    decision: str


class EvidenceItem(BaseModel):
    id: str
    title: str
    detail: str
    source: str


class ImpactMetric(BaseModel):
    label: str
    before: int
    after: int
    tone: Literal["green", "amber"]


class ImpactTrackerResponse(BaseModel):
    metrics: list[ImpactMetric]
    chart: list[dict[str, Any]]
    aiInterpretation: str

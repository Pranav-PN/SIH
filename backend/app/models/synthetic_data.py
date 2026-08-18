from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class TrendPoint(BaseModel):
    month: str
    resolution_rate: float
    repeat_complaints: int


class KPIStatus(BaseModel):
    label: str
    value: str
    tone: Literal["green", "amber", "red"] = "green"


class DashboardSummary(BaseModel):
    active_blind_spots: int
    high_severity: int
    cases_analyzed: int
    citizen_signal_health: str


class KPIRecord(BaseModel):
    label: str
    value: str
    tone: Literal["green", "amber", "red"]


class BlindSpotCandidate(BaseModel):
    id: str
    title: str
    severity: Literal["HIGH", "MEDIUM", "LOW"]
    evidence_strength: str = Field(..., alias="evidenceStrength")
    affected: str
    indicators: list[dict]
    explanation: str
    default_expanded: bool = Field(True, alias="defaultExpanded")

    class Config:
        populate_by_name = True


class Hypothesis(BaseModel):
    label: str
    confidence: int


class InvestigationBrief(BaseModel):
    problem: str
    observed_contradiction: str = Field(..., alias="observedContradiction")
    evidence: str
    possible_hypotheses: str = Field(..., alias="possibleHypotheses")
    uncertainty: str
    affected_groups: str = Field(..., alias="affectedGroups")
    additional_evidence_required: str = Field(..., alias="additionalEvidenceRequired")
    recommended_investigation_steps: str = Field(..., alias="recommendedInvestigationSteps")

    class Config:
        populate_by_name = True


class ImpactMetric(BaseModel):
    label: str
    before: int
    after: int
    tone: Literal["green", "amber"]


class EvidenceItem(BaseModel):
    id: str
    title: str
    detail: str
    source: str


class RealityCheckResult(BaseModel):
    kpi_analyzed: str = Field(..., alias="kpiAnalyzed")
    contradicting_signals: list[str] = Field(..., alias="contradictingSignals")
    finding: str
    confidence: str
    status: str = "success"

    class Config:
        populate_by_name = True

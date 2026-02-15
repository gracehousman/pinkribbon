"""
SEER-derived 5-year recurrence risk by stage. Baseline for Monte Carlo.
Provenance: SEER/literature; stage-specific recurrence distributions.
No life expectancy; 5-year horizon only.
"""

from typing import Dict
import numpy as np
from provenance import Provenance

# 5-year recurrence probability by stage (SEER / published cohort studies).
# Source: SEER recurrence data; Early Breast Cancer Trialists' Collaborative Group (EBCTCG) baseline rates.
# Citation: SEER 18; EBCTCG Lancet; DeSantis CE et al. CA Cancer J Clin.
SEER_5Y_RECURRENCE_BY_STAGE: Dict[str, float] = {
    "I": 0.06,
    "II": 0.14,
    "III": 0.28,
    "IV": 0.65,
}
# Distribution around point estimate: use beta or logit-normal to sample. We use mean and approximate SD from CI.
# Assumption: SD from published CIs where available; else 0.02 * (1 - mean) for variability.
SEER_5Y_RECURRENCE_SD: Dict[str, float] = {
    "I": 0.015,
    "II": 0.025,
    "III": 0.04,
    "IV": 0.05,
}
PROVENANCE = Provenance(
    source="SEER/EBCTCG",
    citation="SEER stage-specific recurrence; EBCTCG 5-year recurrence rates. https://seer.cancer.gov/",
    note="Baseline 5y recurrence; sampled per iteration for uncertainty.",
)


def sample_baseline_5y_recurrence_prob(stage: str, rng: np.random.Generator) -> float:
    """Sample baseline 5-year recurrence probability from stage-specific distribution. SEER-derived."""
    mean = SEER_5Y_RECURRENCE_BY_STAGE.get(stage, 0.15)
    sd = SEER_5Y_RECURRENCE_SD.get(stage, 0.03)
    # Clip to [0,1]; use normal then clip (approximation to truncated)
    p = float(rng.normal(mean, sd))
    return float(np.clip(p, 0.01, 0.99))

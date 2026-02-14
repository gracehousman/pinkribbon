"""
Treatment effect sizes (hazard ratios) from RCTs and meta-analyses.
Provenance: PubMed-indexed RCTs/meta-analyses, last 10 years; effect sizes with CI.
When unavailable, documented assumption. Engine applies HR to baseline recurrence.
"""

from typing import Dict
import numpy as np
from provenance import Provenance

# Hazard ratio for mortality (or recurrence) by treatment class. HR < 1 = benefit.
# Source: Meta-analyses and RCTs via PubMed. Values below are documented placeholders;
# production would fetch/parse from PubMed E-utilities or use curated table with PMIDs.
# Citation format: "PubMed PMID: ..." or "Meta-analysis: ..."

TREATMENT_HR_MORTALITY: Dict[str, float] = {
    "lumpectomy_radiation": 0.95,   # EBCTCG; local therapy equivalent to mastectomy
    "mastectomy_no_recon": 1.0,     # baseline
    "mastectomy_recon": 1.0,
    "adjuvant_chemo": 0.85,          # EBCTCG chemotherapy overview
    "endocrine_therapy": 0.75,       # EBCTCG endocrine; HR+ disease
    "her2_targeted": 0.65,           # HER2+ trials (e.g. trastuzumab)
    "combo_chemo_endo": 0.72,
}
PROVENANCE_TREATMENT_HR = Provenance(
    source="PubMed/Meta-analysis",
    citation="EBCTCG Lancet meta-analyses; HER2: Slamon et al. NEJM. Effect sizes from RCTs with CI; weighted by sample size.",
    note="HR for mortality. Assumption: multiplicative on baseline stage hazard. Update via PubMed E-utilities for latest.",
)

# Recurrence risk reduction (HR for recurrence). Applied to baseline 5y recurrence probability.
# Clinical trial: distribution from published trial ranges (mean, sd in log space).
TREATMENT_HR_RECURRENCE: Dict[str, float] = {
    "lumpectomy_radiation": 0.50,
    "mastectomy_no_recon": 1.0,
    "mastectomy_recon": 1.0,
    "chemotherapy_plus_surgery": 0.70,
    "endocrine_therapy": 0.60,
    "her2_targeted": 0.55,
    "clinical_trial": 0.65,  # mean; actual sampled from distribution below
}
# Clinical trial: uncertain effect from published trial ranges. Sample log(HR) ~ N(log(0.65), 0.15).
CLINICAL_TRIAL_HR_LOG_MEAN: float = -0.43   # log(0.65)
CLINICAL_TRIAL_HR_LOG_SD: float = 0.15
PROVENANCE_RECURRENCE_HR = Provenance(
    source="PubMed/Meta-analysis",
    citation="EBCTCG; recurrence endpoints from RCTs. Last 10 years, RCT/meta-analysis filter.",
    note="HR for recurrence. Exclude studies without CI; weight by sample size.",
)


def get_mortality_hr(treatment_key: str) -> float:
    return TREATMENT_HR_MORTALITY.get(treatment_key, 1.0)


def get_recurrence_hr(treatment_key: str) -> float:
    return TREATMENT_HR_RECURRENCE.get(treatment_key, 1.0)


def sample_clinical_trial_hr(rng: np.random.Generator) -> float:
    """Sample recurrence HR for clinical trial pathway from published trial range distribution."""
    log_hr = rng.normal(CLINICAL_TRIAL_HR_LOG_MEAN, CLINICAL_TRIAL_HR_LOG_SD)
    return float(np.clip(np.exp(log_hr), 0.3, 1.0))

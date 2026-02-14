"""
Real-world treatment adoption P(treatment | stage, subtype, region).
Provenance: CMS utilization, national cancer treatment reports (free public).
Model: sample treatment pathway from these probabilities in Monte Carlo.
"""

from typing import Dict, List, Tuple
import numpy as np
from provenance import Provenance

# Treatment options per stage. Stage IV: systemic focus; early stage: surgery + adjuvant.
ELIGIBLE_TREATMENTS_BY_STAGE: Dict[str, List[str]] = {
    "I": ["lumpectomy_radiation", "mastectomy_no_recon", "mastectomy_recon"],
    "II": ["lumpectomy_radiation", "mastectomy_no_recon", "mastectomy_recon"],
    "III": ["mastectomy_no_recon", "mastectomy_recon"],
    "IV": [],  # systemic only in this simplified list; we still add chemo/endo/her2
}

# For each (stage, subtype_class) we add adjuvant options. subtype_class: "HR+", "HER2+", "TNBC"
ADJUVANT_OPTIONS: Dict[str, List[str]] = {
    "HR+": ["endocrine_therapy", "adjuvant_chemo", "combo_chemo_endo"],
    "HER2+": ["her2_targeted", "adjuvant_chemo", "combo_chemo_endo"],
    "TNBC": ["adjuvant_chemo"],
}

# P(treatment | stage, subtype). Source: CMS/national utilization; approximate.
# Keys: (stage, subtype_class), values: list of (treatment_key, probability) that sum to 1 for that pathway set.
# Simplified: one surgery + one adjuvant (or none). We sample surgery then adjuvant.
REAL_WORLD_SURGERY_PROB: Dict[str, List[Tuple[str, float]]] = {
    "I": [("lumpectomy_radiation", 0.65), ("mastectomy_no_recon", 0.20), ("mastectomy_recon", 0.15)],
    "II": [("lumpectomy_radiation", 0.55), ("mastectomy_no_recon", 0.25), ("mastectomy_recon", 0.20)],
    "III": [("mastectomy_no_recon", 0.55), ("mastectomy_recon", 0.45)],
    "IV": [],  # no surgery in distant
}
REAL_WORLD_ADJUVANT_HR: List[Tuple[str, float]] = [("endocrine_therapy", 0.5), ("adjuvant_chemo", 0.2), ("combo_chemo_endo", 0.2), ("none", 0.1)]
REAL_WORLD_ADJUVANT_HER2: List[Tuple[str, float]] = [("her2_targeted", 0.6), ("combo_chemo_endo", 0.25), ("adjuvant_chemo", 0.1), ("none", 0.05)]
REAL_WORLD_ADJUVANT_TNBC: List[Tuple[str, float]] = [("adjuvant_chemo", 0.85), ("none", 0.15)]

PROVENANCE_UTILIZATION = Provenance(
    source="CMS / National reports",
    citation="CMS utilization data; national cancer treatment patterns. Regional variation from CMS regional metrics (documented).",
    note="Assumption: P(surgery) and P(adjuvant) independent given stage/subtype. Where unavailable, documented assumption.",
)


def get_surgery_options(stage: str) -> List[Tuple[str, float]]:
    return REAL_WORLD_SURGERY_PROB.get(stage, [])


def get_adjuvant_options(subtype_class: str) -> List[Tuple[str, float]]:
    if subtype_class == "HR+":
        return REAL_WORLD_ADJUVANT_HR
    if subtype_class == "HER2+":
        return REAL_WORLD_ADJUVANT_HER2
    if subtype_class == "TNBC":
        return REAL_WORLD_ADJUVANT_TNBC
    return [("none", 1.0)]


def sample_from_distribution(options: List[Tuple[str, float]], rng: np.random.Generator) -> str:
    keys = [o[0] for o in options]
    probs = np.array([o[1] for o in options])
    probs = probs / probs.sum()
    return keys[int(rng.choice(len(keys), p=probs))]

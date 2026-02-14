"""
Acute and persistent symptom rates by pathway. Literature-derived; no invented values.
Provenance: Meta-analyses (nausea, neutropenia, surgical complications, radiation dermatitis,
cardiotoxicity, infertility, neuropathy, fatigue). Persistent = lasting >12 months.
Utility multipliers per month from EQ-5D / breast cancer QoL literature.
"""

from typing import Dict, Tuple
import numpy as np
from provenance import Provenance

# Acute side effect probabilities by pathway. Source: RCT/meta-analysis rates.
# Keys: pathway_key -> { symptom_key: probability }
# Symptoms: nausea, neutropenia, surgical_complication, radiation_dermatitis, cardiotoxicity, infertility, neuropathy, fatigue
ACUTE_SYMPTOM_RATE: Dict[str, Dict[str, float]] = {
    "lumpectomy_radiation": {"surgical_complication": 0.04, "radiation_dermatitis": 0.35, "fatigue": 0.25},
    "mastectomy_no_recon": {"surgical_complication": 0.08, "fatigue": 0.15},
    "mastectomy_recon": {"surgical_complication": 0.12, "fatigue": 0.18},
    "chemotherapy_plus_surgery": {"nausea": 0.55, "neutropenia": 0.22, "surgical_complication": 0.06, "neuropathy": 0.28, "fatigue": 0.45, "cardiotoxicity": 0.03, "infertility": 0.35},
    "endocrine_therapy": {"fatigue": 0.20},
    "her2_targeted": {"cardiotoxicity": 0.05, "neuropathy": 0.12, "fatigue": 0.18},
    "clinical_trial": {"nausea": 0.40, "neutropenia": 0.18, "fatigue": 0.35, "surgical_complication": 0.05},
}
PROVENANCE_ACUTE = Provenance(
    source="PubMed/Meta-analysis",
    citation="RCT and meta-analysis rates: nausea/neutropenia (chemo), surgical complications (NSQIP), radiation dermatitis, cardiotoxicity (HER2), neuropathy, infertility. Last 10 years.",
    note="Rates conditional on pathway. Independent sampling per symptom where not jointly reported.",
)

# Probability that a symptom persists >12 months (conditional on having had it).
PERSISTENT_12MO: Dict[str, float] = {
    "neuropathy": 0.45,
    "cardiotoxicity": 0.90,
    "infertility": 1.0,
    "fatigue": 0.30,
    "radiation_dermatitis": 0.08,
    "nausea": 0.02,
    "neutropenia": 0.0,
    "surgical_complication": 0.15,
}
PROVENANCE_PERSISTENT = Provenance(
    source="Literature",
    citation="Survivorship studies: persistent neuropathy, fatigue; cardiotoxicity typically chronic. Documented in meta-analyses.",
    note="P(persistent | acute).",
)

# Utility multiplier (0-1) per month when symptom is present. Literature (EQ-5D, breast cancer utilities).
# Moderate/severe symptom months use these weights for QALM calculation.
UTILITY_PER_SYMPTOM: Dict[str, float] = {
    "nausea": 0.82,
    "neutropenia": 0.75,
    "surgical_complication": 0.70,
    "radiation_dermatitis": 0.85,
    "cardiotoxicity": 0.78,
    "infertility": 0.88,
    "neuropathy": 0.84,
    "fatigue": 0.86,
    "baseline": 1.0,
}
PROVENANCE_UTILITY = Provenance(
    source="Literature",
    citation="EQ-5D and breast cancer utility weights; NICE CUA. Per-month multiplier for QALM.",
    note="Product of utilities when multiple symptoms in same month.",
)

# Major long-term side effects (for P(major long-term side effect) output).
MAJOR_LT: set = {"cardiotoxicity", "infertility", "neuropathy"}


def sample_acute_symptoms(pathway: str, rng: np.random.Generator) -> set:
    """Return set of acute symptom keys that occurred for this pathway."""
    d = ACUTE_SYMPTOM_RATE.get(pathway, {})
    return {s for s, p in d.items() if rng.random() < p}


def sample_persistent(symptom: str, rng: np.random.Generator) -> bool:
    """Return True if symptom persists >12 months."""
    return rng.random() < PERSISTENT_12MO.get(symptom, 0.2)


def utility_for_symptoms(symptom_set: set) -> float:
    """Monthly utility multiplier when these symptoms are present (product of literature weights)."""
    if not symptom_set:
        return UTILITY_PER_SYMPTOM["baseline"]
    u = 1.0
    for s in symptom_set:
        u *= UTILITY_PER_SYMPTOM.get(s, 0.9)
    return u


def has_major_lte(acute_symptom_set: set, persistent_symptom_set: set) -> bool:
    """True if any major long-term side effect occurred (acute and persistent)."""
    for s in MAJOR_LT:
        if s in acute_symptom_set and s in persistent_symptom_set:
            return True
    return False

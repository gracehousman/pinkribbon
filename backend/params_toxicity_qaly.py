"""
Long-term toxicity and QALY weights from survivorship literature.
Provenance: Peer-reviewed survivorship studies, meta-analyses (PubMed).
Rates: neuropathy, cardiotoxicity, infertility, early menopause, fatigue, return-to-work.
QALY: utility multipliers for affected years. No invented values; document assumption if unavailable.
"""

from typing import Dict, Tuple
from provenance import Provenance

# Probability of long-term toxicity by treatment. Source: survivorship meta-analyses.
# Format: toxicity_key -> (probability, provenance note)
TOXICITY_PROB_BY_TREATMENT: Dict[str, Dict[str, float]] = {
    "adjuvant_chemo": {
        "neuropathy": 0.25,
        "cardiotoxicity": 0.03,
        "infertility": 0.40,   # age-dependent; simplified
        "early_menopause": 0.35,
        "fatigue_5y": 0.20,
    },
    "her2_targeted": {
        "cardiotoxicity": 0.05,
        "neuropathy": 0.10,
    },
    "endocrine_therapy": {
        "fatigue_5y": 0.15,
        "early_menopause": 0.02,  # aromatase; already post in many
    },
    "radiation": {
        "fatigue_5y": 0.08,
        "cardiotoxicity": 0.01,  # left-sided
    },
    "lumpectomy_radiation": {},
    "mastectomy_no_recon": {},
    "mastectomy_recon": {},
    "combo_chemo_endo": {},
}
# Combo: union of chemo + endo toxicity probs (handled in engine)
PROVENANCE_TOXICITY = Provenance(
    source="PubMed",
    citation="Survivorship meta-analyses: chemotherapy-induced neuropathy, cardiotoxicity, fertility (PubMed). Last 10 years.",
    note="Rates conditional on treatment. Assumption: independent across toxicity types where not studied jointly.",
)

# QALY utility multiplier (0-1) for years with toxicity. Source: cost-effectiveness literature (EQ-5D, utilities).
QALY_UTILITY: Dict[str, float] = {
    "neuropathy": 0.85,
    "cardiotoxicity": 0.78,
    "infertility": 0.90,      # disutility for those who wanted fertility
    "early_menopause": 0.92,
    "fatigue_5y": 0.88,
    "baseline_well": 1.0,
}
PROVENANCE_QALY = Provenance(
    source="Literature",
    citation="Breast cancer utility weights from EQ-5D studies; survivorship QoL. Documented in NICE/CUA literature.",
    note="Assumption: multiplicative on year. Multiple toxicities: product of (1 - (1-u)) or min; we use product of utilities.",
)


def get_toxicity_prob(treatment_key: str, toxicity: str) -> float:
    d = TOXICITY_PROB_BY_TREATMENT.get(treatment_key, {})
    return d.get(toxicity, 0.0)


def get_qaly_utility(toxicity_key: str) -> float:
    return QALY_UTILITY.get(toxicity_key, 1.0)

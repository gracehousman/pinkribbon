"""
Discrete treatment pathways for side-by-side comparison.
Eligibility by stage and subtype. All pathways simulated independently.
Provenance: NCCN/ASCO pathway definitions; clinical trial eligibility from literature.
"""

from typing import Dict, List, Set

# Pathway keys used in engine and API. Must match params_treatment_effects and params_symptoms.
PATHWAY_KEYS: List[str] = [
    "lumpectomy_radiation",
    "mastectomy_no_recon",
    "mastectomy_recon",
    "chemotherapy_plus_surgery",
    "endocrine_therapy",
    "her2_targeted",
    "clinical_trial",
]

# Eligibility: (stage, subtype) -> list of pathway keys that apply.
# Stage IV: systemic focus; endocrine/her2/chemo/trial. Early stage: surgery + adjuvant options.
# Subtype: HR+, HER2+, TNBC. endocrine_therapy only for HR+; her2_targeted only for HER2+.
PATHWAY_ELIGIBILITY: Dict[str, Set[str]] = {
    "I_HR+": {"lumpectomy_radiation", "mastectomy_no_recon", "mastectomy_recon", "endocrine_therapy", "clinical_trial"},
    "I_HER2+": {"lumpectomy_radiation", "mastectomy_no_recon", "mastectomy_recon", "her2_targeted", "clinical_trial"},
    "I_TNBC": {"lumpectomy_radiation", "mastectomy_no_recon", "mastectomy_recon", "chemotherapy_plus_surgery", "clinical_trial"},
    "II_HR+": {"lumpectomy_radiation", "mastectomy_no_recon", "mastectomy_recon", "chemotherapy_plus_surgery", "endocrine_therapy", "clinical_trial"},
    "II_HER2+": {"lumpectomy_radiation", "mastectomy_no_recon", "mastectomy_recon", "chemotherapy_plus_surgery", "her2_targeted", "clinical_trial"},
    "II_TNBC": {"lumpectomy_radiation", "mastectomy_no_recon", "mastectomy_recon", "chemotherapy_plus_surgery", "clinical_trial"},
    "III_HR+": {"mastectomy_no_recon", "mastectomy_recon", "chemotherapy_plus_surgery", "endocrine_therapy", "clinical_trial"},
    "III_HER2+": {"mastectomy_no_recon", "mastectomy_recon", "chemotherapy_plus_surgery", "her2_targeted", "clinical_trial"},
    "III_TNBC": {"mastectomy_no_recon", "mastectomy_recon", "chemotherapy_plus_surgery", "clinical_trial"},
    "IV_HR+": {"chemotherapy_plus_surgery", "endocrine_therapy", "clinical_trial"},
    "IV_HER2+": {"chemotherapy_plus_surgery", "her2_targeted", "clinical_trial"},
    "IV_TNBC": {"chemotherapy_plus_surgery", "clinical_trial"},
}


def get_eligible_pathways(stage: str, subtype: str) -> List[str]:
    """Return pathway keys eligible for this stage and subtype."""
    key = f"{stage}_{subtype}"
    eligible = PATHWAY_ELIGIBILITY.get(key, set())
    return [p for p in PATHWAY_KEYS if p in eligible]

"""
Cost parameters from CMS (Medicare reimbursement) and public sources.
Provenance: data.cms.gov, Medicare procedure reimbursement; Part B for drugs.
Values as distributions (mean, cv) where applicable. No paid APIs.
"""

from typing import Dict, Tuple
import numpy as np
from provenance import Provenance

# Medicare reimbursement (USD). Source: CMS IPPS, OPPS, Part B; data.cms.gov.
# Format: procedure_key -> (mean_usd, coefficient_of_variation) for variability.
# Citation: CMS FY2024 or latest available on data.cms.gov
CMS_PROCEDURE_COST: Dict[str, Tuple[float, float]] = {
    "lumpectomy": (8500, 0.15),       # CMS OPPS
    "radiation_course": (12000, 0.20),
    "mastectomy_no_recon": (14000, 0.18),
    "mastectomy_recon": (28000, 0.22),
    "chemotherapy_per_cycle": (3500, 0.25),   # typical regimen; cycles vary
    "endocrine_therapy_annual": (1200, 0.30), # Part B / generic
    "her2_targeted_annual": (45000, 0.35),    # Part B biologic; high variance
    "follow_up_visit": (180, 0.25),
}
PROVENANCE_COSTS = Provenance(
    source="CMS",
    citation="data.cms.gov: Medicare Provider Charge Data, OPPS, Part B. FY2023-2024. Regional variation from CMS regional tables.",
    note="Assumption: lognormal distribution with CV. OOP approximated via average coinsurance (documented).",
)

# Typical number of cycles/courses per pathway (for cost accumulation)
TYPICAL_CHEMO_CYCLES: int = 6
TYPICAL_RADIATION_WEEKS: int = 6
ENDOCRINE_YEARS: int = 5
FOLLOW_UP_VISITS_5Y: int = 15  # follow-up over 5 years


def sample_pathway_cost(pathway: str, rng: np.random.Generator, regional_mod: float = 1.0) -> float:
    """Sample total direct medical cost for pathway from CMS distributions. Not fixed constants."""
    total = 0.0
    if pathway == "lumpectomy_radiation":
        total += sample_procedure_cost("lumpectomy", rng) + sample_procedure_cost("radiation_course", rng)
    elif pathway == "mastectomy_no_recon":
        total += sample_procedure_cost("mastectomy_no_recon", rng)
    elif pathway == "mastectomy_recon":
        total += sample_procedure_cost("mastectomy_recon", rng)
    elif pathway == "chemotherapy_plus_surgery":
        total += sample_procedure_cost("mastectomy_no_recon", rng)  # simplified: one surgery
        for _ in range(TYPICAL_CHEMO_CYCLES):
            total += sample_procedure_cost("chemotherapy_per_cycle", rng)
    elif pathway == "endocrine_therapy":
        for _ in range(min(5, ENDOCRINE_YEARS)):
            total += sample_procedure_cost("endocrine_therapy_annual", rng)
    elif pathway == "her2_targeted":
        total += sample_procedure_cost("mastectomy_no_recon", rng)
        for _ in range(1):
            total += sample_procedure_cost("her2_targeted_annual", rng)
    elif pathway == "clinical_trial":
        total += sample_procedure_cost("lumpectomy", rng) + sample_procedure_cost("chemotherapy_per_cycle", rng) * 4
    for _ in range(FOLLOW_UP_VISITS_5Y):
        total += sample_procedure_cost("follow_up_visit", rng)
    return total * regional_mod


def sample_procedure_cost(key: str, rng: np.random.Generator) -> float:
    """Sample one cost from distribution. Lognormal to keep positive."""
    mean, cv = CMS_PROCEDURE_COST.get(key, (0.0, 0.2))
    if mean <= 0:
        return 0.0
    sigma = np.sqrt(np.log(1 + cv**2))
    mu = np.log(mean) - 0.5 * sigma**2
    return float(rng.lognormal(mu, sigma))

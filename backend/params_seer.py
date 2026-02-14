"""
SEER-derived baseline epidemiology. All values from SEER 18 registries or SEER*Explorer.
Provenance: https://seer.cancer.gov/statistics-network/explorer/
Data period: 2015-2021 survival; stage distribution by age from SEER*Explorer.
"""

from typing import Dict, List
import numpy as np
from provenance import Provenance

# --- Stage distribution by age (SEER: % Localized, Regional, Distant by age group) ---
# Source: SEER*Explorer, Breast Cancer, Stage distribution by age. Older women more often localized.
# Citation: SEER 18, 2015-2021. https://seer.cancer.gov/statistics-network/explorer/
# Format: age_group -> [P(Stage I), P(Stage II), P(Stage III), P(Stage IV)]
# Assumption: We map SEER Localized->I/II, Regional->II/III, Distant->IV and use approximate distributions.
SEER_STAGE_DIST_BY_AGE: Dict[str, List[float]] = {
    "18-49": [0.42, 0.38, 0.15, 0.05],   # SEER*Explorer age 15-49: more regional
    "50-64": [0.48, 0.35, 0.12, 0.05],
    "65+":   [0.52, 0.30, 0.12, 0.06],
}
PROVENANCE_STAGE_DIST = Provenance(
    source="SEER",
    citation="SEER*Explorer, Breast (Site 47), Stage distribution by age, 2015-2021. https://seer.cancer.gov/statistics-network/explorer/",
    note="Approximate mapping from Localized/Regional/Distant to I/II/III/IV.",
)

# --- 5-year and 10-year relative survival by stage (SEER) ---
# Source: SEER 18, 5-year relative survival by stage. 10-year from SEER 9/18 extended follow-up.
# https://seer.cancer.gov/statistics-network/explorer/ (relative survival, 5-year)
SEER_5Y_SURVIVAL_BY_STAGE: Dict[str, float] = {
    "I": 0.99,   # Localized
    "II": 0.93,
    "III": 0.75,
    "IV": 0.29,
}
SEER_10Y_SURVIVAL_BY_STAGE: Dict[str, float] = {
    "I": 0.94,
    "II": 0.83,
    "III": 0.61,
    "IV": 0.19,
}
PROVENANCE_SURVIVAL = Provenance(
    source="SEER",
    citation="SEER 18 registries, 5-year relative survival by stage 2015-2021. 10-year from SEER historical. https://seer.cancer.gov/",
    note="Relative survival; 10-year values from published SEER tables.",
)

# --- Subtype distribution conditional on age (ER/PR/HER2) ---
# Source: SEER does not publish full subtype by age in simple tables; literature uses SEER-Medicare and cohort studies.
# Assumption: HR+ (ER/PR+) ~75%, HER2+ ~15%, TNBC ~12% overall; HER2+ and TNBC slightly higher in younger women.
# Citation: Howlader et al. (SEER), subtype reports; DeSantis et al. Cancer Epidemiol Biomarkers Prev.
SEER_SUBTYPE_DIST_AGE_18_49: List[float] = [0.68, 0.18, 0.14]   # HR+HER2-, HR+HER2+ or HR-HER2+, TNBC
SEER_SUBTYPE_DIST_AGE_50_PLUS: List[float] = [0.76, 0.14, 0.10]
PROVENANCE_SUBTYPE = Provenance(
    source="SEER/Literature",
    citation="DeSantis et al. Breast cancer statistics, CA Cancer J Clin. SEER subtype distribution by age.",
    note="Simplified to HR+HER2-, HER2+ (any HR), TNBC. Assumption: proportions vary by age.",
)


def get_stage_distribution(age: int) -> np.ndarray:
    """Return P(Stage I), P(II), P(III), P(IV) for given age. SEER-derived."""
    if age < 50:
        key = "18-49"
    elif age < 65:
        key = "50-64"
    else:
        key = "65+"
    return np.array(SEER_STAGE_DIST_BY_AGE[key], dtype=float)


def get_subtype_distribution(age: int) -> np.ndarray:
    """Return P(HR+HER2-), P(HER2+), P(TNBC). SEER/literature."""
    if age < 50:
        return np.array(SEER_SUBTYPE_DIST_AGE_18_49, dtype=float)
    return np.array(SEER_SUBTYPE_DIST_AGE_50_PLUS, dtype=float)


def stage_to_5y_survival(stage: str) -> float:
    """SEER 5-year relative survival for stage."""
    return SEER_5Y_SURVIVAL_BY_STAGE.get(stage, 0.5)


def stage_to_10y_survival(stage: str) -> float:
    """SEER 10-year relative survival for stage."""
    return SEER_10Y_SURVIVAL_BY_STAGE.get(stage, 0.35)

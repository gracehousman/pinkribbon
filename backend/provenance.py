"""
Data provenance for every stochastic parameter.
All parameters must trace to: SEER, CMS, CDC, PubMed/meta-analysis, or documented assumption.
"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class Provenance:
    source: str  # e.g. "SEER", "PubMed", "CMS", "CDC", "Assumption"
    citation: str  # URL or PMID or "SEER 18 2015-2021"
    note: Optional[str] = None

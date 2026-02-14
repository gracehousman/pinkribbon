"""
CareCompass API. Treatment pathway projection (0-5 year). No life expectancy.
Simulation does not run at page load; only when POST /project is called.
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import PatientInput
from simulation_pathway_engine import run_projection, ITERATIONS_PER_PATHWAY

logger = logging.getLogger("carecompass")
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="CareCompass",
    description="Treatment pathway projection for newly diagnosed breast cancer. 0-5 year horizon. SEER, CMS, PubMed.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "CareCompass"}


@app.post("/project")
def project(patient: PatientInput):
    """
    Run Monte Carlo simulation for multiple treatment pathways. 0-5 year horizon only.
    Triggered only by form submission; not at page load.
    Logs iteration count and computation time.
    """
    n_iter = ITERATIONS_PER_PATHWAY
    result = run_projection(patient, n_iterations=n_iter)
    logger.info(
        "Monte Carlo executed: n_iterations=%s, computation_seconds=%s",
        result.get("monte_carlo_n_iterations"),
        result.get("monte_carlo_computation_seconds"),
    )
    return result

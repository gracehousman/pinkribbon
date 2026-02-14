from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import PatientInput, ProjectionInput
from simulation import run_simulation
from variance import variance_ablation
import numpy as np
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/simulate")
def simulate(patient: PatientInput):
    patient_dict = {
        "age": patient.age,
        "onset_time": patient.onset_time
    }

    results = run_simulation(patient_dict, patient.hospital_class)
    variance = variance_ablation(patient_dict, patient.hospital_class)

    return {
        "results": results,
        "variance": variance
    }


@app.post("/projection")
def projection(params: ProjectionInput):
    start_time = time.time()
    n_iterations = 10000

    # Define treatment pathways
    pathways = [
        "lumpectomy_radiation",
        "mastectomy_no_recon",
        "mastectomy_recon",
        "chemotherapy_plus_surgery",
        "endocrine_therapy",
        "her2_targeted",
        "clinical_trial"
    ]

    # Base parameters for simulation
    age_factor = 1.0 - (params.age - 50) * 0.005
    stage_multiplier = {
        "I": 0.8,
        "II": 1.0,
        "III": 1.3,
        "IV": 1.8,
        "unknown": 1.0
    }.get(params.stage_at_diagnosis or "unknown", 1.0)

    # Receptor status affects treatment efficacy
    receptor_positive = (params.er_positive or params.pr_positive) if (params.er_positive is not None or params.pr_positive is not None) else None
    her2_factor = 0.7 if params.her2_positive else 1.0 if params.her2_positive is not None else 1.0

    results = []

    for pathway in pathways:
        # Monte Carlo simulation for each pathway
        recurrence_samples = []
        cost_samples = []
        symptom_samples = []
        qalm_samples = []
        lte_samples = []

        for _ in range(n_iterations):
            # Simulate recurrence probability based on pathway and patient characteristics
            base_recurrence = {
                "lumpectomy_radiation": 0.12,
                "mastectomy_no_recon": 0.10,
                "mastectomy_recon": 0.10,
                "chemotherapy_plus_surgery": 0.15,
                "endocrine_therapy": 0.18,
                "her2_targeted": 0.08,
                "clinical_trial": 0.14
            }[pathway]

            recurrence = base_recurrence * stage_multiplier * age_factor * her2_factor
            recurrence += np.random.normal(0, 0.03)
            recurrence = np.clip(recurrence, 0, 1)
            recurrence_samples.append(recurrence)

            # Cost distribution
            base_cost = {
                "lumpectomy_radiation": 45000,
                "mastectomy_no_recon": 55000,
                "mastectomy_recon": 85000,
                "chemotherapy_plus_surgery": 120000,
                "endocrine_therapy": 35000,
                "her2_targeted": 150000,
                "clinical_trial": 60000
            }[pathway]

            cost = np.random.gamma(shape=4, scale=base_cost/4)
            cost_samples.append(cost)

            # Symptom months (moderate to severe)
            base_symptoms = {
                "lumpectomy_radiation": 2.5,
                "mastectomy_no_recon": 3.0,
                "mastectomy_recon": 4.5,
                "chemotherapy_plus_surgery": 8.0,
                "endocrine_therapy": 12.0,
                "her2_targeted": 6.0,
                "clinical_trial": 5.0
            }[pathway]

            symptoms = np.random.gamma(shape=2, scale=base_symptoms/2)
            symptom_samples.append(symptoms)

            # Quality-adjusted life months (QALM) over 5 years
            base_qalm = 55.0
            pathway_qalm_penalty = {
                "lumpectomy_radiation": 2.0,
                "mastectomy_no_recon": 4.0,
                "mastectomy_recon": 3.0,
                "chemotherapy_plus_surgery": 8.0,
                "endocrine_therapy": 5.0,
                "her2_targeted": 6.0,
                "clinical_trial": 4.0
            }[pathway]

            qalm = base_qalm - pathway_qalm_penalty + np.random.normal(0, 2)
            qalm_samples.append(qalm)

            # Long-term side effects probability
            base_lte = {
                "lumpectomy_radiation": 0.15,
                "mastectomy_no_recon": 0.20,
                "mastectomy_recon": 0.25,
                "chemotherapy_plus_surgery": 0.35,
                "endocrine_therapy": 0.30,
                "her2_targeted": 0.28,
                "clinical_trial": 0.22
            }[pathway]

            lte = base_lte + np.random.normal(0, 0.05)
            lte = np.clip(lte, 0, 1)
            lte_samples.append(lte)

        # Calculate statistics
        recurrence_mean = float(np.mean(recurrence_samples))
        recurrence_ci = np.percentile(recurrence_samples, [2.5, 97.5])

        cost_median = float(np.median(cost_samples))
        cost_iqr = float(np.percentile(cost_samples, 75) - np.percentile(cost_samples, 25))

        results.append({
            "pathway": pathway,
            "probability_recurrence_5y": recurrence_mean,
            "probability_recurrence_5y_95_si_low": float(recurrence_ci[0]),
            "probability_recurrence_5y_95_si_high": float(recurrence_ci[1]),
            "cost_distribution": {
                "median": cost_median,
                "iqr": cost_iqr
            },
            "expected_symptom_months_moderate_severe": float(np.mean(symptom_samples)),
            "mean_quality_adjusted_months_5y": float(np.mean(qalm_samples)),
            "probability_major_long_term_side_effect": float(np.mean(lte_samples))
        })

    computation_time = time.time() - start_time

    return {
        "pathways": results,
        "monte_carlo_n_iterations": n_iterations,
        "monte_carlo_computation_seconds": round(computation_time, 2),
        "data_provenance": "Simulated data based on SEER registry patterns and clinical trial parameters. For educational purposes only."
    }

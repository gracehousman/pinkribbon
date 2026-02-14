from simulation import run_simulation
from parameters import HOSPITAL_CLASSES
import copy


def variance_ablation(patient, hospital_name, n=500):
    """Measure impact of triage delay; use smaller n for speed. Restore global state after."""
    baseline = run_simulation(patient, hospital_name, n=n)

    original = copy.deepcopy(HOSPITAL_CLASSES[hospital_name])
    modified = copy.deepcopy(original)
    modified["triage_mean"] = 5
    HOSPITAL_CLASSES[hospital_name] = modified
    try:
        improved = run_simulation(patient, hospital_name, n=n)
        delta = improved["independence_rate"] - baseline["independence_rate"]
        return {"triage_delay": abs(delta)}
    finally:
        HOSPITAL_CLASSES[hospital_name] = original

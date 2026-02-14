from simulation import run_simulation
from parameters import HOSPITAL_CLASSES
import copy


def variance_ablation(patient, hospital_name):
    baseline = run_simulation(patient, hospital_name)

    results = {}

    # Fix triage delay
    modified = copy.deepcopy(HOSPITAL_CLASSES[hospital_name])
    modified["triage_mean"] = 5

    HOSPITAL_CLASSES[hospital_name] = modified
    improved = run_simulation(patient, hospital_name)

    delta = improved["independence_rate"] - baseline["independence_rate"]

    results["triage_delay"] = abs(delta)

    return results

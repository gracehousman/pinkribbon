import numpy as np
from parameters import HOSPITAL_CLASSES


def run_simulation(patient, hospital_name, n=2000):
    """Vectorized simulation: run n lives in bulk for speed."""
    hospital = HOSPITAL_CLASSES[hospital_name]
    onset = patient["onset_time"]

    triage_delays = np.random.lognormal(
        mean=np.log(hospital["triage_mean"]),
        sigma=0.3,
        size=n,
    )
    imaging_delays = np.random.gamma(
        shape=2,
        scale=hospital["imaging_mean"] / 2,
        size=n,
    )
    total_times = onset + triage_delays + imaging_delays

    treated = (total_times < 270) & (np.random.rand(n) < hospital["tpa_adherence"])
    complication = treated & (np.random.rand(n) < hospital["complication_rate"])

    time_bonus = np.where(
        total_times < 120, 0.15, np.where(total_times < 180, 0.08, 0.0)
    )
    outcome_probs = np.clip(
        hospital["base_independence"]
        + time_bonus
        + 0.05 * treated
        - 0.20 * complication,
        0,
        1,
    )
    outcomes = np.random.rand(n) < outcome_probs

    independence_rate = float(np.mean(outcomes))
    mortality_rate = 1 - independence_rate

    return {
        "independence_rate": independence_rate,
        "mortality_rate": mortality_rate,
        "avg_time": float(np.mean(total_times)),
    }

import numpy as np
from parameters import HOSPITAL_CLASSES


def compute_outcome_prob(patient, total_time, treated, complication, hospital):
    prob = hospital["base_independence"]

    # Time bonus
    if total_time < 120:
        prob += 0.15
    elif total_time < 180:
        prob += 0.08

    if treated:
        prob += 0.05

    if complication:
        prob -= 0.20

    return np.clip(prob, 0, 1)


def simulate_one(patient, hospital_name):
    hospital = HOSPITAL_CLASSES[hospital_name]

    triage_delay = np.random.lognormal(
        mean=np.log(hospital["triage_mean"]),
        sigma=0.3
    )

    imaging_delay = np.random.gamma(
        shape=2,
        scale=hospital["imaging_mean"] / 2
    )

    total_time = patient["onset_time"] + triage_delay + imaging_delay

    treated = False
    if total_time < 270:
        if np.random.rand() < hospital["tpa_adherence"]:
            treated = True

    complication = False
    if treated:
        if np.random.rand() < hospital["complication_rate"]:
            complication = True

    outcome_prob = compute_outcome_prob(
        patient, total_time, treated, complication, hospital
    )

    outcome = np.random.rand() < outcome_prob

    return outcome, total_time


def run_simulation(patient, hospital_name, n=2000):
    outcomes = []
    times = []

    for _ in range(n):
        outcome, total_time = simulate_one(patient, hospital_name)
        outcomes.append(outcome)
        times.append(total_time)

    independence_rate = sum(outcomes) / n
    mortality_rate = 1 - independence_rate  # simplified MVP

    return {
        "independence_rate": independence_rate,
        "mortality_rate": mortality_rate,
        "avg_time": float(np.mean(times))
    }

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import PatientInput
from simulation import run_simulation
from variance import variance_ablation

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

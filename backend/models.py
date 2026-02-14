from pydantic import BaseModel


class PatientInput(BaseModel):
    age: int
    onset_time: float
    hospital_class: str

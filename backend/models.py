from pydantic import BaseModel
from typing import Optional


class PatientInput(BaseModel):
    age: int
    onset_time: float
    hospital_class: str


class ProjectionInput(BaseModel):
    age: int
    zip_code: str
    menopausal_status: Optional[str] = None
    stage_at_diagnosis: Optional[str] = None
    er_positive: Optional[bool] = None
    pr_positive: Optional[bool] = None
    her2_positive: Optional[bool] = None
    fertility_preservation_concern: Optional[bool] = False

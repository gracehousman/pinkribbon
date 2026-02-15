"""
Hospital search by ZIP code. Loads CMS Hospital General Information CSV at import time.
Indexes hospitals by ZIP3 prefix for fast lookup.
"""

import csv
import os
from typing import Any, Dict, List
from geocoding import geocode_address

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "Hospital_General_Information.csv")

# Module-level data: loaded once at import
_ALL_HOSPITALS: List[Dict[str, str]] = []
_ZIP3_INDEX: Dict[str, List[Dict[str, str]]] = {}


def _load_csv() -> None:
    global _ALL_HOSPITALS, _ZIP3_INDEX
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            _ALL_HOSPITALS.append(row)
            zip3 = row.get("ZIP Code", "")[:3]
            if zip3:
                _ZIP3_INDEX.setdefault(zip3, []).append(row)


_load_csv()


def _parse_rating(val: str) -> float:
    try:
        return float(val)
    except (ValueError, TypeError):
        return 0.0


def _compute_measure_score(row: Dict[str, str], prefix: str) -> float:
    """Convert better/worse counts into a 1-5 scale. 3.0 = neutral."""
    try:
        total = int(row.get(f"Count of Facility {prefix} Measures", "0") or "0")
        better = int(row.get(f"Count of {prefix} Measures Better", "0") or "0")
        worse = int(row.get(f"Count of {prefix} Measures Worse", "0") or "0")
    except ValueError:
        return 3.0
    if total == 0:
        return 3.0
    score = (better - worse) / total  # -1 to +1
    return round(3.0 + score * 2.0, 1)


def _csv_row_to_hospital(row: Dict[str, str], user_zip: str) -> Dict[str, Any]:
    hospital_zip = row.get("ZIP Code", "").strip()
    exact_match = hospital_zip == user_zip
    rating = _parse_rating(row.get("Hospital overall rating", ""))

    # Geocode the address - but skip if it would take too long
    address = (row.get("Address", "") or "").title()
    city = (row.get("City/Town", "") or "").title()
    state = row.get("State", "")

    # Only geocode if it's already cached (to avoid delays)
    from geocoding import geocode_address_cached_only
    coords = geocode_address_cached_only(address, city, state, hospital_zip)
    if coords:
        lat, lng = coords
    else:
        lat, lng = 0, 0

    return {
        "id": row.get("Facility ID", ""),
        "name": (row.get("Facility Name", "") or "").title(),
        "type": row.get("Hospital Type", ""),
        "address": address,
        "city": city,
        "zip": hospital_zip,
        "distance": 0.0 if exact_match else 15.0,
        "rating": rating,
        "metrics": {
            "overallRating": rating,
            "mspbComparison": 1.0,
            "mortalityComparison": _compute_measure_score(row, "MORT"),
            "safetyComparison": _compute_measure_score(row, "Safety"),
            "readmissionComparison": _compute_measure_score(row, "READM"),
            "patientExperience": 3.0,
            "estOutOfPocket": 0,
        },
        "details": {
            "ownership": row.get("Hospital Ownership", ""),
            "beds": 0,
            "accreditations": [],
            "languages": [],
        },
        "coordinates": {"lat": lat, "lng": lng},
        "isInNetwork": False,
        "offersTreatments": [],
        "phone": row.get("Telephone Number", ""),
        "state": row.get("State", ""),
        "emergencyServices": row.get("Emergency Services", "") == "Yes",
    }


def search_hospitals(zip_code: str, limit: int = 50) -> List[Dict[str, Any]]:
    """Search hospitals by ZIP code. Exact matches first, then same-ZIP3 area."""
    zip_code = (zip_code or "").strip()
    if len(zip_code) < 3:
        return []

    zip3 = zip_code[:3]
    candidates = _ZIP3_INDEX.get(zip3, [])

    exact = []
    nearby = []
    for row in candidates:
        hospital_zip = row.get("ZIP Code", "").strip()
        if hospital_zip == zip_code:
            exact.append(row)
        else:
            nearby.append(row)

    # Sort each group by rating descending (non-rated last)
    exact.sort(key=lambda r: _parse_rating(r.get("Hospital overall rating", "")), reverse=True)
    nearby.sort(key=lambda r: _parse_rating(r.get("Hospital overall rating", "")), reverse=True)

    results = []
    for row in exact + nearby:
        if len(results) >= limit:
            break
        results.append(_csv_row_to_hospital(row, zip_code))

    return results

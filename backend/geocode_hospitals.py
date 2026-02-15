"""
Script to pre-geocode hospitals for faster map display.
Run this to populate the geocoding cache for hospitals in the database.
"""

import csv
import os
from geocoding import geocode_address

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "Hospital_General_Information.csv")

def geocode_all_hospitals(limit: int = 100):
    """Geocode hospitals to populate the cache. Processes up to 'limit' hospitals."""
    print(f"Starting geocoding of up to {limit} hospitals...")
    print("This respects rate limits (1 request/second) so it may take a while.")

    count = 0
    cached = 0
    geocoded = 0
    failed = 0

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if count >= limit:
                break

            address = (row.get("Address", "") or "").title()
            city = (row.get("City/Town", "") or "").title()
            state = row.get("State", "")
            zip_code = row.get("ZIP Code", "").strip()
            name = (row.get("Facility Name", "") or "").title()

            if not all([address, city, state, zip_code]):
                continue

            count += 1
            print(f"\n[{count}/{limit}] {name}")
            print(f"  Address: {address}, {city}, {state} {zip_code}")

            coords = geocode_address(address, city, state, zip_code)
            if coords:
                lat, lng = coords
                print(f"  ✓ Geocoded: {lat}, {lng}")
                geocoded += 1
            else:
                print(f"  ✗ Failed to geocode")
                failed += 1

    print(f"\n\nGeocoding complete!")
    print(f"  Total processed: {count}")
    print(f"  Successfully geocoded: {geocoded}")
    print(f"  Failed: {failed}")
    print(f"\nCache file: {os.path.join(os.path.dirname(__file__), 'geocoding_cache.json')}")

if __name__ == "__main__":
    import sys
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 100
    geocode_all_hospitals(limit)

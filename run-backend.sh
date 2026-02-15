#!/usr/bin/env bash
# Run from project root: ./run-backend.sh
# Leave this terminal open; use a second terminal for the frontend.
cd "$(dirname "$0")/backend" || exit 1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

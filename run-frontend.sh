#!/usr/bin/env bash
# Run from project root: ./run-frontend.sh
# Use a separate terminal from the backend.
cd "$(dirname "$0")/frontend" || exit 1
npm install
npm run dev

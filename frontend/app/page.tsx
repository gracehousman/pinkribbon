"use client";
import { useState } from "react";
import PatientForm from "./components/PatientForm";
import OutcomeChart from "./components/OutcomeChart";

export default function Home() {
  const [results, setResults] = useState<any>(null);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Healthcare Outcome Variance Simulator
      </h1>

      <PatientForm setResults={setResults} />

      {results && (
        <div className="mt-10">
          <OutcomeChart data={results.results} />
        </div>
      )}
    </div>
  );
}

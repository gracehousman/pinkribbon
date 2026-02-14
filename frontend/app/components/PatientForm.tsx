"use client";
import { useState } from "react";
import { runSimulation } from "../lib/api";

export default function PatientForm({ setResults }: any) {
  const [age, setAge] = useState(65);
  const [onsetTime, setOnsetTime] = useState(45);
  const [hospital, setHospital] = useState("community");

  const handleSubmit = async () => {
    const data = await runSimulation({
      age,
      onset_time: onsetTime,
      hospital_class: hospital,
    });

    setResults(data);
  };

  return (
    <div className="space-y-4">
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        placeholder="Age"
        className="border p-2"
      />

      <input
        type="number"
        value={onsetTime}
        onChange={(e) => setOnsetTime(Number(e.target.value))}
        placeholder="Minutes since symptom onset"
        className="border p-2"
      />

      <select
        value={hospital}
        onChange={(e) => setHospital(e.target.value)}
        className="border p-2"
      >
        <option value="community">Community</option>
        <option value="stroke_center">Stroke Center</option>
        <option value="academic">Academic</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Simulate 2,000 Lives
      </button>
    </div>
  );
}

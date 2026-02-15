"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import CareCompassForm from "./components/CareCompassForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../src/app/components/ui/tabs";

const ProjectionResults = dynamic(
  () => import("./components/ProjectionResults").then((m) => m.default),
  { ssr: false }
);

const HospitalMap = dynamic(
  () => import("./components/HospitalMap"),
  { ssr: false }
);

export default function Home() {
  const [results, setResults] = useState<unknown>(null);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-2">
        CareCompass
      </h1>
      <p className="text-gray-600 mb-6">
        Treatment pathway projection for newly diagnosed breast cancer (0–5 year horizon). Compares recurrence risk, symptom burden, quality of life, and cost by pathway. No life expectancy. Data: SEER, CMS, PubMed. Simulation runs only when you submit.
      </p>

      <Tabs defaultValue="projection" className="w-full">
        <TabsList>
          <TabsTrigger value="projection">Outcome Projection</TabsTrigger>
          <TabsTrigger value="centers">Find Centers</TabsTrigger>
        </TabsList>

        <TabsContent value="projection">
          <CareCompassForm setResults={setResults} />

          {results && (
            <ProjectionResults data={results as import("./lib/api").ProjectionResult} />
          )}
        </TabsContent>

        <TabsContent value="centers">
          <div className="mt-4">
            <HospitalMap />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


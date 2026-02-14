"use client";

import React, { useEffect, useState } from "react";
import type { ProjectionResult as ProjectionResultType, PathwayResult } from "../lib/api";

interface ProjectionResultsProps {
  data: ProjectionResultType;
}

const PATHWAY_LABELS: Record<string, string> = {
  lumpectomy_radiation: "Lumpectomy + radiation",
  mastectomy_no_recon: "Mastectomy without reconstruction",
  mastectomy_recon: "Mastectomy with reconstruction",
  chemotherapy_plus_surgery: "Chemotherapy + surgery",
  endocrine_therapy: "Endocrine therapy",
  her2_targeted: "HER2 targeted therapy",
  clinical_trial: "Clinical trial",
};

export default function ProjectionResults({ data }: ProjectionResultsProps) {
  const nIter = data.monte_carlo_n_iterations ?? 0;
  const timeSec = data.monte_carlo_computation_seconds ?? 0;

  return (
    <div className="mt-10 space-y-8 max-w-5xl">
      <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2">
        Results derived from Monte Carlo simulation using registry and clinical trial data.
      </p>
      <p className="text-sm text-gray-600">
        A Monte Carlo simulation with <strong>{nIter.toLocaleString()}</strong> iterations was run
        (computation time: <strong>{timeSec}</strong> s). 0–5 year horizon; no life expectancy estimated.
      </p>

      <PathwayComparisonTable pathways={data.pathways} />
      <PathwayChartsWithUncertainty pathways={data.pathways} />

      {data.data_provenance && (
        <p className="text-xs text-gray-500 border-t pt-4">{data.data_provenance}</p>
      )}
    </div>
  );
}

function PathwayComparisonTable({ pathways }: { pathways: PathwayResult[] }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Treatment pathway comparison</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Pathway</th>
              <th className="border border-gray-300 p-2 text-right">P(recurrence 5y)</th>
              <th className="border border-gray-300 p-2 text-right">95% SI</th>
              <th className="border border-gray-300 p-2 text-right">Cost (median, IQR)</th>
              <th className="border border-gray-300 p-2 text-right">Symptom months</th>
              <th className="border border-gray-300 p-2 text-right">QALM (5y)</th>
              <th className="border border-gray-300 p-2 text-right">P(major LTE)</th>
            </tr>
          </thead>
          <tbody>
            {pathways.map((p) => (
              <tr key={p.pathway} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 font-medium">
                  {PATHWAY_LABELS[p.pathway] ?? p.pathway}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {(p.probability_recurrence_5y * 100).toFixed(1)}%
                </td>
                <td className="border border-gray-300 p-2 text-right text-gray-600">
                  [{(p.probability_recurrence_5y_95_si_low * 100).toFixed(1)}%, {(p.probability_recurrence_5y_95_si_high * 100).toFixed(1)}%]
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  ${(p.cost_distribution.median / 1000).toFixed(0)}k (IQR ${(p.cost_distribution.iqr / 1000).toFixed(0)}k)
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {p.expected_symptom_months_moderate_severe.toFixed(1)}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {p.mean_quality_adjusted_months_5y.toFixed(1)}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {(p.probability_major_long_term_side_effect * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type ChartDatum = {
  pathwayLabel: string;
  recurrencePct: number;
  siLow: number;
  siHigh: number;
};

function PathwayChartsWithUncertainty({ pathways }: { pathways: PathwayResult[] }) {
  const [Chart, setChart] = useState<React.ComponentType<{ data: ChartDatum[] }> | null>(null);
  useEffect(() => {
    import("recharts").then((recharts) => {
      const { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } = recharts;
      setChart(() => function C({ data: chartData }: { data: ChartDatum[] }) {
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 140 }}>
              <XAxis type="number" domain={[0, "auto"]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="pathwayLabel" width={130} tick={{ fontSize: 10 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const d = payload[0].payload as ChartDatum;
                  return (
                    <div className="bg-white border rounded shadow-lg p-2 text-sm">
                      <div className="font-medium">{d.pathwayLabel}</div>
                      <div>P(recurrence 5y): {d.recurrencePct.toFixed(1)}%</div>
                      <div className="text-gray-600">95% SI: [{d.siLow.toFixed(1)}%, {d.siHigh.toFixed(1)}%]</div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="recurrencePct" name="P(recurrence 5y)" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        );
      });
    });
  }, []);

  const barData: ChartDatum[] = pathways.map((p) => ({
    pathwayLabel: PATHWAY_LABELS[p.pathway] ?? p.pathway,
    recurrencePct: Math.round(p.probability_recurrence_5y * 1000) / 10,
    siLow: Math.round(p.probability_recurrence_5y_95_si_low * 1000) / 10,
    siHigh: Math.round(p.probability_recurrence_5y_95_si_high * 1000) / 10,
  }));

  if (!Chart) return <div className="h-80 animate-pulse bg-gray-100 rounded" />;
  return (
    <section>
      <h3 className="text-sm font-medium text-gray-600 mb-2">
        P(recurrence within 5 years) by pathway (95% simulation interval in table and tooltip)
      </h3>
      <Chart data={barData} />
    </section>
  );
}

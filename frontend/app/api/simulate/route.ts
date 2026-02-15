const BACKEND_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** Mock response when backend is not running (same shape as backend). */
function mockSimulation(body: { age?: number; onset_time?: number; hospital_class?: string }) {
  const age = typeof body.age === "number" ? body.age : 65;
  const onset = typeof body.onset_time === "number" ? body.onset_time : 45;
  const hospital = body.hospital_class || "community";
  // Plausible demo values: better outcomes for younger, faster onset, academic
  const ageFactor = Math.max(0, 1 - (age - 50) / 100);
  const timeFactor = Math.max(0.3, 1 - onset / 120);
  const hospitalBonus = hospital === "academic" ? 0.08 : hospital === "stroke_center" ? 0.04 : 0;
  const independence = Math.min(0.85, 0.5 + ageFactor * 0.2 + timeFactor * 0.15 + hospitalBonus + (Math.random() * 0.05));
  const mortality = 1 - independence;
  return {
    results: {
      independence_rate: Math.round(independence * 1000) / 1000,
      mortality_rate: Math.round(mortality * 1000) / 1000,
      avg_time: 90 + onset * 0.5 + (Math.random() * 20),
    },
    variance: {},
    _demo: true,
  };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const res = await fetch(`${BACKEND_URL}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return Response.json(
        data || { error: res.statusText },
        { status: res.status }
      );
    }
    return Response.json(data);
  } catch {
    // Backend not running or deps missing: return mock so app works locally
    return Response.json(mockSimulation(body as { age?: number; onset_time?: number; hospital_class?: string }));
  }
}

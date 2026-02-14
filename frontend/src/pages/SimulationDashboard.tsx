import { useMemo, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { ArrowLeft, Share2, Download, Info, Award, User, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProjectionResult, PATHWAY_NAMES, calculateBestTreatment } from '../lib/api';

const SIMULATION_STORAGE_KEY = 'carecompass_simulation_results';

export function SimulationDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Try to get results from navigation state first, then from localStorage
  const getProjectionResults = (): ProjectionResult | null => {
    const stateResults = location.state?.projectionResults as ProjectionResult | undefined;
    if (stateResults) return stateResults;

    try {
      const stored = localStorage.getItem(SIMULATION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as ProjectionResult;
      }
    } catch (err) {
      console.error('Error loading simulation results from localStorage:', err);
    }
    return null;
  };

  const projectionResults = getProjectionResults();

  // Save results to localStorage when they come from navigation state
  useEffect(() => {
    if (location.state?.projectionResults) {
      try {
        localStorage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(location.state.projectionResults));
      } catch (err) {
        console.error('Error saving simulation results to localStorage:', err);
      }
    }
  }, [location.state?.projectionResults]);

  // If no results, redirect to profile page
  if (!projectionResults) {
    navigate('/profile');
    return null;
  }

  const bestPathway = calculateBestTreatment(projectionResults.pathways);

  // Prepare bar chart data - show recurrence probability from Monte Carlo simulation
  const chartData = useMemo(() => {
    return projectionResults.pathways.map(pathway => ({
      pathway: pathway.pathway,
      name: PATHWAY_NAMES[pathway.pathway] || pathway.pathway,
      recurrenceRate: pathway.probability_recurrence_5y * 100, // Show actual recurrence % from backend
      isBest: pathway.pathway === bestPathway
    }));
  }, [projectionResults.pathways, bestPathway]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm backdrop-blur bg-white/90">
        <div className="container mx-auto px-4 py-4">
           <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                 <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
               </Button>
               <h1 className="text-xl md:text-2xl font-bold text-slate-900">Treatment Pathway Comparison</h1>
             </div>
             <div className="hidden md:flex gap-2">
               <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
               <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Export</Button>
             </div>
           </div>

           {/* Profile Summary */}
           <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 ml-2 md:ml-12 bg-slate-50 p-2 rounded-md border border-slate-100 inline-flex">
              <span className="flex items-center gap-1 font-medium text-slate-900"><User className="h-3 w-3" /> Monte Carlo Results:</span>
              <span>{projectionResults.monte_carlo_n_iterations.toLocaleString()} iterations</span>
              <span className="text-slate-300">|</span>
              <span>{projectionResults.stage_sampled} / {projectionResults.subtype_sampled}</span>
              <span className="text-slate-300">|</span>
              <span>{projectionResults.horizon_years}-year projection</span>
              <Button variant="link" className="h-auto p-0 text-[#00BFB3] text-xs ml-2" onClick={() => navigate('/profile')}>Edit Profile</Button>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Introduction */}
        <div className="bg-gradient-to-r from-[#E91E63] to-[#D81B60] rounded-2xl p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Your Personalized Treatment Pathways</h2>
          <p className="text-lg text-pink-50">
            Based on {projectionResults.monte_carlo_n_iterations.toLocaleString()} Monte Carlo simulations tailored to your profile,
            we've analyzed all available treatment pathways. The recommended treatment is the one with the <strong>lowest 5-year recurrence probability</strong> from the simulation results.
          </p>
        </div>

        {/* Main Comparison Chart */}
        <Card className="shadow-xl border-t-4 border-t-[#00BFB3]">
          <CardHeader>
            <CardTitle className="text-2xl">5-Year Recurrence Probability by Pathway</CardTitle>
            <CardDescription>
              Direct results from Monte Carlo simulation. Lower is better. The recommended pathway (lowest recurrence) is highlighted in pink.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    label={{ value: 'Recurrence Probability (%)', angle: -90, position: 'insideLeft' }}
                    domain={[0, 'auto']}
                  />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border-2 border-slate-200 shadow-lg rounded-lg">
                            <p className="font-bold text-slate-900 mb-2">{data.name}</p>
                            {data.isBest && (
                              <Badge className="mb-2 bg-[#E91E63] text-white">Recommended (Lowest)</Badge>
                            )}
                            <div className="text-sm">
                              <p className="font-semibold text-slate-700">5-Year Recurrence: {data.recurrenceRate.toFixed(1)}%</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="recurrenceRate" name="5-Year Recurrence Probability">
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isBest ? '#E91E63' : '#94a3b8'}
                        stroke={entry.isBest ? '#D81B60' : 'transparent'}
                        strokeWidth={entry.isBest ? 3 : 0}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Best Treatment Callout */}
            {bestPathway && (
              <div className="mt-6 p-6 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-[#E91E63] rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#E91E63] rounded-full">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Recommended: {PATHWAY_NAMES[bestPathway] || bestPathway}
                    </h3>
                    <p className="text-slate-700">
                      Based on your profile and our Monte Carlo analysis, this pathway has the lowest predicted 5-year recurrence probability.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Metrics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Pathway Metrics</CardTitle>
            <CardDescription>
              Comprehensive breakdown of each treatment pathway's expected outcomes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-700">Pathway</th>
                    <th className="text-center p-3 font-semibold text-slate-700">5-Yr Recurrence</th>
                    <th className="text-center p-3 font-semibold text-slate-700">Quality Adjusted Life Months</th>
                    <th className="text-center p-3 font-semibold text-slate-700">Major Side Effects</th>
                    <th className="text-center p-3 font-semibold text-slate-700">Median Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {projectionResults.pathways.map((pathway) => {
                    const isBest = pathway.pathway === bestPathway;
                    return (
                      <tr
                        key={pathway.pathway}
                        className={`border-b border-slate-100 ${isBest ? 'bg-pink-50 border-l-4 border-l-[#E91E63]' : ''}`}
                      >
                        <td className="p-3 font-medium">
                          {PATHWAY_NAMES[pathway.pathway] || pathway.pathway}
                          {isBest && (
                            <Badge className="ml-2 bg-[#E91E63] text-white text-xs">Best</Badge>
                          )}
                        </td>
                        <td className="text-center p-3">
                          <span className="font-semibold">{(pathway.probability_recurrence_5y * 100).toFixed(1)}%</span>
                          <br />
                          <span className="text-xs text-slate-500">
                            ({(pathway.probability_recurrence_5y_95_si_low * 100).toFixed(1)}% - {(pathway.probability_recurrence_5y_95_si_high * 100).toFixed(1)}%)
                          </span>
                        </td>
                        <td className="text-center p-3 font-semibold">
                          {pathway.mean_quality_adjusted_months_5y.toFixed(1)} months
                        </td>
                        <td className="text-center p-3">
                          <span className={`font-semibold ${pathway.probability_major_long_term_side_effect < 0.15 ? 'text-green-600' : pathway.probability_major_long_term_side_effect < 0.30 ? 'text-amber-600' : 'text-red-600'}`}>
                            {(pathway.probability_major_long_term_side_effect * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-center p-3 font-semibold">
                          ${pathway.cost_distribution.median.toLocaleString()}
                          <br />
                          <span className="text-xs text-slate-500">
                            (IQR: ${pathway.cost_distribution.q1.toLocaleString()} - ${pathway.cost_distribution.q3.toLocaleString()})
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[#00BFB3]" />
                About This Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-2">
              <p>
                <strong>Iterations:</strong> {projectionResults.monte_carlo_n_iterations.toLocaleString()} simulations
              </p>
              <p>
                <strong>Computation Time:</strong> {projectionResults.monte_carlo_computation_seconds.toFixed(2)} seconds
              </p>
              <p>
                <strong>Time Horizon:</strong> {projectionResults.horizon_years} years
              </p>
              <p>
                <strong>Data Sources:</strong> {projectionResults.data_provenance}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              <p>
                This simulation is a decision support tool based on statistical models and population data.
                It should not replace consultation with your oncology team. Individual outcomes may vary based
                on factors not captured in this model. Always discuss treatment options with your healthcare providers.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Find Centers CTA */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-center md:text-left relative overflow-hidden text-white shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                 <h2 className="text-3xl font-bold">Ready to Find Treatment Centers?</h2>
                 <p className="text-slate-300 text-lg">
                   Now that you know which pathway is best for you, find top-rated hospitals and treatment centers
                   near you that offer {bestPathway && PATHWAY_NAMES[bestPathway]}.
                 </p>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00BFB3] to-[#00A69C] hover:from-[#00A69C] hover:to-[#008f85] text-white font-bold text-lg px-8 py-6 h-auto shadow-lg shadow-teal-500/20 whitespace-nowrap"
                onClick={() => navigate('/find-centers', { state: { bestPathway } })}
              >
                Find Treatment Centers <MapPin className="ml-2 h-5 w-5" />
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
}

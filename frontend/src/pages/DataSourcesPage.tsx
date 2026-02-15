import React from 'react';
import { Database, ExternalLink, CheckCircle2, AlertTriangle, Shield, RefreshCw, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function DataSourcesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-[#E0F2F1] py-16 border-b">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Transparency in <span className="text-[#00BFB3]">Healthcare Data</span>
          </h1>
          <p className="text-xl text-slate-600">
            Every statistic, every probability, every recommendation—traced back to its source.
          </p>
        </div>
      </section>

      {/* Primary Data Sources */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Primary Data Sources</h2>

          <div className="space-y-8">
            {/* SEER */}
            <Card className="border-l-4 border-l-[#00BFB3]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-[#00BFB3]" />
                  1. SEER Program (Surveillance, Epidemiology, and End Results)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">What We Use:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                    <li>Annual incidence per 100,000 population</li>
                    <li>Age-adjusted cancer rates</li>
                    <li>Stage distribution at diagnosis</li>
                    <li>5-year survival rates by stage</li>
                    <li>Demographic breakdowns (age, race, geography)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Why It Matters:</h4>
                  <p className="text-slate-700">
                    SEER provides validated, population-level probabilities that define the baseline probability of
                    disease, distribution of disease severity, and survival likelihoods conditional on stage. These
                    variables are foundational for our Monte Carlo model because they give us real-world epidemiological
                    data rather than anecdotal clinical findings.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <Badge variant="secondary">Free via SEER*Stat</Badge>
                  <Badge variant="secondary">NCI Operated</Badge>
                  <a href="https://seer.cancer.gov" target="_blank" rel="noopener noreferrer"
                     className="text-[#00BFB3] hover:underline flex items-center gap-1 text-sm">
                    seer.cancer.gov <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* PubMed */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-blue-600" />
                  2. PubMed / NCBI E-utilities API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">What We Use:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                    <li>Meta-analyses and randomized controlled trials (last 10 years)</li>
                    <li>Hazard ratios for treatment efficacy</li>
                    <li>Recurrence rates and progression-free survival</li>
                    <li>Treatment-specific survival outcomes</li>
                    <li>Confidence intervals and effect sizes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Why It Matters:</h4>
                  <p className="text-slate-700">
                    Automated literature retrieval through PubMed allows our Monte Carlo engine to simulate outcome
                    differences between treatment pathways using validated clinical trial data. We filter for
                    meta-analyses, systematic reviews, and RCTs with large sample sizes and clearly reported confidence
                    intervals. Studies older than 10 years are down-weighted to reflect evolving treatment standards.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Data Quality Safeguards:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4 text-sm">
                    <li>Only include studies labeled as "meta-analysis" or "randomized controlled trial"</li>
                    <li>Apply recency filters (publication date within last decade)</li>
                    <li>Extract sample sizes and weight effect sizes proportionally</li>
                    <li>Require confidence intervals; discard studies without uncertainty bounds</li>
                    <li>Cross-validate against SEER population-level data</li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <Badge variant="secondary">Free (rate-limited)</Badge>
                  <Badge variant="secondary">API access</Badge>
                  <a href="https://pubmed.ncbi.nlm.nih.gov" target="_blank" rel="noopener noreferrer"
                     className="text-[#00BFB3] hover:underline flex items-center gap-1 text-sm">
                    pubmed.ncbi.nlm.nih.gov <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* CMS */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  3. Centers for Medicare & Medicaid Services (CMS)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">What We Use:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                    <li>Hospital General Information (quality ratings, services offered)</li>
                    <li>Medicare Spending Per Beneficiary (MSPB) scores</li>
                    <li>Procedure billing frequencies and utilization rates</li>
                    <li>Regional treatment variability data</li>
                    <li>Hospital performance metrics and mortality rates</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Why It Matters:</h4>
                  <p className="text-slate-700">
                    CMS data provides real-world treatment adoption patterns and utilization rates. This helps model
                    the probability that a diagnosed patient actually receives specific therapies at different facilities.
                    Clinical trial efficacy does not equal real-world effectiveness, so these utilization rates are
                    essential for accurate outcome predictions. MSPB scores allow us to factor in cost efficiency when
                    comparing treatment centers.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <Badge variant="secondary">Free via data.cms.gov</Badge>
                  <Badge variant="secondary">~4,500 hospitals</Badge>
                  <a href="https://data.cms.gov" target="_blank" rel="noopener noreferrer"
                     className="text-[#00BFB3] hover:underline flex items-center gap-1 text-sm">
                    data.cms.gov <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* CDC */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-purple-600" />
                  4. Centers for Disease Control and Prevention (CDC)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">What We Use:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                    <li>Behavioral Risk Factor Surveillance System (BRFSS) data</li>
                    <li>Environmental exposure risk data</li>
                    <li>Geographic and demographic risk factors</li>
                    <li>Age, sex, and location-based risk stratification</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Why It Matters:</h4>
                  <p className="text-slate-700">
                    CDC datasets support probabilistic modeling of risk stratification by age, sex, and geography.
                    This allows our simulations to vary baseline risk based on environmental exposure rather than
                    assuming a uniform population. Risk factors can significantly affect treatment outcomes and
                    recurrence probabilities.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <Badge variant="secondary">Free public access</Badge>
                  <Badge variant="secondary">Population-level data</Badge>
                  <a href="https://www.cdc.gov/data" target="_blank" rel="noopener noreferrer"
                     className="text-[#00BFB3] hover:underline flex items-center gap-1 text-sm">
                    cdc.gov/data <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* ClinicalTrials.gov */}
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-amber-600" />
                  5. ClinicalTrials.gov
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">What We Use:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                    <li>Structured metadata on ongoing trials</li>
                    <li>Published results from completed trials</li>
                    <li>Treatment efficacy data for new interventions</li>
                    <li>Enrollment criteria and trial availability</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Why It Matters:</h4>
                  <p className="text-slate-700">
                    While this doesn't directly inform survival probabilities in our current model, it serves as a
                    forward-looking adjustment factor for modeling future projections beyond current standard of care.
                    It also helps identify emerging therapies and pipeline treatments that may become available.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <Badge variant="secondary">Free API access</Badge>
                  <Badge variant="secondary">450,000+ trials</Badge>
                  <a href="https://clinicaltrials.gov" target="_blank" rel="noopener noreferrer"
                     className="text-[#00BFB3] hover:underline flex items-center gap-1 text-sm">
                    clinicaltrials.gov <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Monte Carlo Parameters */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Monte Carlo Model Parameters</h2>

          <Card>
            <CardContent className="p-8">
              <p className="text-slate-700 mb-6">
                Our fully automated probabilistic framework extracts and integrates the following key parameters:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-[#00BFB3] mt-1">•</span>
                  <span>Annual incidence probability</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00BFB3] mt-1">•</span>
                  <span>Stage-at-diagnosis distribution</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00BFB3] mt-1">•</span>
                  <span>Stage-specific 5-year survival rates</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00BFB3] mt-1">•</span>
                  <span>Recurrence probabilities by treatment</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00BFB3] mt-1">•</span>
                  <span>Treatment-specific hazard ratios</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00BFB3] mt-1">•</span>
                  <span>Real-world treatment adoption rates</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00BFB3] mt-1">•</span>
                  <span>Cost distributions by pathway</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00BFB3] mt-1">•</span>
                  <span>Mortality variance across healthcare settings</span>
                </div>
              </div>
              <p className="text-slate-700 mt-6">
                Each simulation iteration samples from these distributions, applies treatment effect modifiers, and
                produces projected survival outcomes over a defined time horizon. This approach ingests validated
                registry data for baseline disease probability, integrates high-quality clinical trial effect sizes
                for treatment impact, and adjusts for real-world adoption rates.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* API Usage & Cost */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">API Usage & Cost</h2>

          <Card className="bg-green-50 border-green-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-900">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                All Data Sources Are Free
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>PubMed E-utilities:</strong> Free with rate limits (no per-call charges)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>SEER data:</strong> Free (requires registration)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>CMS data:</strong> Free through public endpoints</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>CDC datasets:</strong> Free public access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>ClinicalTrials.gov API:</strong> Free access</span>
                </li>
              </ul>
              <p className="text-slate-700 mt-4 text-sm">
                No commercial data providers or paid services are required for our core functionality.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Data Quality */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Data Quality & Validation</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Literature Quality Control</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>✓ Only meta-analyses and RCTs included</li>
                  <li>✓ Recency filters (10-year window)</li>
                  <li>✓ Sample size weighting applied</li>
                  <li>✓ Confidence intervals required</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cross-Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>✓ Literature vs. SEER population data</li>
                  <li>✓ Flag extreme deviations</li>
                  <li>✓ Exclude biased trial populations</li>
                  <li>✓ Maintain statistical robustness</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Continuous Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>✓ API-driven automated retrieval</li>
                  <li>✓ Quarterly data refreshes</li>
                  <li>✓ Eliminate manual literature review</li>
                  <li>✓ Evidence quality control maintained</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Your Data */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <Shield className="h-8 w-8 text-[#00BFB3]" />
            Your Data
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-green-700">✓ We Don't Collect</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-700 space-y-2">
                  <li>• Personal health information (PHI)</li>
                  <li>• Names, addresses, or identifiers</li>
                  <li>• Medical record numbers</li>
                  <li>• Social security numbers</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-[#00BFB3]">✓ What Stays Local</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-700 space-y-2">
                  <li>• Your health profile inputs</li>
                  <li>• Simulation parameters</li>
                  <li>• Search history</li>
                  <li>• Saved comparisons</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 bg-blue-50 border-blue-300">
            <CardContent className="p-6">
              <h4 className="font-bold text-slate-900 mb-2">What We Analyze Anonymously:</h4>
              <p className="text-slate-700 text-sm">
                Aggregate usage patterns (which features are used), search patterns (which conditions/locations),
                and performance metrics (load times, errors). See our <a href="/privacy" className="text-[#00BFB3] hover:underline">Privacy Policy</a> for details.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

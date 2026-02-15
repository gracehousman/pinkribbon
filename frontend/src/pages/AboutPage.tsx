import React from 'react';
import { motion } from 'motion/react';
import { Activity, Target, Heart, Shield, Users, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-[#E0F2F1] py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Making Healthcare Decisions Transparent, <br />
              <span className="text-[#00BFB3]">One Simulation at a Time</span>
            </h1>
            <p className="text-xl text-slate-600">
              CareCompass was born at TreeHacks 2026 from a simple question: Why do patients make life-or-death healthcare decisions with less data than they use to buy a coffee maker?
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Our Story</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">The Problem We're Solving</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Every year, millions of patients face critical healthcare decisions with incomplete information. You might research hospitals, read reviews, or ask friends—but you're still missing the most important piece: How do your personal health factors, combined with a specific facility's real-world performance, actually affect YOUR outcome?
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Traditional healthcare resources show you either generic success rates or hospital star ratings. But healthcare isn't one-size-fits-all. The same breast cancer patient going to two different hospitals 10 miles apart can have vastly different outcomes—and current tools don't help you see that.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Our Solution</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  CareCompass uses Monte Carlo simulation—the same probabilistic modeling technique used by NASA, Wall Street, and weather forecasters—to show you personalized outcome distributions. We combine:
                </p>
                <ul className="space-y-2 text-slate-600 ml-6">
                  <li className="flex items-start">
                    <span className="text-[#00BFB3] mr-2">•</span>
                    <span>Your individual health profile (age, severity, medical history)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00BFB3] mr-2">•</span>
                    <span>Real-world hospital performance data from CMS</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00BFB3] mr-2">•</span>
                    <span>Clinical trial evidence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00BFB3] mr-2">•</span>
                    <span>Geographic access constraints</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00BFB3] mr-2">•</span>
                    <span>Insurance and cost factors</span>
                  </li>
                </ul>
                <p className="text-slate-600 leading-relaxed mt-4">
                  The result? You see not just a single success rate, but a full probability distribution of possible outcomes, and more importantly, what factors you can actually control to improve your odds.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Why This Matters</h3>
                <p className="text-slate-600 leading-relaxed">
                  We believe patients deserve to see the variance in healthcare. Two patients with identical diagnoses can have wildly different outcomes based on which facility they choose, how quickly they arrive, and whether that facility actually follows evidence-based guidelines in practice.
                </p>
                <p className="text-slate-600 leading-relaxed mt-4">
                  Our platform makes that variance visible—and actionable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Our Mission</h2>
            <p className="text-xl text-slate-600 text-center mb-12">
              Empower patients with probabilistic clarity so they can make informed healthcare decisions based on real-world data, not just institutional reputation.
            </p>

            <h3 className="text-2xl font-semibold text-slate-900 mb-8 text-center">Our Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#E0F2F1] rounded-lg">
                      <Shield className="h-6 w-6 text-[#00BFB3]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Transparency First</h4>
                      <p className="text-sm text-slate-600">We show you our methodology, our data sources, and our uncertainty. No black boxes.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#E0F2F1] rounded-lg">
                      <Activity className="h-6 w-6 text-[#00BFB3]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Evidence-Based</h4>
                      <p className="text-sm text-slate-600">Every probability we show is grounded in peer-reviewed research, CMS data, and clinical trials.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#E0F2F1] rounded-lg">
                      <Heart className="h-6 w-6 text-[#00BFB3]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Patient-Centered</h4>
                      <p className="text-sm text-slate-600">Healthcare is complex. Our interface isn't. We translate statistical models into clear, actionable insights.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#E0F2F1] rounded-lg">
                      <Shield className="h-6 w-6 text-[#00BFB3]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Privacy-Protected</h4>
                      <p className="text-sm text-slate-600">Your health data never leaves your device. We don't store, sell, or share personal health information.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#E0F2F1] rounded-lg">
                      <Target className="h-6 w-6 text-[#00BFB3]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Equity-Focused</h4>
                      <p className="text-sm text-slate-600">We make institutional disparities visible so patients can navigate around them.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">The Team</h2>
            <Card className="bg-[#E0F2F1] border-[#00BFB3]/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">TreeHacks 2026 Project</h3>
                <p className="text-slate-700 leading-relaxed">
                  Built at Stanford's premier hackathon, combining expertise in computer science, healthcare policy, and data science.
                </p>
                <p className="text-slate-700 leading-relaxed mt-4">
                  This project draws on research from health economics, clinical medicine, and probabilistic modeling communities. Special thanks to our mentors and advisors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Next */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">What's Next</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Current Status</h3>
                <p className="text-slate-600">MVP focused on acute breast cancer treatment outcomes</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Coming Soon</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-[#00BFB3] mr-2">→</span>
                    <span>Sepsis outcomes modeling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00BFB3] mr-2">→</span>
                    <span>STEMI (heart attack) decisions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00BFB3] mr-2">→</span>
                    <span>Cancer treatment pathways</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00BFB3] mr-2">→</span>
                    <span>International data integration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00BFB3] mr-2">→</span>
                    <span>Real-time clinical trial matching</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Created By */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Created By</h2>
            <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-[#00BFB3]">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-900">
                  <div>
                    <p className="font-semibold text-lg">Grace Housman</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Rudy Pathak</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Shardul Marathe</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Priyanka Kudallur</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
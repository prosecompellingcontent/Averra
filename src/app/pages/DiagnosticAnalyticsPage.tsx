import { useState, useEffect } from "react";
import { Navigation } from "@/app/components/Navigation";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface DiagnosticAnalytics {
  totalCompletions: number;
  completionRate: number;
  primaryDiagnoses: Record<string, number>;
  secondaryDiagnoses: Record<string, number>;
  topCombinations: Array<{ combination: string; count: number }>;
  questionAnswerPatterns: Record<string, Record<string, number>>;
  conversionMetrics: {
    totalResults: number;
    ctaClicks: number;
    ctaClickRate: string;
    purchases: number;
    purchaseRate: string;
  };
  deviceBreakdown: Record<string, number>;
  lastUpdated: string;
}

const DIAGNOSIS_NAMES: Record<string, string> = {
  availability_trap: "The Availability Trap",
  emotional_labor_debt: "Emotional Labor Debt",
  fully_booked_illusion: "The Fully Booked Illusion",
  urgency_conditioning: "Urgency Conditioning",
  burnout_architecture: "Burnout Architecture",
  service_ceiling: "The Service Ceiling",
  identity_based_burnout: "Identity Based Burnout",
  nervous_system_business_models: "Nervous System Business Models",
  building_beyond_the_chair: "Building Beyond The Chair"
};

export function DiagnosticAnalyticsPage() {
  const [analytics, setAnalytics] = useState<DiagnosticAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/diagnostic-analytics`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf5f7]">
        <Navigation />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center text-[#251218]">
            Loading analytics...
          </div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-[#fdf5f7]">
        <Navigation />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center text-red-600">
            {error || "Failed to load analytics"}
          </div>
          <button
            onClick={fetchAnalytics}
            className="mt-4 mx-auto block px-6 py-2 bg-[#c9969e] text-white rounded hover:bg-[#b08890]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf5f7]">
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl text-[#251218] mb-4">
            Diagnostic Analytics
          </h1>
          <p className="font-['Lora'] text-lg text-[#6b585d]">
            AVERRA Diagnostic System Performance Insights
          </p>
          <p className="font-['Montserrat'] text-sm text-[#a0908c] mt-2">
            Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#e5d5d8]">
            <h3 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#6b585d] mb-2">
              Total Completions
            </h3>
            <p className="font-['Playfair_Display'] text-4xl text-[#251218]">
              {analytics.totalCompletions}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#e5d5d8]">
            <h3 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#6b585d] mb-2">
              CTA Click Rate
            </h3>
            <p className="font-['Playfair_Display'] text-4xl text-[#251218]">
              {analytics.conversionMetrics.ctaClickRate}%
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#e5d5d8]">
            <h3 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#6b585d] mb-2">
              Purchase Rate
            </h3>
            <p className="font-['Playfair_Display'] text-4xl text-[#251218]">
              {analytics.conversionMetrics.purchaseRate}%
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#e5d5d8]">
            <h3 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#6b585d] mb-2">
              Total Purchases
            </h3>
            <p className="font-['Playfair_Display'] text-4xl text-[#251218]">
              {analytics.conversionMetrics.purchases}
            </p>
          </div>
        </div>

        {/* Primary Diagnoses */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-[#e5d5d8] mb-8">
          <h2 className="font-['Playfair_Display'] text-3xl text-[#251218] mb-6">
            Primary Diagnoses
          </h2>
          <div className="space-y-4">
            {Object.entries(analytics.primaryDiagnoses)
              .sort(([, a], [, b]) => b - a)
              .map(([diagnosis, count]) => {
                const percentage = ((count / analytics.totalCompletions) * 100).toFixed(1);
                return (
                  <div key={diagnosis}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-['Lora'] text-[#251218]">
                        {DIAGNOSIS_NAMES[diagnosis] || diagnosis}
                      </span>
                      <span className="font-['Montserrat'] text-sm text-[#6b585d]">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#f6f3ec] rounded-full h-2">
                      <div
                        className="bg-[#c9969e] h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Top Diagnosis Combinations */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-[#e5d5d8] mb-8">
          <h2 className="font-['Playfair_Display'] text-3xl text-[#251218] mb-6">
            Top Diagnosis Combinations
          </h2>
          <div className="space-y-3">
            {analytics.topCombinations.map((combo, index) => {
              const [primary, secondary] = combo.combination.split('+');
              return (
                <div key={index} className="flex justify-between items-center py-3 border-b border-[#e5d5d8] last:border-0">
                  <div>
                    <span className="font-['Lora'] text-[#251218]">
                      {DIAGNOSIS_NAMES[primary] || primary}
                    </span>
                    <span className="font-['Montserrat'] text-sm text-[#6b585d] mx-2">+</span>
                    <span className="font-['Lora'] text-[#6b585d]">
                      {secondary === 'none' ? 'No Secondary' : DIAGNOSIS_NAMES[secondary] || secondary}
                    </span>
                  </div>
                  <span className="font-['Montserrat'] text-sm font-medium text-[#251218]">
                    {combo.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-[#e5d5d8] mb-8">
          <h2 className="font-['Playfair_Display'] text-3xl text-[#251218] mb-6">
            Device Breakdown
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analytics.deviceBreakdown).map(([device, count]) => {
              const percentage = ((count / analytics.totalCompletions) * 100).toFixed(1);
              return (
                <div key={device} className="text-center p-4 bg-[#fcf3f5] rounded-lg">
                  <p className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#6b585d] mb-2">
                    {device}
                  </p>
                  <p className="font-['Playfair_Display'] text-3xl text-[#251218]">
                    {count}
                  </p>
                  <p className="font-['Montserrat'] text-xs text-[#a0908c] mt-1">
                    {percentage}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Selected Answers by Question */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-[#e5d5d8]">
          <h2 className="font-['Playfair_Display'] text-3xl text-[#251218] mb-6">
            Most Selected Answers
          </h2>
          <div className="space-y-6">
            {Object.entries(analytics.questionAnswerPatterns)
              .sort(([a], [b]) => {
                const numA = parseInt(a.split('_')[1]);
                const numB = parseInt(b.split('_')[1]);
                return numA - numB;
              })
              .map(([question, answers]) => {
                const questionNum = question.split('_')[1];
                const topAnswer = Object.entries(answers).sort(([, a], [, b]) => b - a)[0];
                if (!topAnswer) return null;

                return (
                  <div key={question} className="pb-4 border-b border-[#e5d5d8] last:border-0">
                    <h3 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#6b585d] mb-2">
                      Question {questionNum}
                    </h3>
                    <p className="font-['Lora'] text-[#251218] mb-2">
                      "{topAnswer[0]}"
                    </p>
                    <p className="font-['Montserrat'] text-xs text-[#a0908c]">
                      Selected {topAnswer[1]} times ({((topAnswer[1] / analytics.totalCompletions) * 100).toFixed(1)}%)
                    </p>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchAnalytics}
            className="px-8 py-3 bg-[#c9969e] text-white font-['Montserrat'] uppercase tracking-wider text-sm rounded hover:bg-[#b08890] transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}

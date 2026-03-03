import { useState, useEffect } from "react";
import { Navigation } from "@/app/components/Navigation";
import { getAnalyticsSummary } from "@/utils/analytics";

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalyticsSummary();
      if (data) {
        setAnalytics(data);
      } else {
        setError("Failed to load analytics data");
      }
    } catch (err) {
      setError("Error loading analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DCDACC] text-[#301710]">
      <Navigation />
      <div className="max-w-6xl mx-auto px-8 py-32">
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-5xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
              Analytics Dashboard
            </h1>
            <p className="text-lg text-[#654331] font-light">
              Track quiz completions and user behavior
            </p>
          </div>
          <button
            onClick={loadAnalytics}
            className="px-6 py-3 bg-[#301710] text-[#DCDACC] text-sm uppercase tracking-[0.3em] font-light hover:bg-[#654331] transition-all"
          >
            Refresh Data
          </button>
        </div>

        {loading && (
          <div className="text-center py-20">
            <p className="text-xl text-[#654331] font-light">Loading analytics...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-8">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && analytics && (
          <div className="space-y-8">
            {/* Quiz Completions Overview */}
            <div className="bg-[#BFBBA7] p-8">
              <h2 className="text-3xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                Quiz Performance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#DCDACC] p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#654331] mb-2">Total Completions</p>
                  <p className="text-4xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                    {analytics.totalQuizCompletions}
                  </p>
                </div>
                <div className="bg-[#DCDACC] p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#654331] mb-2">Essentials</p>
                  <p className="text-4xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                    {analytics.tierRecommendations['AVERRA Essentials'] || 0}
                  </p>
                </div>
                <div className="bg-[#DCDACC] p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#654331] mb-2">Signature</p>
                  <p className="text-4xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                    {analytics.tierRecommendations['AVERRA Signature'] || 0}
                  </p>
                </div>
                <div className="bg-[#DCDACC] p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#654331] mb-2">Muse</p>
                  <p className="text-4xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                    {analytics.tierRecommendations['AVERRA Muse'] || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Tier Distribution */}
            <div className="bg-[#BFBBA7] p-8">
              <h2 className="text-3xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                Tier Recommendations Distribution
              </h2>
              <div className="space-y-4">
                {Object.entries(analytics.tierRecommendations).map(([tier, count]: [string, any]) => {
                  const percentage = analytics.totalQuizCompletions > 0 
                    ? ((count / analytics.totalQuizCompletions) * 100).toFixed(1)
                    : 0;
                  return (
                    <div key={tier}>
                      <div className="flex justify-between mb-2">
                        <span className="text-[#301710] font-light">{tier}</span>
                        <span className="text-[#654331] font-light">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-[#DCDACC] h-3">
                        <div
                          className="h-full bg-[#301710] transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* User Actions */}
            <div className="bg-[#BFBBA7] p-8">
              <h2 className="text-3xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                User Actions
              </h2>
              <div className="mb-4">
                <p className="text-lg text-[#654331] font-light">
                  Total Actions Tracked: <span className="text-[#301710]">{analytics.totalActions}</span>
                </p>
              </div>
              {Object.keys(analytics.actionBreakdown).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(analytics.actionBreakdown).map(([action, count]: [string, any]) => (
                    <div key={action} className="bg-[#DCDACC] p-4 flex justify-between items-center">
                      <span className="text-[#301710] font-light">{action}</span>
                      <span className="text-2xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#654331] font-light italic">No user actions tracked yet</p>
              )}
            </div>

            {/* Cookie Consent Analytics */}
            {analytics.actionBreakdown['cookie_consent'] && (
              <div className="bg-[#BFBBA7] p-8">
                <h2 className="text-3xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                  Cookie Consent Preferences
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-[#DCDACC] p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#654331] mb-2">Total Consents</p>
                    <p className="text-4xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                      {analytics.actionBreakdown['cookie_consent']}
                    </p>
                  </div>
                  <div className="bg-[#DCDACC] p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#654331] mb-2">Consent Rate</p>
                    <p className="text-4xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                      {analytics.totalActions > 0 
                        ? ((analytics.actionBreakdown['cookie_consent'] / analytics.totalActions) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[#654331] font-light italic">
                  Detailed consent preferences (Accept All vs Custom) are stored with each action event
                </p>
              </div>
            )}

            {/* Last Updated */}
            <div className="text-center text-sm text-[#654331] font-light">
              Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
            </div>
          </div>
        )}

        {!loading && !error && !analytics && (
          <div className="text-center py-20">
            <p className="text-xl text-[#654331] font-light">No analytics data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
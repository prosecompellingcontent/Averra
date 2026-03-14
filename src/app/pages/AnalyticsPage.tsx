import { useState, useEffect } from "react";
import { Navigation } from "@/app/components/Navigation";
import { getAnalyticsSummary } from "@/utils/analytics";
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface SaleData {
  saleId: string;
  customerName: string;
  customerEmail: string;
  serviceTier: string;
  totalPrice: string;
  createdAt: string;
  onboardingStatus: string;
  strategySessionBooked: boolean;
}

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [pendingOnboarding, setPendingOnboarding] = useState<SaleData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load quiz analytics
      const quizData = await getAnalyticsSummary();
      if (quizData) {
        setAnalytics(quizData);
      }

      // Load sales data
      const salesResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/sales-data`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (salesResponse.ok) {
        const salesJson = await salesResponse.json();
        setSalesData(salesJson.sales || []);
        setTotalRevenue(salesJson.totalRevenue || 0);
      }

      // Load pending onboarding
      const onboardingResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/pending-onboarding`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (onboardingResponse.ok) {
        const onboardingJson = await onboardingResponse.json();
        setPendingOnboarding(onboardingJson.pendingClients || []);
      }
    } catch (err) {
      setError("Error loading analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate sales by tier
  const salesByTier = salesData.reduce((acc: any, sale) => {
    const tier = sale.serviceTier || 'Other';
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {});

  const revenueByTier = salesData.reduce((acc: any, sale) => {
    const tier = sale.serviceTier || 'Other';
    const amount = parseFloat(sale.totalPrice) || 0;
    acc[tier] = (acc[tier] || 0) + amount;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#DCDACC] text-[#301710] pb-32 md:pb-0">
      <Navigation />
      <div className="max-w-6xl mx-auto px-8 py-32">
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-5xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
              Analytics Dashboard
            </h1>
            <p className="text-lg text-[#654331] font-light">
              Track sales, revenue, and customer engagement
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

        {!loading && !error && (
          <div className="space-y-8">
            {/* Revenue Overview */}
            <div className="bg-[#BFBBA7] p-8">
              <h2 className="text-3xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                Revenue & Sales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#DCDACC] p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#654331] mb-2">Total Revenue</p>
                  <p className="text-4xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                    ${totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="bg-[#DCDACC] p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#654331] mb-2">Total Sales</p>
                  <p className="text-4xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                    {salesData.length}
                  </p>
                </div>
                <div className="bg-[#DCDACC] p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#654331] mb-2">Avg Order Value</p>
                  <p className="text-4xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                    ${salesData.length > 0 ? (totalRevenue / salesData.length).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="bg-[#DCDACC] p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#654331] mb-2">Pending Onboarding</p>
                  <p className="text-4xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                    {pendingOnboarding.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Sales by Tier */}
            {Object.keys(salesByTier).length > 0 && (
              <div className="bg-[#BFBBA7] p-8">
                <h2 className="text-3xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                  Sales by Service Tier
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(salesByTier).map(([tier, count]: [string, any]) => (
                    <div key={tier} className="bg-[#DCDACC] p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#654331] mb-2">{tier}</p>
                      <p className="text-3xl text-[#301710] mb-1" style={{ fontFamily: 'Cormorant, serif' }}>
                        {count} sales
                      </p>
                      <p className="text-lg text-[#654331]">
                        ${(revenueByTier[tier] || 0).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Client Onboarding */}
            {pendingOnboarding.length > 0 && (
              <div className="bg-[#BFBBA7] p-8">
                <h2 className="text-3xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                  🚀 Pending Strategy Sessions
                </h2>
                <p className="text-[#654331] mb-4 font-light">
                  These clients have paid but haven't booked their strategy session yet
                </p>
                <div className="space-y-3">
                  {pendingOnboarding.slice(0, 5).map((client) => (
                    <div key={client.saleId} className="bg-[#DCDACC] p-4 flex justify-between items-center">
                      <div>
                        <p className="text-[#301710] font-medium">{client.customerName}</p>
                        <p className="text-sm text-[#654331]">{client.customerEmail}</p>
                        <p className="text-xs text-[#654331]/70">{client.serviceTier}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                          ${client.totalPrice}
                        </p>
                        <p className="text-xs text-[#654331]/70">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Sales */}
            {salesData.length > 0 && (
              <div className="bg-[#BFBBA7] p-8">
                <h2 className="text-3xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                  Recent Sales
                </h2>
                <div className="space-y-3">
                  {salesData.slice(0, 10).map((sale) => (
                    <div key={sale.saleId} className="bg-[#DCDACC] p-4 flex justify-between items-center">
                      <div>
                        <p className="text-[#301710] font-medium">{sale.customerName}</p>
                        <p className="text-sm text-[#654331]">{sale.serviceTier}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                          ${sale.totalPrice}
                        </p>
                        <p className="text-xs text-[#654331]/70">
                          {new Date(sale.createdAt).toLocaleDateString()}
                        </p>
                        {sale.strategySessionBooked && (
                          <p className="text-xs text-green-600">✓ Session Booked</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Performance */}
            {analytics && (
              <>
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
                {Object.keys(analytics.tierRecommendations).length > 0 && (
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
                )}
              </>
            )}

            {/* Last Updated */}
            <div className="text-center text-sm text-[#654331] font-light">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        )}

        {!loading && !error && !analytics && salesData.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-[#654331] font-light">No analytics data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
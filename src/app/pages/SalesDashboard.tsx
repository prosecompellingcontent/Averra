import { useState, useEffect } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Sale {
  saleId: string;
  orderId: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: string;
  totalPrice: string;
  paymentId: string;
  brandName: string;
  industry: string;
  targetAudience: string;
  goals: string;
  instagramHandle?: string;
  website?: string;
  businessStage?: string;
  brandPerception?: string;
  fullBrandIntakeData?: any;
}

export function SalesDashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/sales-data`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }

      const data = await response.json();
      setSales(data.sales || []);
      setTotalRevenue(data.totalRevenue || 0);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#DCDACC]">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
            Sales Dashboard
          </h1>
          <p className="text-[#301710]/70 text-lg">
            Track all purchases with brand alignment form data
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/60 backdrop-blur-sm border border-[#301710]/20 p-6">
            <h3 className="text-sm uppercase tracking-wider text-[#301710]/60 mb-2">Total Sales</h3>
            <p className="text-4xl font-light text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
              {sales.length}
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm border border-[#301710]/20 p-6">
            <h3 className="text-sm uppercase tracking-wider text-[#301710]/60 mb-2">Total Revenue</h3>
            <p className="text-4xl font-light text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
              ${totalRevenue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-[#301710]/20 p-6">
            <h3 className="text-sm uppercase tracking-wider text-[#301710]/60 mb-2">Avg Order Value</h3>
            <p className="text-4xl font-light text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
              ${sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-[#301710]/60">Loading sales data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-6 text-red-800">
            {error}
          </div>
        ) : sales.length === 0 ? (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm border border-[#301710]/20">
            <p className="text-[#301710]/60 text-lg">No sales yet</p>
            <p className="text-[#301710]/40 text-sm mt-2">Sales will appear here once customers complete checkout</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <div
                key={sale.saleId}
                className="bg-white/60 backdrop-blur-sm border border-[#301710]/20 p-6 hover:bg-white/80 transition-all cursor-pointer"
                onClick={() => setSelectedSale(sale)}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Date</p>
                    <p className="text-sm text-[#301710]">{formatDate(sale.createdAt)}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Customer</p>
                    <p className="text-sm text-[#301710] font-medium">{sale.customerName}</p>
                    <p className="text-xs text-[#301710]/60">{sale.customerEmail}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Brand Name</p>
                    <p className="text-sm text-[#301710] font-medium">{sale.brandName}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Items</p>
                    <p className="text-sm text-[#301710]">{sale.items}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Total</p>
                    <p className="text-xl font-light text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                      ${sale.totalPrice}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sale Detail Modal */}
        {selectedSale && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSale(null)}
          >
            <div
              className="bg-[#DCDACC] max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#301710]/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#301710] p-6 flex justify-between items-center z-10">
                <h2 className="text-3xl text-[#DCDACC]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                  Sale Details
                </h2>
                <button
                  onClick={() => setSelectedSale(null)}
                  className="text-[#DCDACC] hover:text-[#BFBBA7] text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Order Information */}
                <section>
                  <h3 className="text-xl text-[#301710] mb-4 pb-2 border-b border-[#301710]/20" style={{ fontFamily: 'Cormorant, serif' }}>
                    Order Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Order Date</p>
                      <p className="text-sm text-[#301710]">{formatDate(selectedSale.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Order ID</p>
                      <p className="text-sm text-[#301710] font-mono text-xs break-all">{selectedSale.orderId}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Payment ID</p>
                      <p className="text-sm text-[#301710] font-mono text-xs break-all">{selectedSale.paymentId}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Total Amount</p>
                      <p className="text-2xl font-light text-[#301710]" style={{ fontFamily: 'Cormorant, serif' }}>
                        ${selectedSale.totalPrice}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Customer Information */}
                <section>
                  <h3 className="text-xl text-[#301710] mb-4 pb-2 border-b border-[#301710]/20" style={{ fontFamily: 'Cormorant, serif' }}>
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Name</p>
                      <p className="text-sm text-[#301710]">{selectedSale.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Email</p>
                      <p className="text-sm text-[#301710]">{selectedSale.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Phone</p>
                      <p className="text-sm text-[#301710]">{selectedSale.customerPhone}</p>
                    </div>
                  </div>
                </section>

                {/* Items Purchased */}
                <section>
                  <h3 className="text-xl text-[#301710] mb-4 pb-2 border-b border-[#301710]/20" style={{ fontFamily: 'Cormorant, serif' }}>
                    Items Purchased
                  </h3>
                  <p className="text-sm text-[#301710]">{selectedSale.items}</p>
                </section>

                {/* Brand Alignment Form Data */}
                {selectedSale.fullBrandIntakeData && (
                  <section>
                    <h3 className="text-xl text-[#301710] mb-4 pb-2 border-b border-[#301710]/20" style={{ fontFamily: 'Cormorant, serif' }}>
                      Brand Alignment Form
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Brand Name</p>
                        <p className="text-sm text-[#301710]">{selectedSale.brandName}</p>
                      </div>
                      
                      {selectedSale.instagramHandle && selectedSale.instagramHandle !== 'N/A' && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Instagram Handle</p>
                          <p className="text-sm text-[#301710]">{selectedSale.instagramHandle}</p>
                        </div>
                      )}

                      {selectedSale.website && selectedSale.website !== 'N/A' && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Website</p>
                          <p className="text-sm text-[#301710]">{selectedSale.website}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Industry / Services</p>
                        <p className="text-sm text-[#301710]">{selectedSale.industry}</p>
                      </div>

                      {selectedSale.businessStage && selectedSale.businessStage !== 'N/A' && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Business Stage</p>
                          <p className="text-sm text-[#301710]">{selectedSale.businessStage}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Target Audience / Ideal Client</p>
                        <p className="text-sm text-[#301710]">{selectedSale.targetAudience}</p>
                      </div>

                      {selectedSale.brandPerception && selectedSale.brandPerception !== 'N/A' && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Brand Perception</p>
                          <p className="text-sm text-[#301710]">{selectedSale.brandPerception}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#301710]/60 mb-1">Goals</p>
                        <p className="text-sm text-[#301710]">{selectedSale.goals}</p>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              <div className="sticky bottom-0 bg-[#301710] p-6">
                <button
                  onClick={() => setSelectedSale(null)}
                  className="w-full px-8 py-3 bg-[#DCDACC] text-[#301710] text-sm uppercase tracking-[0.3em] hover:bg-[#BFBBA7] transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

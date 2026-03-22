import { useSearchParams } from "react-router";
import { Navigation } from "@/app/components/Navigation";
import { Download, Lock, Unlock, AlertCircle, CheckCircle, Package, Smartphone, Monitor } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface DownloadItem {
  name: string;
  quantity: number;
  zipUrl: string;
}

interface DownloadData {
  customer_name: string;
  downloads: DownloadItem[];
  has_service: boolean;
}

export function DownloadsPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [email, setEmail] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadData, setDownloadData] = useState<DownloadData | null>(null);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/downloads/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setError('Email does not match. Please use the email address from your purchase.');
        } else if (response.status === 404) {
          setError('Order not found. Please check your session link or contact support.');
        } else {
          setError(data.error || 'Unable to verify your order. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      setDownloadData(data);
      setIsUnlocked(true);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Missing session ID
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-[#F7F3EF] pb-32 md:pb-0">
        <Navigation />
        
        <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
          <div className="bg-white/60 backdrop-blur-sm border border-[#b76e79]/20 p-12 shadow-lg text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#301710]/10 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-[#b76e79]" />
              </div>
            </div>
            
            <h1 className="text-4xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              Missing Session Link
            </h1>
            
            <p className="text-[#654331]/80 mb-6" style={{ fontFamily: 'Lora, serif' }}>
              Please use the download link from your purchase confirmation email.
            </p>
            
            <p className="text-[#654331]/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Can't find your email? Check your spam folder or reply to your order confirmation for assistance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EF] pb-32 md:pb-0">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#b76e79]/20 blur-2xl animate-pulse"></div>
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#b76e79]/20 to-[#301710]/10 border-2 border-[#b76e79]/30 flex items-center justify-center backdrop-blur-sm">
                {isUnlocked ? (
                  <Unlock className="w-16 h-16 text-[#b76e79]" strokeWidth={1.5} />
                ) : (
                  <Lock className="w-16 h-16 text-[#b76e79]" strokeWidth={1.5} />
                )}
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl text-[#301710] mb-3" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300, fontStyle: 'italic' }}>
            {isUnlocked ? 'Your Downloads' : 'Unlock Your Downloads'}
          </h1>
          
          <p className="text-xl md:text-2xl text-[#654331] tracking-[0.2em] uppercase mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: '11px' }}>
            {isUnlocked ? 'Ready to Download' : 'Secure Access Required'}
          </p>

          {!isUnlocked && (
            <p className="text-lg text-[#654331]/80 max-w-2xl mx-auto" style={{ fontFamily: 'Lora, serif' }}>
              Enter the email address you used at checkout to access your digital products.
            </p>
          )}
        </div>

        {/* Unlock Form */}
        {!isUnlocked && (
          <div className="max-w-xl mx-auto mb-12">
            <form onSubmit={handleUnlock} className="bg-white/60 backdrop-blur-sm border border-[#b76e79]/20 p-8 shadow-lg">
              <label className="block text-[#301710] mb-3 font-semibold" style={{ fontFamily: 'Lora, serif' }}>
                Your Email Address
              </label>
              
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@email.com"
                required
                className="mb-4 bg-white/80 border-[#301710]/20 focus:border-[#b76e79] text-[#301710]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#301710] text-[#DCDACC] hover:bg-[#301710]/90 py-6 uppercase tracking-[0.3em]"
                style={{ fontFamily: 'Lora, serif', fontWeight: 600, fontSize: '11px' }}
              >
                {isLoading ? 'Verifying...' : 'Unlock Downloads →'}
              </Button>
            </form>
          </div>
        )}

        {/* Downloads Display */}
        {isUnlocked && downloadData && (
          <>
            <div className="mb-8">
              <p className="text-center text-[#654331] mb-2" style={{ fontFamily: 'Lora, serif' }}>
                Welcome back, <span className="font-semibold text-[#301710]">{downloadData.customer_name}</span>
              </p>
            </div>

            {/* Download Cards */}
            {downloadData.downloads.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {downloadData.downloads.map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white/60 backdrop-blur-sm border border-[#b76e79]/20 p-8 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#b76e79]/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
                    
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#301710]/10 flex items-center justify-center">
                          <Package className="w-6 h-6 text-[#301710]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl text-[#301710] font-semibold" style={{ fontFamily: 'Cormorant, serif' }}>
                            {item.name}
                          </h3>
                          {item.quantity > 1 && (
                            <p className="text-[#654331]/60 text-sm">Quantity: {item.quantity}</p>
                          )}
                        </div>
                      </div>

                      <a
                        href={item.zipUrl}
                        download
                        className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-[#301710] text-[#DCDACC] uppercase tracking-[0.3em] hover:bg-[#301710]/90 transition-all shadow-md hover:shadow-lg w-full justify-center"
                        style={{ fontFamily: 'Lora, serif', fontWeight: 600, fontSize: '11px' }}
                      >
                        <Download className="w-4 h-4" />
                        Download ZIP
                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-sm border border-[#b76e79]/20 p-12 shadow-lg text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-[#301710]/10 flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-[#b76e79]" />
                  </div>
                </div>
                
                <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                  No Digital Downloads Found
                </h3>
                
                <p className="text-[#654331]/80 mb-4" style={{ fontFamily: 'Lora, serif' }}>
                  This order doesn't contain any digital products that can be downloaded.
                </p>
                
                <p className="text-[#654331]/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  If you believe this is an error, please reply to your purchase confirmation email for assistance.
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white/60 backdrop-blur-sm border border-[#b76e79]/20 p-8 shadow-lg mb-12">
              <h2 className="text-2xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                How to Unzip Your Files
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Smartphone className="w-5 h-5 text-[#b76e79] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-[#301710] font-semibold mb-1" style={{ fontFamily: 'Lora, serif' }}>
                        iPhone / iPad
                      </p>
                      <p className="text-[#654331]/70 text-sm">
                        Open Files app → Downloads → Tap ZIP file to extract
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Smartphone className="w-5 h-5 text-[#b76e79] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-[#301710] font-semibold mb-1" style={{ fontFamily: 'Lora, serif' }}>
                        Android
                      </p>
                      <p className="text-[#654331]/70 text-sm">
                        Files or Downloads app → Tap ZIP → Extract
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Monitor className="w-5 h-5 text-[#b76e79] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-[#301710] font-semibold mb-1" style={{ fontFamily: 'Lora, serif' }}>
                        Mac
                      </p>
                      <p className="text-[#654331]/70 text-sm">
                        Double-click the ZIP file to extract
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Monitor className="w-5 h-5 text-[#b76e79] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-[#301710] font-semibold mb-1" style={{ fontFamily: 'Lora, serif' }}>
                        Windows
                      </p>
                      <p className="text-[#654331]/70 text-sm">
                        Right-click ZIP → Extract All
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Tier Next Steps */}
            {downloadData.has_service && (
              <div className="bg-white/60 backdrop-blur-sm border border-[#b76e79]/20 p-8 shadow-lg mb-12">
                <h2 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                  📅 Next Steps: Your Branding Service
                </h2>
                
                <p className="text-[#654331]/80 mb-6" style={{ fontFamily: 'Lora, serif' }}>
                  You've also purchased a branding service tier. Check your email for your Calendly booking link to schedule your strategy session.
                </p>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#b76e79] flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-[#b76e79]" />
                  </div>
                  <p className="text-[#654331]/70 text-sm">
                    Your Calendly link was sent to <strong>{email}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Support */}
            <div className="text-center py-8 border-t border-[#301710]/10">
              <p className="text-[#654331]/60 text-sm mb-2" style={{ fontFamily: 'Lora, serif' }}>
                Need help or have questions?
              </p>
              <p className="text-[#654331]/80" style={{ fontFamily: 'Lora, serif' }}>
                Reply to your purchase confirmation email for support.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { setAnalyticsConsent } from '@/utils/analytics';
import { useIsMobile } from '@/app/hooks/useIsMobile';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, can't be disabled
    analytical: true,
  });
  
  // Hook must be called before any conditional returns
  const isMobile = useIsMobile();

  // Handle mounting to prevent SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    try {
      // Check if user has already consented
      const consent = localStorage.getItem('averra_cookie_consent');
      if (!consent) {
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error checking cookie consent:', error);
      // If localStorage fails, don't show cookie consent to avoid crashes
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      const preferences = {
        essential: true,
        analytical: true,
      };
      
      // Save to localStorage
      localStorage.setItem('averra_cookie_consent', 'accepted');
      localStorage.setItem('averra_cookie_preferences', JSON.stringify(preferences));
      
      setIsVisible(false);
      
      // Track in Supabase (don't await, let it happen in background)
      setAnalyticsConsent('accepted_all', preferences);
    } catch (error) {
      console.error('Error accepting cookies:', error);
      // Still hide the modal even if localStorage fails
      setIsVisible(false);
    }
  };

  const handleSavePreferences = () => {
    try {
      // Save to localStorage
      localStorage.setItem('averra_cookie_consent', 'custom');
      localStorage.setItem('averra_cookie_preferences', JSON.stringify(cookiePreferences));
      
      setIsVisible(false);
      
      // Track in Supabase (don't await, let it happen in background)
      setAnalyticsConsent('custom', cookiePreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Still hide the modal even if localStorage fails
      setIsVisible(false);
    }
  };

  const togglePreference = (key: keyof typeof cookiePreferences) => {
    if (key === 'essential') return; // Can't disable essential cookies
    setCookiePreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible || !isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[9999] border-t shadow-2xl overflow-hidden"
          style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            backgroundColor: showMoreInfo ? 'rgba(220, 218, 204, 0.98)' : 'rgba(48, 23, 16, 0.4)',
            borderColor: showMoreInfo ? 'rgba(101, 67, 49, 0.6)' : 'rgba(101, 67, 49, 0.4)',
            backdropFilter: showMoreInfo ? 'blur(0px)' : 'blur(12px)',
          }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ 
            opacity: { duration: 0.3 },
            y: { duration: 0.3 },
            backgroundColor: { duration: 0.6, ease: 'easeInOut' },
            borderColor: { duration: 0.6, ease: 'easeInOut' },
            backdropFilter: { duration: 0.6, ease: 'easeInOut' },
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {!showMoreInfo ? (
                // Initial Cookie Notice - Compact Strip Banner
                <motion.div 
                  key="compact"
                  className="py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <div className="flex-1">
                    <p className="text-[10px] sm:text-xs text-[#DCDACC]/90 font-light leading-snug">
                      <span className="font-semibold" style={{ fontFamily: 'Cormorant, serif' }}>Privacy & Cookies:</span> We use cookies for functionality and analytics.
                      {" "}
                      <a 
                        href="/privacy-policy"
                        className="text-[#DCDACC] underline hover:text-[#BFBBA7] transition-all"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => setShowMoreInfo(true)}
                      className="px-3 py-1.5 border border-[#DCDACC]/40 text-[#DCDACC] text-[10px] uppercase tracking-[0.2em] font-light hover:bg-[#DCDACC]/10 transition-all whitespace-nowrap flex-1 sm:flex-none"
                    >
                      Learn More
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-4 py-1.5 bg-[#DCDACC] text-[#301710] text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-[#BFBBA7] transition-all whitespace-nowrap flex-1 sm:flex-none"
                    >
                      Accept All
                    </button>
                    <a 
                      href="/privacy-policy"
                      className="text-[#DCDACC]/60 text-xs uppercase tracking-[0.15em] font-light underline hover:text-[#BFBBA7] transition-all hidden sm:block"
                    >
                      Full Privacy Policy
                    </a>
                  </div>
                </motion.div>
              ) : (
                // Privacy Preference Center - Expanded Banner
                <motion.div 
                  key="expanded"
                  className="py-6 max-h-[70vh] overflow-y-auto"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#654331]/30">
                    <h3 className="text-base text-[#301710] font-semibold" style={{ fontFamily: 'Cormorant, serif' }}>
                      Privacy Settings
                    </h3>
                    <button
                      onClick={() => setShowMoreInfo(false)}
                      className="text-[#301710] hover:text-[#654331] transition-all flex items-center gap-1 text-xs uppercase tracking-wide"
                    >
                      <ChevronUp className="w-4 h-4" />
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Your Privacy */}
                      <div>
                        <h4 className="text-xs text-[#301710] font-semibold mb-1.5 uppercase tracking-wide">Your Privacy</h4>
                        <p className="text-xs text-[#301710]/70 font-light leading-relaxed">
                          We use cookies, local storage, and similar technologies to support site functionality, remember your preferences, and analyze performance. Some data, such as device and usage information, may be collected to improve your experience. You can manage your preferences at any time.
                        </p>
                      </div>

                      {/* Data We Collect */}
                      <div>
                        <h4 className="text-xs text-[#301710] font-semibold mb-1.5 uppercase tracking-wide">Data Collection</h4>
                        <p className="text-xs text-[#301710]/70 font-light leading-relaxed">
                          We may collect basic information such as your name, email, business details, device information, and usage activity. Payment data is securely processed by Stripe and is not stored on our servers.
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                      {/* Essential Cookies */}
                      <div className="bg-[#654331]/20 p-3 rounded">
                        <div className="flex items-start justify-between mb-1.5">
                          <h4 className="text-xs text-[#301710] font-semibold uppercase tracking-wide">Essential</h4>
                          <span className="text-[10px] text-[#301710]/60 uppercase tracking-wide">Always Active</span>
                        </div>
                        <p className="text-[11px] text-[#301710]/70 font-light leading-relaxed">
                          Required for core functionality, security, and site performance.
                        </p>
                      </div>

                      {/* Analytics & Performance */}
                      <div className="bg-[#654331]/20 p-3 rounded">
                        <div className="flex items-start justify-between mb-1.5">
                          <h4 className="text-xs text-[#301710] font-semibold uppercase tracking-wide">Analytics</h4>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={cookiePreferences.analytical}
                              onChange={() => togglePreference('analytical')}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-[#301710]/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#654331]"></div>
                          </label>
                        </div>
                        <p className="text-[11px] text-[#301710]/70 font-light leading-relaxed">
                          Used to understand site usage, including clicks, navigation, and quiz interactions, to improve performance and user experience.
                        </p>
                      </div>

                      {/* Legal Information - Collapsed */}
                      <details>
                        <summary className="text-xs text-[#301710] font-semibold uppercase tracking-wide cursor-pointer hover:text-[#654331] transition-all mb-2">
                          Legal Information
                        </summary>
                        <div className="space-y-2 pl-2 pt-2">
                          <p className="text-[11px] text-[#301710]/70 font-light leading-relaxed">
                            This site is operated by Prose Compelling Content LLC (United States). Your data may be processed in the United States. You may request access, correction, or deletion of your data at Info@averraaistudio.com.
                          </p>
                        </div>
                      </details>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 mt-6 border-t border-[#654331]/30">
                    <button
                      onClick={handleSavePreferences}
                      className="w-full sm:w-auto px-6 py-2.5 border border-[#301710]/40 text-[#301710] text-xs uppercase tracking-[0.2em] font-light hover:bg-[#301710]/10 transition-all"
                    >
                      Save Preferences
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="w-full sm:w-auto px-8 py-2.5 bg-[#301710] text-[#DCDACC] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#654331] transition-all"
                    >
                      Accept All
                    </button>
                    <a 
                      href="/terms-of-service"
                      className="text-[#301710]/60 text-xs uppercase tracking-[0.15em] font-light underline hover:text-[#654331] transition-all"
                    >
                      Full Privacy Policy
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
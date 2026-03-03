import { useEffect, useState } from 'react';

export function MobileDebug() {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable if URL has ?debug=true
    const params = new URLSearchParams(window.location.search);
    setEnabled(params.get('debug') === 'true');
  }, []);

  useEffect(() => {
    if (!enabled) return;
    
    // Get device info
    setDeviceInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      memory: (performance as any).memory?.jsHeapSizeLimit 
        ? `${Math.round((performance as any).memory.jsHeapSizeLimit / 1048576)}MB` 
        : 'N/A',
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio
    });

    // Update memory info every 2 seconds
    const interval = setInterval(() => {
      if ((performance as any).memory) {
        setMemoryInfo({
          used: `${Math.round((performance as any).memory.usedJSHeapSize / 1048576)}MB`,
          total: `${Math.round((performance as any).memory.totalJSHeapSize / 1048576)}MB`,
          limit: `${Math.round((performance as any).memory.jsHeapSizeLimit / 1048576)}MB`,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [enabled]);

  // Only show if enabled via ?debug=true
  if (!enabled) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 z-[9999] bg-black/90 text-white text-xs p-4 rounded max-w-xs"
      style={{ fontFamily: 'monospace' }}
    >
      <div className="font-bold mb-2">🔍 Mobile Debug</div>
      
      {deviceInfo && (
        <div className="space-y-1 mb-3">
          <div><strong>Viewport:</strong> {deviceInfo.viewport}</div>
          <div><strong>Memory Limit:</strong> {deviceInfo.memory}</div>
          <div><strong>Pixel Ratio:</strong> {deviceInfo.pixelRatio}x</div>
        </div>
      )}

      {memoryInfo && (
        <div className="space-y-1 border-t border-white/20 pt-2">
          <div><strong>Memory Used:</strong> {memoryInfo.used}</div>
          <div><strong>Memory Total:</strong> {memoryInfo.total}</div>
          <div className={
            parseInt(memoryInfo.used) / parseInt(memoryInfo.limit) > 0.8 
              ? 'text-red-400 font-bold' 
              : ''
          }>
            <strong>Warning:</strong> {
              parseInt(memoryInfo.used) / parseInt(memoryInfo.limit) > 0.8 
                ? '⚠️ High memory usage!' 
                : '✅ Memory OK'
            }
          </div>
        </div>
      )}
    </div>
  );
}
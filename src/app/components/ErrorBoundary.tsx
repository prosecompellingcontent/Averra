import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🚨 ERROR BOUNDARY CAUGHT:', error);
    console.error('Component stack:', errorInfo.componentStack);
    console.error('Error stack:', error.stack);
    
    // Log to help debugging
    try {
      if (typeof window !== 'undefined') {
        console.error('Window width:', window.innerWidth);
        console.error('User agent:', navigator.userAgent);
        if ((performance as any).memory) {
          console.error('Memory:', (performance as any).memory);
        }
      }
    } catch (e) {
      console.error('Error logging debug info:', e);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorCount: prevState.errorCount + 1
    }));
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-[#2d1810] text-white flex items-center justify-center p-8">
          <div className="text-center max-w-lg">
            <h1 className="text-4xl mb-4" style={{ fontFamily: 'Cormorant, serif' }}>
              Something went wrong
            </h1>
            <p className="text-lg mb-6 text-white/70">
              We're having trouble loading this page. {this.state.errorCount > 0 && 'Still having issues? '} 
              Try {this.state.errorCount > 0 ? 'refreshing' : 'again'}.
            </p>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded text-left">
                <p className="text-sm font-mono text-red-300 mb-2">
                  {this.state.error.message}
                </p>
                <pre className="text-xs text-red-400 overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              {this.state.errorCount < 2 && (
                <button
                  onClick={this.handleRetry}
                  className="px-8 py-3 bg-[#DCDACC]/20 text-[#DCDACC] border border-[#DCDACC]/40 uppercase tracking-[0.3em] hover:bg-[#DCDACC]/30 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}
                >
                  Try Again
                </button>
              )}
              <button
                onClick={this.handleRefresh}
                className="px-8 py-3 bg-[#DCDACC] text-[#301710] uppercase tracking-[0.3em]"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}
              >
                Refresh Page
              </button>
            </div>
            {this.state.errorCount > 1 && (
              <p className="text-sm text-white/50 mt-4">
                Multiple errors detected. Please refresh the page.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
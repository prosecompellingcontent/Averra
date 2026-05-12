import { Component, ReactNode } from 'react';
import { logError, createAppError } from '@/utils/errorHandling';

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

    // Use centralized error logging
    const appError = createAppError(
      error,
      'unknown',
      'An unexpected error occurred. Please refresh the page.'
    );

    logError('ErrorBoundary', {
      ...appError,
      componentStack: errorInfo.componentStack,
    });

    // Log additional debugging info
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
        <div className="min-h-screen bg-[#fdf5f7] flex items-center justify-center p-8">
          <div className="text-center max-w-2xl">
            <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-8">
              <h1 className="text-4xl mb-4 text-[#251218]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Something went wrong
              </h1>
              <p className="text-lg mb-6 text-[#251218]/70" style={{ fontFamily: 'Lora, serif' }}>
                We're having trouble loading this page. {this.state.errorCount > 0 && 'Still having issues? '}
                Try {this.state.errorCount > 0 ? 'refreshing' : 'again'}.
              </p>
              {process.env.NODE_ENV !== 'production' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-left">
                  <p className="text-sm text-red-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                    {this.state.error.message}
                  </p>
                  <pre className="text-xs text-red-700 overflow-auto max-h-40" style={{ fontFamily: 'monospace' }}>
                    {this.state.error.stack}
                  </pre>
                </div>
              )}
              <div className="flex gap-4 justify-center">
                {this.state.errorCount < 2 && (
                  <button
                    onClick={this.handleRetry}
                    className="px-6 py-3 bg-[#251218]/10 text-[#251218] hover:bg-[#251218]/20 transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    Try Again
                  </button>
                )}
                <button
                  onClick={this.handleRefresh}
                  className="px-6 py-3 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                >
                  Refresh Page
                </button>
              </div>
              {this.state.errorCount > 1 && (
                <p className="text-sm text-[#251218]/50 mt-4" style={{ fontFamily: 'Lora, serif' }}>
                  Multiple errors detected. Please refresh the page.
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
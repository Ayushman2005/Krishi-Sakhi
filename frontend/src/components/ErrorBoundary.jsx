import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="glass p-12 max-w-lg w-full text-center border-error/20 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-error to-transparent" />
            <AlertTriangle size={64} className="text-error mx-auto mb-6" />
            <h1 className="text-3xl font-black mb-4">Something went wrong</h1>
            <p className="text-text-muted mb-4 text-sm">
              We encountered an unexpected error. Our team has been notified.
            </p>
            {this.state.error && (
              <div className="bg-black/50 p-4 rounded-xl text-left overflow-auto mb-8 text-xs text-error font-mono">
                <p className="font-bold">{this.state.error.toString()}</p>
                <p className="mt-2 opacity-70 whitespace-pre-wrap">{this.state.error.stack}</p>
              </div>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary bg-error hover:bg-error/80 shadow-error/20 w-full flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

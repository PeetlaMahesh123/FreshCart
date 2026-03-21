import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { useAuth } from './contexts/AuthContext';
import './index.css';

// Enhanced error boundary with detailed error information
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Application Error Details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h1 className="text-3xl font-bold text-red-600 mb-4">Application Error</h1>
              <p className="text-gray-600 mb-6">Something went wrong. Please check the console for details.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">🔍 Debug Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="font-medium text-gray-700 w-32">Error:</span>
                  <span className="text-red-600 font-mono">{this.state.error?.message || 'Unknown error'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-32">Time:</span>
                  <span className="text-gray-600">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-32">URL:</span>
                  <span className="text-gray-600 font-mono">{window.location.href}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                🔄 Reload Application
              </button>
              <button
                onClick={() => {
                  console.clear();
                  console.log('🧹 Console cleared. Check for new errors...');
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                🧹 Clear Console
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">📋 Quick Fix Steps:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Check console for red error messages</li>
                <li>Look for missing imports</li>
                <li>Check if all React hooks are imported</li>
                <li>Try reloading the application</li>
              </ol>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

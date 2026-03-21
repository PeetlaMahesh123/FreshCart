import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

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
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '2rem'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#fef2f2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <span style={{ fontSize: '2rem' }}>⚠️</span>
              </div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#dc2626',
                marginBottom: '1rem'
              }}>Application Error</h1>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                Something went wrong. Please check the console for details.
              </p>
            </div>

            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.75rem'
              }}>🔍 Debug Information</h2>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500', color: '#374151', width: '80px' }}>Error:</span>
                  <span style={{ color: '#dc2626', fontFamily: 'monospace' }}>
                    {this.state.error?.message || 'Unknown error'}
                  </span>
                </div>
                <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500', color: '#374151', width: '80px' }}>Time:</span>
                  <span style={{ color: '#6b7280' }}>{new Date().toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ fontWeight: '500', color: '#374151', width: '80px' }}>URL:</span>
                  <span style={{ color: '#6b7280', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {typeof window !== 'undefined' ? window.location.href : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'linear-gradient(to right, #059669, #10b981)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                🔄 Reload Application
              </button>
              <button
                onClick={() => {
                  console.clear();
                  console.log('🧹 Console cleared. Check for new errors...');
                }}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                🧹 Clear Console
              </button>
            </div>

            <div style={{
              backgroundColor: '#dbeafe',
              border: '1px solid #93c5fd',
              borderRadius: '0.5rem',
              padding: '1rem'
            }}>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '0.5rem'
              }}>📋 Quick Fix Steps:</h3>
              <ol style={{
                fontSize: '0.875rem',
                color: '#1e3a8a',
                marginLeft: '1.5rem',
                lineHeight: '1.5'
              }}>
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

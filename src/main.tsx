import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Error boundary for better error handling
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center">
      <div className="text-center bg-white rounded-lg p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Application Error</h1>
        <p className="text-gray-600 mb-4">Something went wrong. Please check the console for details.</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Reload Application
        </button>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

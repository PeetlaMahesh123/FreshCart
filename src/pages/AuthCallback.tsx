import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle } from 'lucide-react';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the access token and refresh token from URL parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle errors from Supabase
        if (error) {
          console.error('Auth callback error:', error, errorDescription);
          setStatus('error');
          setMessage(errorDescription || 'Email verification failed. Please try again.');
          setTimeout(() => navigate('/login'), 5000);
          return;
        }

        // If we have tokens, exchange them for a session
        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            setStatus('error');
            setMessage('Failed to verify email. Please try again.');
            setTimeout(() => navigate('/login'), 5000);
            return;
          }

          if (data.session) {
            setStatus('success');
            setMessage('Email verified successfully! You can now login.');
            // Sign out after verification to require fresh login
            await supabase.auth.signOut();
            setTimeout(() => navigate('/login'), 3000);
            return;
          }
        }

        // Fallback: try to get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setStatus('error');
          setMessage('Failed to verify email. Please try again.');
          setTimeout(() => navigate('/login'), 5000);
          return;
        }

        if (sessionData.session) {
          setStatus('success');
          setMessage('Email verified successfully! You can now login.');
          // Sign out after verification
          await supabase.auth.signOut();
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
          setMessage('No session found. Please try logging in again.');
          setTimeout(() => navigate('/login'), 5000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('An error occurred during email verification. Please try again.');
        setTimeout(() => navigate('/login'), 5000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4 sm:p-6">
      <div className="card p-6 sm:p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-green-600 border-t-transparent"></div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Verifying Email...</h2>
            <p className="text-sm sm:text-base text-gray-600">Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Email Verified!</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">{message}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 font-semibold mb-2">✅ Account Activated</p>
              <p className="text-sm text-green-700">You can now login with your email and password.</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary w-full"
            >
              Go to Login
            </button>
            <p className="text-xs sm:text-sm text-gray-500 mt-4">Auto-redirecting in 3 seconds...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">{message}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 font-semibold mb-2">💡 Troubleshooting</p>
              <ul className="text-sm text-yellow-700 text-left list-disc list-inside">
                <li>Link may have expired (24 hours)</li>
                <li>Already verified? Try logging in</li>
                <li>Check your spam folder</li>
                <li>Request a new verification email</li>
              </ul>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary w-full"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-secondary w-full"
              >
                Register New Account
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-4">Auto-redirecting in 5 seconds...</p>
          </>
        )}
      </div>
    </div>
  );
}

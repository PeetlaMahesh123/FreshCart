import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle } from 'lucide-react';
import '../styles/pages/AuthCallback.css';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'Verification failed');
          setTimeout(() => navigate('/login'), 5000);
          return;
        }

        if (accessToken && refreshToken) {
          const { data } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (data.session) {
            setStatus('success');
            setMessage('Email verified successfully!');
            await supabase.auth.signOut();
            setTimeout(() => navigate('/login'), 3000);
            return;
          }
        }

        setStatus('error');
        setMessage('Verification failed');
      } catch {
        setStatus('error');
        setMessage('Something went wrong');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="auth-container">

      <div className="auth-card">

        {status === 'loading' && (
          <>
            <div className="loader"></div>
            <h2>Verifying Email...</h2>
            <p>Please wait...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="icon success">
              <CheckCircle size={32} />
            </div>
            <h2>Email Verified</h2>
            <p>{message}</p>

            <button onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="icon error">
              <XCircle size={32} />
            </div>
            <h2>Verification Failed</h2>
            <p>{message}</p>

            <button onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </>
        )}

      </div>
    </div>
  );
}
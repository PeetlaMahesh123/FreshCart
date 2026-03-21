import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import '../styles/pages/Login.css';

export function Login({ onNavigate }: any) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else window.location.href = '/#/home';
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-box">

        <button onClick={() => onNavigate?.('home')} className="back-btn">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="login-card">

          <div className="login-header">
            <LogIn size={28} />
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="password-box">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" className="login-btn">
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <div className="login-footer">
            <p>
              Don’t have an account?
              <button onClick={() => onNavigate?.('register')}> Sign up</button>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
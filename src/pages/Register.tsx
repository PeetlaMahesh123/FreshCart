import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import '../styles/pages/Register.css';

export function Register({ onNavigate }: any) {
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone
      );

      if (error) setError(error.message);
      else setSuccess(true);

    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="register-container">
        <div className="register-card center">
          <h2>Registration Successful 🎉</h2>
          <p>Please check your email to verify your account</p>

          <button onClick={() => onNavigate?.('login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">

      <div className="register-box">

        <button onClick={() => onNavigate?.('home')} className="back-btn">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="register-card">

          <h1>Create Account</h1>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">

            <input
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            {/* PASSWORD */}
            <div className="password-box">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />

              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="password-box">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />

              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button className="register-btn">
              {loading ? "Creating..." : "Create Account"}
            </button>

          </form>

          <p className="footer-text">
            Already have an account?
            <button onClick={() => onNavigate?.('login')}> Login</button>
          </p>

        </div>

      </div>

    </div>
  );
}
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/components/AdminHelper.css';

export function AdminHelper() {
  const { makeAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleMakeAdmin = async () => {
    if (!email) {
      setMessage('Enter email');
      return;
    }

    setLoading(true);
    setMessage('');

    const { error } = await makeAdmin(email);

    if (error) {
      setMessage('❌ Failed');
    } else {
      setMessage('✅ Admin updated');
      setEmail('');
    }

    setLoading(false);
  };

  return (
    <div className="admin-helper">

      <h2>Make Admin</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />

      <button onClick={handleMakeAdmin} disabled={loading}>
        {loading ? "Processing..." : "Make Admin"}
      </button>

      {message && <p>{message}</p>}

    </div>
  );
}
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Profile.css';

export function Profile({ onNavigate }: any) {
  const { profile, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { error } = await updateProfile(formData);

    if (error) {
      alert("❌ Update failed");
    } else {
      alert("✅ Profile updated");
    }
  };

  return (
    <div className="profile-container">

      <h1>My Profile</h1>

      <input
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="Full Name"
      />

      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
      />

      <textarea
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
      />

      <button onClick={handleSubmit}>
        Update Profile
      </button>

    </div>
  );
}
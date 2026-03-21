import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, CreditCard as Edit, Trash2, Search } from 'lucide-react';
import '../../styles/pages/AdminUsers.css';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: 'user' | 'admin';
  created_at: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete user?')) return;
    await supabase.from('profiles').delete().eq('id', id);
    fetchUsers();
  };

  const handleUpdateUser = async (e: any) => {
    e.preventDefault();
    if (!editingUser) return;

    await supabase.from('profiles').update(editingUser).eq('id', editingUser.id);
    setEditingUser(null);
    fetchUsers();
  };

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="loader"></div>;

  return (
    <div className="users-container">

      {/* HEADER */}
      <div className="users-header">
        <h1>Users Management</h1>
        <div className="users-count">
          <Users size={18} /> {users.length} Users
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <Search size={18} />
        <input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>{u.full_name}</td>
                <td>{u.email}</td>
                <td>{u.phone || 'N/A'}</td>

                <td>
                  <span className={`role ${u.role}`}>
                    {u.role}
                  </span>
                </td>

                <td>{new Date(u.created_at).toLocaleDateString()}</td>

                <td className="actions">
                  <button onClick={() => setEditingUser(u)}>
                    <Edit size={16} />
                  </button>

                  <button onClick={() => handleDeleteUser(u.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="modal">
          <div className="modal-box">
            <h2>Edit User</h2>

            <form onSubmit={handleUpdateUser}>

              <input
                value={editingUser.full_name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, full_name: e.target.value })
                }
              />

              <input
                value={editingUser.phone || ''}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, phone: e.target.value })
                }
              />

              <select
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value as any })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" onClick={() => setEditingUser(null)} className="cancel-btn">
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, LogOut, User } from 'lucide-react';

function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header style={{ 
      background: 'white', 
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 0'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Upload size={24} color="#3b82f6" />
          <h1 style={{ margin: 0, color: '#3b82f6', fontSize: '1.5rem' }}>Drive MVP</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="#6b7280" />
            <span style={{ color: '#6b7280', fontWeight: '500' }}>{user.username}</span>
          </div>
          
          <button 
            onClick={logout}
            className="btn btn-outline"
            style={{ padding: '0.5rem', minWidth: 'auto' }}
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

import React, { useState, useRef, useEffect } from 'react';
import { FileText, RotateCcw, Sparkles, Home, LogIn, LogOut, User, Check, Bookmark } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Header({ 
  onLoadSample,
  onReset,
  onGoHome,
  user,
  onLogin,
  onLogout,
  onSaveInvoice,
  isSaving,
  usageInfo
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={onGoHome} title="Go to home landing page">
          <div className="brand-icon-box">
            <FileText size={22} strokeWidth={2.5} />
          </div>
          <span className="brand-name">
            <span className="text-freelance">Freelance</span>
            <span className="text-bill">Bill</span>
          </span>
        </div>

        {/* Usage Indicator */}
        {usageInfo && !usageInfo.isPro && (
          <div className="usage-indicator" style={{ marginLeft: '1rem', fontSize: '0.9rem', color: '#555' }}>
            {`${usageInfo.count} of ${usageInfo.limit} free invoices used`}
          </div>
        )}

        {/* Header Action Tools */}
        <div className="header-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onGoHome}
            title="Return to landing page"
          >
            <Home size={16} />
            <span>Home</span>
          </button>

          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onLoadSample}
            title="Pre-fill with sample invoice data"
          >
            <Sparkles size={16} />
            <span>Sample Data</span>
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onReset}
            title="Reset form"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>

          {/* User Auth Profile or Login Button */}
          {user ? (
            <div className="user-profile-menu" ref={dropdownRef}>
              <button 
                type="button" 
                className="user-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title={userName}
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="user-avatar-img" />
                ) : (
                  <div className="user-avatar-placeholder">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="user-name-label">{userName}</span>
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-user-info">
                    <div className="dropdown-user-name">{userName}</div>
                    <div className="dropdown-user-email">{user.email}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button 
                    type="button" 
                    className="dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      onSaveInvoice();
                    }}
                  >
                    <Bookmark size={15} />
                    <span>Save Current Invoice</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button 
                    type="button" 
                    className="dropdown-item text-danger"
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={onLogin}
            >
              <LogIn size={16} />
              <span>Login with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

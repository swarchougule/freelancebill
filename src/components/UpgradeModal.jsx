import React from 'react';

export default function UpgradeModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const handleUpgrade = () => {
    // Placeholder for future payment integration
    console.log('Payment integration coming soon');
    alert('Payment integration coming soon');
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">You've used all 3 free invoices</h2>
        <p className="modal-subtext">
          Upgrade to Pro for unlimited invoices, no watermark, and saved clients.
        </p>
        {/* Pro plan card */}
        <div className="pro-card" style={{ padding: '1.5rem', marginTop: '1rem', borderRadius: '0.5rem', background: '#f9fafb', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', color: '#2563EB' }}>Pro</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#2563EB' }}>₹299/month</p>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
            {[
              'Unlimited invoices',
              'No watermark',
              'Saved clients',
              'All invoice templates',
              'Priority support'
            ].map(item => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: '#22C55E', marginRight: '0.5rem' }}>✔︎</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleUpgrade}>
            Upgrade to Pro
          </button>
        </div>
        <div className="modal-actions" style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ fontSize: '0.875rem' }}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

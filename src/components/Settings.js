import React, { useState } from 'react';
import { User, CreditCard } from 'lucide-react'; // Removed Mail, Phone, and Shield

const Settings = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');

  // CRITICAL FIX: If user is null (loading or logged out), show a message instead of a blank screen
  if (!user) {
    return (
      <div style={{ padding: '150px 6%', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Please log in to view your settings.</p>
        <button onClick={() => window.location.href = '/login'} style={styles.uploadBtn}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '100px 6%', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={styles.settingsLayout}>
        <aside style={styles.sidebar}>
          <button style={activeTab === 'profile' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('profile')}>
            <User size={18} /> Profile
          </button>
          <button style={activeTab === 'subscription' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('subscription')}>
            <CreditCard size={18} /> Subscription
          </button>
        </aside>

        <div style={styles.contentCard}>
          {activeTab === 'profile' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Profile Settings</h2>
              <div style={styles.inputGrid}>
                {/* Use optional chaining (?.) to prevent crashes */}
                <div style={styles.field}><label style={styles.label}>Email</label><input style={styles.input} value={user?.email || ''} readOnly /></div>
                <div style={styles.field}><label style={styles.label}>Role</label><input style={styles.input} value={user?.user_metadata?.role || 'User'} readOnly /></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  settingsLayout: { display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px', maxWidth: '1000px', margin: '0 auto' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '10px' },
  tab: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '600', color: '#64748b', borderRadius: '10px', textAlign: 'left' },
  activeTab: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', border: 'none', backgroundColor: 'white', color: '#2563eb', cursor: 'pointer', fontWeight: '700', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  contentCard: { backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
  sectionTitle: { marginBottom: '30px', fontSize: '1.5rem' },
  avatarUpload: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  largeAvatar: { width: '80px', height: '80px', backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  uploadBtn: { padding: '8px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
  inputGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.9rem', fontWeight: 'bold' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' },
  planCard: { display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', padding: '25px', borderRadius: '15px', border: '1px solid #eff6ff' },
  priceTag: { fontSize: '2rem', fontWeight: '800' }
};

export default Settings;
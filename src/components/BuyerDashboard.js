import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Heart, MessageSquare, Search, Home, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuyerDashboard = ({ user }) => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuyerData = async () => {
      const { data: favData } = await supabase
        .from('favorites')
        .select(`id, property_id, properties (*)`)
        .eq('user_id', user.id);

      const { data: inqData } = await supabase
        .from('leads')
        .select('*')
        .eq('client_email', user.email)
        .order('created_at', { ascending: false });

      setSavedProperties(favData?.map(f => f.properties) || []);
      setInquiries(inqData || []);
      setLoading(false);
    };

    if (user) fetchBuyerData();
  }, [user]);

  if (loading) return <div style={styles.loading}>Loading your dashboard...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.welcome}>Hi, {user?.user_metadata?.first_name || 'Guest'} 👋</h1>
          <p style={styles.subtitle}>Manage your saved homes and track your inquiries.</p>
        </div>
        {/* USE SEARCH ICON: Action Button */}
        <button style={styles.searchBtn} onClick={() => navigate('/')}>
          <Search size={18} /> Find More Homes
        </button>
      </header>

      <div style={styles.contentGrid}>
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <Heart size={20} color="#ef4444" fill="#ef4444" />
            <h2 style={styles.sectionTitle}>Saved Homes ({savedProperties.length})</h2>
          </div>
          
          <div style={styles.propertyGrid}>
            {savedProperties.map((prop) => (
              <div key={prop.id} style={styles.propCard}>
                <div style={styles.imageContainer}>
                  <img src={prop.image} alt={prop.title} style={styles.propImage} />
                  {/* USE STAR ICON: Featured Badge */}
                  <div style={styles.featuredBadge}>
                    <Star size={12} fill="white" /> Featured
                  </div>
                </div>
                <div style={styles.propInfo}>
                  <h4 style={styles.propTitle}>{prop.title}</h4>
                  <p style={styles.propPrice}>{prop.price}</p>
                  <p style={styles.propLoc}>{prop.location}</p>
                </div>
              </div>
            ))}
            {savedProperties.length === 0 && (
              <div style={styles.emptyState}>
                <Home size={40} color="#cbd5e1" />
                <p>No homes saved yet. Start exploring!</p>
              </div>
            )}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <MessageSquare size={20} color="#2563eb" />
            <h2 style={styles.sectionTitle}>Recent Inquiries</h2>
          </div>
          
          <div style={styles.inquiryList}>
            {inquiries.map((inq) => (
              <div key={inq.id} style={styles.inquiryCard}>
                <div style={styles.inquiryTop}>
                  <span style={styles.inquiryProp}>{inq.property_title}</span>
                  <span style={styles.statusBadge}>{inq.status}</span>
                </div>
                <div style={styles.inquiryMeta}>
                  <Clock size={14} /> {new Date(inq.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {inquiries.length === 0 && <p style={styles.emptyText}>You haven't contacted any agents yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px 6%', backgroundColor: '#f8fafc', minHeight: '100vh' },
  header: { marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  welcome: { fontSize: '2rem', color: '#0f172a', marginBottom: '8px' },
  subtitle: { color: '#64748b', fontSize: '1.1rem', margin: 0 },
  searchBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  contentGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' },
  section: { backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' },
  sectionTitle: { fontSize: '1.25rem', color: '#1e293b', margin: 0 },
  propertyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  propCard: { borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' },
  imageContainer: { position: 'relative' },
  propImage: { width: '100%', height: '120px', objectFit: 'cover' },
  featuredBadge: { position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(15, 23, 42, 0.7)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' },
  propInfo: { padding: '12px' },
  propTitle: { fontSize: '0.9rem', fontWeight: 'bold', margin: '0 0 4px 0' },
  propPrice: { color: '#2563eb', fontWeight: 'bold', fontSize: '0.85rem' },
  propLoc: { color: '#64748b', fontSize: '0.75rem' },
  inquiryList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inquiryCard: { padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' },
  inquiryTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  inquiryProp: { fontWeight: '600', fontSize: '0.9rem', color: '#1e293b' },
  statusBadge: { backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' },
  inquiryMeta: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8' },
  loading: { textAlign: 'center', padding: '100px', fontSize: '1.2rem' }
};

export default BuyerDashboard;
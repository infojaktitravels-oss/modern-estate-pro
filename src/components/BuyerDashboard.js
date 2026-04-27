import React from 'react';
import { Heart, Search, MessageSquare, Clock, MapPin, ExternalLink } from 'lucide-react';

const BuyerDashboard = () => {
  const savedProperties = [
    { id: 1, title: 'Modern Sunset Villa', price: '$850,000', location: 'Malibu, CA', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400' },
    { id: 2, title: 'Luxury Skyline Apartment', price: '$1,200,000', location: 'New York, NY', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Welcome, Home Seeker!</h1>
            <p style={styles.subtitle}>Manage your favorite properties and viewing requests.</p>
          </div>
          <button style={styles.searchBtn}><Search size={18} /> Start New Search</button>
        </header>

        {/* Quick Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statMiniCard}>
            <Heart size={20} color="#ef4444" />
            <span><strong>2</strong> Saved Homes</span>
          </div>
          <div style={styles.statMiniCard}>
            <MessageSquare size={20} color="#2563eb" />
            <span><strong>3</strong> Active Inquiries</span>
          </div>
          <div style={styles.statMiniCard}>
            <Clock size={20} color="#8b5cf6" />
            <span><strong>1</strong> Viewing Scheduled</span>
          </div>
        </div>

        {/* Saved Properties Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>My Favorites</h2>
          <div style={styles.grid}>
            {savedProperties.map(property => (
              <div key={property.id} style={styles.card}>
                <img src={property.image} alt={property.title} style={styles.cardImg} />
                <div style={styles.cardContent}>
                  <div style={styles.price}>{property.price}</div>
                  <h3 style={styles.propTitle}>{property.title}</h3>
                  <div style={styles.location}><MapPin size={14} /> {property.location}</div>
                  <button style={styles.viewBtn}>View Details <ExternalLink size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8fafc', paddingTop: '100px', paddingBottom: '50px' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '0 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  title: { fontSize: '2rem', color: '#0f172a', marginBottom: '5px' },
  subtitle: { color: '#64748b' },
  searchBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: 'white', padding: '12px 20px', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer' },
  statsRow: { display: 'flex', gap: '20px', marginBottom: '40px' },
  statMiniCard: { flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', fontSize: '0.95rem' },
  section: { marginBottom: '40px' },
  sectionTitle: { fontSize: '1.3rem', fontWeight: '700', color: '#1e293b', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  card: { backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  cardImg: { width: '100%', height: '180px', objectFit: 'cover' },
  cardContent: { padding: '20px' },
  price: { color: '#2563eb', fontWeight: '800', fontSize: '1.2rem', marginBottom: '5px' },
  propTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' },
  location: { display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.9rem', marginBottom: '15px' },
  viewBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'none', fontWeight: '600', color: '#1e293b', cursor: 'pointer' }
};

export default BuyerDashboard;
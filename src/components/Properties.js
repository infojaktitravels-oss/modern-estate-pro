import React from 'react';
import { Heart, MapPin, BedDouble, Bath, Square } from 'lucide-react';

const Properties = ({ properties }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Featured Properties</h2>
        <p style={styles.subtitle}>Handpicked premium listings just for you</p>
      </div>
      
      <div style={styles.grid}>
        {properties.map((property) => (
          <div key={property.id} style={styles.card}>
            <div style={styles.imageContainer}>
              <img src={property.image} alt={property.title} style={styles.image} />
              <div style={styles.heartBadge}>
                <Heart size={18} color="#ef4444" fill="#ef4444" />
              </div>
              <div style={styles.typeBadge}>{property.type || 'Residential'}</div>
            </div>

            <div style={styles.content}>
              <h3 style={styles.price}>{property.price}</h3>
              <p style={styles.propTitle}>{property.title}</p>
              
              <div style={styles.locationRow}>
                <MapPin size={14} color="#64748b" />
                <span style={styles.locationText}>{property.location}</span>
              </div>

              {/* Added fake specs to make the cards look more realistic */}
              <div style={styles.specs}>
            <div style={styles.specItem}><BedDouble size={16} /> {property.beds || '3'}</div>
             <div style={styles.specItem}><Bath size={16} /> {property.baths || '2'}</div>
            <div style={styles.specItem}><Square size={16} /> {property.sqft || '1,200'} sqft</div>
</div>

              <button style={styles.viewBtn}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '80px 6%', backgroundColor: '#fff' },
  header: { marginBottom: '40px', textAlign: 'left' },
  title: { fontSize: '2.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '10px' },
  subtitle: { color: '#64748b', fontSize: '1.1rem' },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
    gap: '30px' 
  },
  card: { 
    backgroundColor: 'white', 
    borderRadius: '20px', 
    overflow: 'hidden', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s ease',
    border: '1px solid #f1f5f9'
  },
  imageContainer: { position: 'relative', height: '220px' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  heartBadge: { 
    position: 'absolute', 
    top: '15px', 
    right: '15px', 
    backgroundColor: 'white', 
    padding: '8px', 
    borderRadius: '50%', 
    display: 'flex', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    cursor: 'pointer'
  },
  typeBadge: {
    position: 'absolute',
    bottom: '15px',
    left: '15px',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '700'
  },
  content: { padding: '24px' },
  price: { fontSize: '1.5rem', color: '#2563eb', fontWeight: '800', marginBottom: '8px' },
  propTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  locationRow: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '15px' },
  locationText: { color: '#64748b', fontSize: '0.9rem' },
  specs: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '15px 0', 
    borderTop: '1px solid #f1f5f9', 
    borderBottom: '1px solid #f1f5f9',
    marginBottom: '20px'
  },
  specItem: { display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.85rem', fontWeight: '600' },
  viewBtn: { 
    width: '100%', 
    padding: '12px', 
    backgroundColor: '#1e293b', 
    color: 'white', 
    border: 'none', 
    borderRadius: '10px', 
    fontWeight: '700', 
    cursor: 'pointer',
    transition: '0.3s'
  }
};

export default Properties;
import React from 'react';
import { useParams } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, Phone, Mail } from 'lucide-react';

const PropertyDetails = ({ properties }) => {
  const { id } = useParams();
  const property = properties.find(p => p.id === parseInt(id));

  if (!property) return <div style={{padding: '100px'}}>Property not found.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.gallery}>
        <img src={property.image} alt={property.title} style={styles.mainImg} />
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.mainInfo}>
          <h1 style={styles.title}>{property.title}</h1>
          <div style={styles.location}><MapPin size={18}/> {property.location}</div>
          <div style={styles.price}>{property.price}</div>
          
          <div style={styles.specs}>
            <div style={styles.specBox}><Bed /> {property.beds} Beds</div>
            <div style={styles.specBox}><Bath /> {property.baths} Baths</div>
            <div style={styles.specBox}><Maximize /> {property.sqft} sqft</div>
          </div>

          <div style={styles.description}>
            <h3>Description</h3>
            <p>Experience luxury living at its finest. This property features premium finishes, 
               open-concept layouts, and breathtaking views.</p>
          </div>
        </div>

        <aside style={styles.sidebar}>
          <div style={styles.contactCard}>
            <h3>Interested?</h3>
            <button style={styles.contactBtn}><Phone size={18}/> Call Agent</button>
            <button style={styles.emailBtn}><Mail size={18}/> Email Inquiry</button>
          </div>
          <div style={styles.adBox}>Verified Property ✓</div>
        </aside>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '100px 6%', maxWidth: '1200px', margin: '0 auto' },
  gallery: { width: '100%', height: '500px', borderRadius: '24px', overflow: 'hidden', marginBottom: '40px' },
  mainImg: { width: '100%', height: '100%', objectFit: 'cover' },
  contentGrid: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' },
  title: { fontSize: '2.5rem', marginBottom: '10px' },
  location: { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '20px' },
  price: { fontSize: '2rem', fontWeight: '800', color: '#2563eb', marginBottom: '30px' },
  specs: { display: 'flex', gap: '20px', marginBottom: '40px' },
  specBox: { backgroundColor: '#f1f5f9', padding: '15px 25px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' },
  contactCard: { padding: '30px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
  contactBtn: { width: '100%', padding: '15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', marginBottom: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' },
  emailBtn: { width: '100%', padding: '15px', backgroundColor: 'white', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' }
};

export default PropertyDetails;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, BedDouble, Bath, Square } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

const Properties = ({ properties = [] }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = async (propertyId) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Please login first');
      return;
    }

    const isFav = favorites.includes(propertyId);

    if (isFav) {
      await supabase
        .from('favorites')
        .delete()
        .eq('property_id', propertyId)
        .eq('user_id', user.id);

      setFavorites(favorites.filter(id => id !== propertyId));
    } else {
      await supabase.from('favorites').insert({
        user_id: user.id,
        property_id: propertyId,
      });

      setFavorites([...favorites, propertyId]);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Featured Properties</h2>
        <p style={styles.subtitle}>Handpicked premium listings just for you</p>
      </div>

      <div style={styles.grid}>
        {properties.map((property) => (
          <motion.div
            key={property.id}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            style={styles.card}
          >
            <div style={styles.imageContainer}>
              {/* SYNCED: Using property.image_url to match DB column */}
              <img
                src={property.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={property.title}
                style={styles.image}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Error+Loading+Image'; }}
              />

              <div
                style={styles.heartBadge}
                onClick={(e) => {
                   e.stopPropagation();
                   toggleFavorite(property.id);
                }}
              >
                <Heart
                  size={18}
                  color={favorites.includes(property.id) ? '#ef4444' : '#94a3b8'}
                  fill={favorites.includes(property.id) ? '#ef4444' : 'none'}
                />
              </div>

              {/* SYNCED: Using property_type to match DB column */}
              <div style={styles.typeBadge}>
                {property.property_type || 'Residential'}
              </div>
            </div>

            <div style={styles.content}>
              {/* FIX: Ensuring price is treated as a number for formatting */}
              <h3 style={styles.price}>
                {property.price && !isNaN(Number(property.price)) 
                   ? `$${Number(property.price).toLocaleString()}` 
                   : '$ Price TBD'}
              </h3>

              <p style={styles.propTitle}>{property.title || 'Property'}</p>

              <div style={styles.locationRow}>
                <MapPin size={14} color="#64748b" />
                <span style={styles.locationText}>
                  {property.location || 'Address available on request'}
                </span>
              </div>

              <div style={styles.specs}>
                <div style={styles.specItem}>
                  <BedDouble size={16} /> {property.beds || 0}
                </div>
                <div style={styles.specItem}>
                  <Bath size={16} /> {property.baths || 0}
                </div>
                <div style={styles.specItem}>
                  <Square size={16} /> {property.sqft || 0} sqft
                </div>
              </div>

              <button
                style={styles.viewBtn}
                onClick={() => navigate(`/property/${property.id}`)}
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '80px 6%', backgroundColor: '#f8fafc' },
  header: { marginBottom: '40px' },
  title: { fontSize: '2.4rem', fontWeight: '800', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: '8px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' },
  card: { backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.08)', cursor: 'pointer' },
  imageContainer: { position: 'relative', height: '220px' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  heartBadge: { position: 'absolute', top: '15px', right: '15px', backgroundColor: 'white', padding: '8px', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', cursor: 'pointer' },
  typeBadge: { position: 'absolute', bottom: '15px', left: '15px', backgroundColor: '#2563eb', color: 'white', padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' },
  content: { padding: '22px' },
  price: { fontSize: '1.5rem', color: '#2563eb', fontWeight: '800', marginBottom: '6px' },
  propTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px' },
  locationRow: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '15px' },
  locationText: { color: '#64748b', fontSize: '0.9rem' },
  specs: { display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: '18px' },
  specItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#475569', fontWeight: '600' },
  viewBtn: { width: '100%', padding: '12px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', transition: '0.3s' },
};

export default Properties;
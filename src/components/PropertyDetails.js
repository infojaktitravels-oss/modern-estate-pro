import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BedDouble, Bath, Square, MapPin } from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProperty = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching property:", error);
      setProperty(null);
    } else {
      setProperty(data);
    }

    setLoading(false);
  };

  fetchProperty();
}, [id]);

  if (loading) return <h2 style={{ padding: '40px' }}>Loading...</h2>;
  if (!property) return <h2 style={{ padding: '40px' }}>Property not found</h2>;

  return (
    <div style={styles.container}>

      {/* HERO IMAGE */}
      <div style={styles.hero}>
        <img src={property.image_url} alt="" style={styles.heroImg} />
      </div>

      {/* CONTENT */}
      <div style={styles.content}>

        <div style={styles.left}>

          <h1 style={styles.title}>{property.title}</h1>

          <div style={styles.location}>
            <MapPin size={16} /> {property.location}
          </div>

          <h2 style={styles.price}>${property.price}</h2>

          {/* SPECS */}
          <div style={styles.specs}>
            <span><BedDouble size={18}/> {property.beds} Beds</span>
            <span><Bath size={18}/> {property.baths} Baths</span>
            <span><Square size={18}/> {property.sqft} sqft</span>
          </div>

          {/* DESCRIPTION */}
          <div style={styles.section}>
            <h3>Description</h3>
            <p>
              This is a premium property located in {property.location}. 
              Perfect for modern living with high-end finishes and spacious design.
            </p>
          </div>

        </div>

        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          <button style={styles.cta}>Contact Agent</button>
          <button style={styles.ctaOutline}>Book Visit</button>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#f8fafc',
    minHeight: '100vh'
  },
  hero: {
    width: '100%',
    height: '400px',
    overflow: 'hidden'
  },
  heroImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  content: {
    display: 'flex',
    gap: '40px',
    padding: '40px 6%',
    maxWidth: '1200px',
    margin: 'auto'
  },
  left: {
    flex: 2
  },
  sidebar: {
    flex: 1,
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    height: 'fit-content',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#0f172a'
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#64748b',
    margin: '10px 0'
  },
  price: {
    fontSize: '1.8rem',
    color: '#2563eb',
    fontWeight: '800',
    margin: '20px 0'
  },
  specs: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    fontWeight: '600'
  },
  section: {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px'
  },
  cta: {
    width: '100%',
    padding: '14px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    marginBottom: '10px',
    cursor: 'pointer'
  },
  ctaOutline: {
    width: '100%',
    padding: '14px',
    border: '2px solid #2563eb',
    color: '#2563eb',
    background: 'transparent',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer'
  }
};

export default PropertyDetails;
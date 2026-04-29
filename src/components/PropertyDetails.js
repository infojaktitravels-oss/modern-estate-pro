import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setProperty(data);
      }

      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  if (loading) return <h2 style={{ padding: '40px' }}>Loading...</h2>;

  if (!property) return <h2 style={{ padding: '40px' }}>Property not found.</h2>;

  return (
    <div style={styles.container}>
      <img src={property.image_url} alt="" style={styles.image} />

      <div style={styles.content}>
        <h1>{property.title}</h1>
        <h2 style={{ color: '#2563eb' }}>{property.price}</h2>
        <p>{property.location}</p>

        <div style={styles.specs}>
          <span>🛏 {property.beds}</span>
          <span>🛁 {property.baths}</span>
          <span>📐 {property.sqft} sqft</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '1000px',
    margin: 'auto'
  },
  image: {
    width: '100%',
    borderRadius: '12px',
    marginBottom: '20px'
  },
  content: {
    lineHeight: '1.6'
  },
  specs: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
    fontWeight: 'bold'
  }
};

export default PropertyDetails;
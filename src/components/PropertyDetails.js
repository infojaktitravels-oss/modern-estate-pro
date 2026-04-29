import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BedDouble, Bath, Square, MapPin, Heart, X } from 'lucide-react';

const PropertyDetails = ({ user }) => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentImage, setCurrentImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // ✅ FETCH PROPERTY
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images ( image_url )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        setProperty(null);
      } else {
        setProperty(data);
      }

      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  // ✅ FAVORITE TOGGLE
  const toggleFavorite = async () => {
    if (!user) {
      alert("Login required");
      return;
    }

    if (isSaved) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', id);

      setIsSaved(false);
    } else {
      await supabase.from('favorites').insert({
        user_id: user.id,
        property_id: id,
      });

      setIsSaved(true);
    }
  };

  // ✅ ALL IMAGES
  const images = property?.property_images?.length
    ? property.property_images.map(img => img.image_url)
    : [property?.image || "https://via.placeholder.com/800x400"];

  if (loading) return <h2 style={{ padding: '40px' }}>Loading...</h2>;
  if (!property) return <h2 style={{ padding: '40px' }}>Property not found</h2>;

  return (
    <div style={styles.container}>

      {/* HERO IMAGE */}
      <div style={styles.hero}>
        <img
          src={images[currentImage]}
          alt=""
          style={styles.heroImg}
          onClick={() => setShowGallery(true)}
        />

        {/* FAVORITE */}
        <div style={styles.favorite} onClick={toggleFavorite}>
          <Heart size={20} color={isSaved ? 'red' : '#fff'} fill={isSaved ? 'red' : 'none'} />
        </div>
      </div>

      {/* THUMBNAILS */}
      <div style={styles.thumbRow}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            style={{
              ...styles.thumb,
              border: currentImage === i ? '2px solid #2563eb' : 'none'
            }}
            onClick={() => setCurrentImage(i)}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div style={styles.content}>

        <div style={styles.left}>
          <h1 style={styles.title}>{property.title}</h1>

          <div style={styles.location}>
            <MapPin size={16} /> {property.location}
          </div>

          <h2 style={styles.price}>${property.price}</h2>

          <div style={styles.specs}>
            <span><BedDouble size={18}/> {property.beds} Beds</span>
            <span><Bath size={18}/> {property.baths} Baths</span>
            <span><Square size={18}/> {property.sqft} sqft</span>
          </div>

          <div style={styles.section}>
            <h3>Description</h3>
            <p>
              Premium property in {property.location}. Designed for modern living with elegant interiors.
            </p>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          <button style={styles.cta}>Contact Agent</button>
          <button style={styles.ctaOutline}>Book Visit</button>
        </div>
      </div>

      {/* FULLSCREEN GALLERY */}
      {showGallery && (
        <div style={styles.gallery}>
          <X style={styles.close} onClick={() => setShowGallery(false)} />

          <img src={images[currentImage]} alt="" style={styles.galleryImg} />

          <div style={styles.galleryNav}>
            <button onClick={() => setCurrentImage((currentImage - 1 + images.length) % images.length)}>◀</button>
            <button onClick={() => setCurrentImage((currentImage + 1) % images.length)}>▶</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { background: '#f8fafc', minHeight: '100vh' },

  hero: { position: 'relative', height: '400px' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' },

  favorite: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'rgba(0,0,0,0.5)',
    padding: '10px',
    borderRadius: '50%',
    cursor: 'pointer'
  },

  thumbRow: {
    display: 'flex',
    gap: '10px',
    padding: '10px 6%'
  },
  thumb: {
    width: '80px',
    height: '60px',
    objectFit: 'cover',
    cursor: 'pointer',
    borderRadius: '6px'
  },

  content: {
    display: 'flex',
    gap: '40px',
    padding: '40px 6%',
    maxWidth: '1200px',
    margin: 'auto'
  },

  left: { flex: 2 },

  sidebar: {
    flex: 1,
    background: '#fff',
    padding: '20px',
    borderRadius: '12px'
  },

  title: { fontSize: '2rem', fontWeight: '800' },
  location: { display: 'flex', gap: '6px', margin: '10px 0' },
  price: { fontSize: '1.8rem', color: '#2563eb', margin: '20px 0' },

  specs: { display: 'flex', gap: '20px', marginBottom: '30px' },

  section: { background: '#fff', padding: '20px', borderRadius: '12px' },

  cta: {
    width: '100%',
    padding: '14px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    marginBottom: '10px',
    cursor: 'pointer'
  },

  ctaOutline: {
    width: '100%',
    padding: '14px',
    border: '2px solid #2563eb',
    color: '#2563eb',
    background: 'transparent',
    borderRadius: '10px'
  },

  gallery: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },

  galleryImg: {
    maxWidth: '90%',
    maxHeight: '80%'
  },

  close: {
    position: 'absolute',
    top: '20px',
    right: '30px',
    color: '#fff',
    cursor: 'pointer'
  },

  galleryNav: {
    position: 'absolute',
    bottom: '30px',
    display: 'flex',
    gap: '20px'
  }
};

export default PropertyDetails;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BedDouble, Bath, Square, MapPin, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';

const PropertyDetails = ({ user }) => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchPropertyData = async () => {
      setLoading(true);
      
      // 1. Fetch Property details
      const { data, error } = await supabase
        .from('properties')
        .select('*') // We pull the 'images' array directly from here now
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching property:", error);
      } else {
        setProperty(data);
        
        // 2. Check if this property is already in user's favorites
        if (user) {
          const { data: favData } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user.id)
            .eq('property_id', id);
          
          if (favData && favData.length > 0) setIsSaved(true);
        }
      }
      setLoading(false);
    };

    fetchPropertyData();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) return alert("Please login to save properties!");

    if (isSaved) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('property_id', id);
      setIsSaved(false);
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, property_id: id });
      setIsSaved(true);
    }
  };

  // ✅ UPDATED IMAGE LOGIC: Uses the 'images' array or falls back to 'image_url'
  const allImages = property?.images?.length > 0 
    ? property.images 
    : [property?.image_url || "https://via.placeholder.com/800x400?text=No+Image+Available"];

  if (loading) return <div style={styles.loader}><h2>Loading Property...</h2></div>;
  if (!property) return <div style={styles.loader}><h2>Property not found.</h2></div>;

  return (
    <div style={styles.container}>
      {/* MAIN HERO */}
      <div style={styles.heroSection}>
        <div style={styles.heroMain}>
          <img
            src={allImages[currentImage]}
            alt={property.title}
            style={styles.heroImg}
            onClick={() => setShowGallery(true)}
          />
          <div style={styles.favoriteBtn} onClick={toggleFavorite}>
            <Heart size={24} color={isSaved ? '#ef4444' : '#fff'} fill={isSaved ? '#ef4444' : 'none'} />
          </div>
        </div>

        {/* THUMBNAIL RAIL */}
        <div style={styles.thumbnailContainer}>
          {allImages.map((img, i) => (
            <div 
              key={i} 
              style={{...styles.thumbWrapper, border: currentImage === i ? '3px solid #2563eb' : 'none'}}
              onClick={() => setCurrentImage(i)}
            >
              <img src={img} alt="" style={styles.thumbImg} />
            </div>
          ))}
        </div>
      </div>

      <div style={styles.contentLayout}>
        <div style={styles.detailsLeft}>
          <div style={styles.badge}>{property.property_type || 'Residential'}</div>
          <h1 style={styles.title}>{property.title}</h1>
          <div style={styles.locationRow}>
            <MapPin size={18} color="#64748b" /> {property.location}
          </div>

          <h2 style={styles.price}>
            ${Number(property.price).toLocaleString()}
          </h2>

          <div style={styles.statsBar}>
            <div style={styles.stat}><BedDouble size={20}/> <strong>{property.beds}</strong> Beds</div>
            <div style={styles.stat}><Bath size={20}/> <strong>{property.baths}</strong> Baths</div>
            <div style={styles.stat}><Square size={20}/> <strong>{property.sqft}</strong> sqft</div>
          </div>

          <div style={styles.descBox}>
            <h3 style={styles.sectionTitle}>About this property</h3>
            <p style={styles.description}>
              {property.description || `Beautiful ${property.property_type} located in ${property.location}. This property offers a perfect blend of comfort and style, ideal for modern living.`}
            </p>
          </div>
        </div>

        {/* AGENT SIDEBAR */}
        <div style={styles.sidebar}>
          <div style={styles.agentCard}>
            <h3 style={styles.agentTitle}>Interested?</h3>
            <p style={styles.agentSub}>Secure this property today</p>
            <button style={styles.primaryBtn}>Contact Agent</button>
            <button style={styles.secondaryBtn}>Schedule a Tour</button>
          </div>
        </div>
      </div>

      {/* LIGHTBOX GALLERY */}
      {showGallery && (
        <div style={styles.lightbox}>
          <X style={styles.closeIcon} onClick={() => setShowGallery(false)} />
          <button style={styles.navBtnLeft} onClick={() => setCurrentImage((currentImage - 1 + allImages.length) % allImages.length)}>
            <ChevronLeft size={40} />
          </button>
          
          <img src={allImages[currentImage]} alt="" style={styles.lightboxImg} />
          
          <button style={styles.navBtnRight} onClick={() => setCurrentImage((currentImage + 1) % allImages.length)}>
            <ChevronRight size={40} />
          </button>
          <div style={styles.imageCounter}>{currentImage + 1} / {allImages.length}</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' },
  loader: { height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b' },
  heroSection: { padding: '20px 6%', display: 'flex', flexDirection: 'column', gap: '15px' },
  heroMain: { position: 'relative', height: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' },
  favoriteBtn: { position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', padding: '12px', borderRadius: '50%', cursor: 'pointer', transition: '0.2s' },
  thumbnailContainer: { display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' },
  thumbWrapper: { width: '100px', height: '70px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', flexShrink: 0 },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  contentLayout: { display: 'flex', gap: '40px', padding: '40px 6%', maxWidth: '1300px', margin: 'auto' },
  detailsLeft: { flex: 2 },
  badge: { display: 'inline-block', padding: '6px 12px', background: '#dbeafe', color: '#1e40af', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', marginBottom: '16px' },
  title: { fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' },
  locationRow: { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '1.1rem' },
  price: { fontSize: '2.2rem', color: '#2563eb', fontWeight: '800', margin: '24px 0' },
  statsBar: { display: 'flex', gap: '30px', padding: '20px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' },
  stat: { display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' },
  descBox: { marginTop: '40px' },
  sectionTitle: { fontSize: '1.4rem', fontWeight: '700', marginBottom: '15px' },
  description: { lineHeight: '1.8', color: '#475569', fontSize: '1.1rem' },
  sidebar: { flex: 1 },
  agentCard: { background: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', position: 'sticky', top: '40px' },
  agentTitle: { fontSize: '1.5rem', fontWeight: '800', marginBottom: '5px' },
  agentSub: { color: '#64748b', marginBottom: '25px' },
  primaryBtn: { width: '100%', padding: '16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '12px', fontSize: '1rem' },
  secondaryBtn: { width: '100%', padding: '16px', background: 'transparent', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer' },
  lightbox: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  lightboxImg: { maxWidth: '85%', maxHeight: '80%', borderRadius: '12px' },
  closeIcon: { position: 'absolute', top: '30px', right: '30px', color: '#fff', cursor: 'pointer' },
  navBtnLeft: { position: 'absolute', left: '40px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' },
  navBtnRight: { position: 'absolute', right: '40px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' },
  imageCounter: { position: 'absolute', bottom: '40px', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }
};

export default PropertyDetails;
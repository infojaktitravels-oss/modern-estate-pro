import React from 'react';

const Hero = () => {
  return (
    <section style={styles.hero}>
      <div style={styles.overlay} />

      <div style={styles.content}>
        <h1 style={styles.title}>Find Your Dream Property</h1>
        <p style={styles.subtitle}>
          Buy, sell, and discover premium real estate across the world
        </p>

        <div style={styles.searchBox}>
          <input placeholder="Search by city, location..." style={styles.input} />
          <button style={styles.button}>Search</button>
        </div>
      </div>
    </section>
  );
};

const styles = {
  hero: {
    position: 'relative',
    height: '80vh',
    backgroundImage: 'url(https://images.unsplash.com/photo-1568605114967-8130f3a36994)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)',
  },
  content: {
    position: 'relative',
    textAlign: 'center',
    color: 'white',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
  },
  subtitle: {
    marginTop: '10px',
    marginBottom: '20px',
  },
  searchBox: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    width: '300px',
  },
  button: {
    padding: '12px 20px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Hero;
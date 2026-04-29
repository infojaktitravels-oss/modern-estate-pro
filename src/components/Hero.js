import React, { useState } from 'react';

const Hero = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
      // Optional: Smooth scroll to properties section after searching
      const element = document.getElementById('properties');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section style={styles.hero}>
      <div style={styles.overlay} />

      <div style={styles.content}>
        <h1 style={styles.title}>Find Your Dream Property</h1>
        <p style={styles.subtitle}>
          Buy, sell, and discover premium real estate across the world
        </p>

        <form onSubmit={handleSearch} style={styles.searchBox}>
          <input 
            type="text"
            placeholder="Search by city, location..." 
            style={styles.input} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" style={styles.button}>Search</button>
        </form>
      </div>
    </section>
  );
};

const styles = {
  hero: {
    position: 'relative',
    height: '80vh',
    backgroundImage: 'url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2070")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    padding: '0 20px',
    maxWidth: '800px',
    width: '100%',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: '1.25rem',
    marginBottom: '40px',
    opacity: 0.9,
  },
  searchBox: {
    display: 'flex',
    gap: '10px',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  input: {
    flex: 1,
    padding: '12px 20px',
    border: 'none',
    fontSize: '1rem',
    outline: 'none',
    color: '#333',
  },
  button: {
    padding: '12px 30px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  }
};

export default Hero;
import React from 'react';

const Hero = () => {
  return (
    <div style={{ 
      padding: '80px 20px', 
      backgroundColor: '#2563eb', 
      color: 'white', 
      textAlign: 'center' 
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
        Find Your Dream Property
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
        Residential • Commercial • Land • Shop • Lease
      </p>
      
      <div style={{ 
        display: 'inline-flex', 
        backgroundColor: 'white', 
        padding: '10px', 
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <input 
          type="text" 
          placeholder="Enter city or zip code..." 
          style={{ padding: '12px', border: 'none', outline: 'none', width: '250px' }} 
        />
        <button style={{ 
          backgroundColor: '#1e293b', 
          color: 'white', 
          border: 'none', 
          padding: '10px 25px', 
          borderRadius: '5px', 
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Search
        </button>
      </div>
    </div>
  );
};

export default Hero;
import React from 'react';

function Contact() {
  return (
    <div style={{ padding: '80px 10%', backgroundColor: '#f8fafc' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Contact Us</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Your Name" style={inputStyle} />
          <input type="email" placeholder="Your Email" style={inputStyle} />
          <textarea placeholder="How can we help you?" rows="4" style={inputStyle}></textarea>
          <button type="button" style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '12px',
  border: '1px solid #e2e8f0',
  borderRadius: '5px',
  fontSize: '1rem'
};

export default Contact;
import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Ensure this path is correct

function Contact() {
  // 1. Setup State to capture input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. The Submit Logic (Now inside the component)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { name, email, message } = formData;

    try {
      // Ensure 'contact_inquiries' table exists in your Supabase DB
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([{ 
          name, 
          email, 
          message,
          created_at: new Date() 
        }]);

      if (error) throw error;

      alert("Message sent successfully!");
      // Reset form
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '80px 10%', backgroundColor: '#f8fafc' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#0f172a' }}>Contact Us</h2>
        
        {/* 4. Connect handleSubmit to the form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            name="name" // Matches key in formData
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name" 
            required
            style={inputStyle} 
          />
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email" 
            required
            style={inputStyle} 
          />
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="How can we help you?" 
            rows="4" 
            required
            style={inputStyle}
          ></textarea>
          
          <button 
            type="submit" // Changed from type="button"
            disabled={isSubmitting}
            style={{ 
              padding: '12px', 
              backgroundColor: isSubmitting ? '#94a3b8' : '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              fontWeight: 'bold', 
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s'
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
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
  fontSize: '1rem',
  outlineColor: '#2563eb',
  fontFamily: 'inherit'
};

export default Contact;
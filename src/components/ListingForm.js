import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Bed, Bath, Maximize } from 'lucide-react';
const ListingForm = ({ addProperty, user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', price: '', location: '', type: 'Residential',
    beds: '', baths: '', sqft: '', description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newListing = {
      id: Date.now(),
      ...formData,
      price: `$${Number(formData.price).toLocaleString()}`,
      // In a real app, this would be the URL from the uploaded file
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800',
      agentName: user?.name || "Independent Seller"
    };

    addProperty(newListing);
    navigate('/');
  };

  return (
    <div style={{ padding: '100px 6%', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={styles.container}>
        <h2 style={styles.formTitle}>Property Details</h2>
        <form onSubmit={handleSubmit}>
          {/* Photo Upload Simulation */}
          <div style={styles.uploadBox}>
            <Camera size={30} color="#94a3b8" />
            <p>Click to upload property photos</p>
            <input type="file" style={styles.fileInput} disabled /> 
          </div>

          <div style={styles.grid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Title</label>
              <input style={styles.input} placeholder="Sunset Penthouse" required onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Price ($)</label>
              <input style={styles.input} type="number" placeholder="750000" required onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>
            <div style={styles.inputGroup}><label style={styles.label}><Bed size={14}/> Beds</label>
              <input style={styles.input} type="number" placeholder="3" onChange={(e) => setFormData({...formData, beds: e.target.value})} />
            </div>
            <div style={styles.inputGroup}><label style={styles.label}><Bath size={14}/> Baths</label>
              <input style={styles.input} type="number" placeholder="2" onChange={(e) => setFormData({...formData, baths: e.target.value})} />
            </div>
            <div style={styles.inputGroup}><label style={styles.label}><Maximize size={14}/> Sqft</label>
              <input style={styles.input} type="number" placeholder="1500" onChange={(e) => setFormData({...formData, sqft: e.target.value})} />
            </div>
            <div style={styles.inputGroup}><label style={styles.label}>Type</label>
              <select style={styles.input} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option>Residential</option><option>Commercial</option>
              </select>
            </div>
          </div>
          <button type="submit" style={styles.button}>Publish Listing</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
  uploadBox: { height: '150px', border: '2px dashed #e2e8f0', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', color: '#64748b', cursor: 'pointer', position: 'relative' },
  fileInput: { position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.9rem', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem' },
  button: { width: '100%', padding: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' },
  formTitle: { marginBottom: '25px', color: '#0f172a' }
};

export default ListingForm;
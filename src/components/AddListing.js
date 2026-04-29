import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { UploadCloud, X, Home, DollarSign, Bed, Bath, Maximize, MapPin, FileText, CheckCircle2 } from 'lucide-react';

const AddListing = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); 
  const [previews, setPreviews] = useState([]); 
  const [formData, setFormData] = useState({
    title: '', price: '', beds: '', baths: '', sqft: '', 
    type: 'Residential', address: '', description: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return alert("Please upload at least one image.");
    setLoading(true);

    try {
      const uploadedUrls = [];

      for (const file of images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(publicUrl);
      }

      // SYNCED WITH SUPABASE TABLE (image_9851db.png)
      const { error } = await supabase.from('properties').insert([{
        title: formData.title,
        price: formData.price.toString(), // Database uses text for price
        location: formData.address,       // Maps 'address' to 'location' column
        beds: parseInt(formData.beds) || 0,
        baths: parseInt(formData.baths) || 0,
        sqft: parseInt(formData.sqft) || 0,
        image_url: uploadedUrls[0],       // Primary image column
        images: uploadedUrls,             // Array column for all photos
        property_type: formData.type,     // Maps 'type' to 'property_type' column
        agent_id: user.id,
        description: formData.description
      }]);

      if (error) throw error;
      alert("Success! Your listing is now live.");
      navigate('/agent-dashboard');

    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.formCard} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Property Details</h2>

        <div style={styles.uploadSection}>
          <label style={styles.dropZone}>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            <UploadCloud size={48} color="#94a3b8" />
            <p style={styles.uploadText}>Click to upload property photos</p>
            <span style={styles.uploadSubtext}>JPG, PNG up to 10MB</span>
          </label>

          <div style={styles.previewGrid}>
            {previews.map((url, i) => (
              <div key={i} style={styles.previewWrapper}>
                <img src={url} alt="Preview" style={styles.previewImg} />
                <button type="button" onClick={() => removeImage(i)} style={styles.removeBtn}><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title</label>
            <div style={styles.inputWrapper}>
              <Home size={18} style={styles.icon} />
              <input name="title" placeholder="Sunset Penthouse" style={styles.input} onChange={handleChange} required />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Price ($)</label>
            <div style={styles.inputWrapper}>
              <DollarSign size={18} style={styles.icon} />
              <input name="price" type="number" placeholder="750000" style={styles.input} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div style={styles.row}>
           <div style={styles.smallGroup}><label style={styles.label}><Bed size={14}/> Beds</label><input name="beds" type="number" style={styles.inputSimple} onChange={handleChange} /></div>
           <div style={styles.smallGroup}><label style={styles.label}><Bath size={14}/> Baths</label><input name="baths" type="number" style={styles.inputSimple} onChange={handleChange} /></div>
           <div style={styles.smallGroup}><label style={styles.label}><Maximize size={14}/> Sqft</label><input name="sqft" type="number" style={styles.inputSimple} onChange={handleChange} /></div>
           <div style={styles.smallGroup}><label style={styles.label}>Type</label><select name="type" style={styles.inputSimple} onChange={handleChange}><option>Residential</option><option>Villa</option><option>Office</option></select></div>
        </div>

        <div style={styles.fullGroup}>
          <label style={styles.label}><MapPin size={16} /> Location</label>
          <input name="address" placeholder="123 Luxury St, Dubai" style={styles.inputSimple} onChange={handleChange} required />
        </div>

        <div style={styles.fullGroup}>
          <label style={styles.label}><FileText size={16} /> Description</label>
          <textarea name="description" placeholder="Describe the property..." style={styles.textarea} onChange={handleChange} required />
        </div>

        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? "Publishing..." : <><CheckCircle2 size={20} /> Publish Listing</>}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#f8fafc', padding: '40px 20px', minHeight: '100vh', display: 'flex', justifyContent: 'center' },
  formCard: { backgroundColor: 'white', maxWidth: '800px', width: '100%', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
  title: { fontSize: '24px', color: '#1e293b', marginBottom: '32px', fontWeight: 'bold' },
  uploadSection: { marginBottom: '30px' },
  dropZone: { border: '2px dashed #e2e8f0', borderRadius: '16px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', backgroundColor: '#fcfdfe' },
  uploadText: { marginTop: '12px', color: '#475569', fontWeight: '600' },
  uploadSubtext: { fontSize: '12px', color: '#94a3b8' },
  previewGrid: { display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' },
  previewWrapper: { position: 'relative', width: '80px', height: '80px' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' },
  removeBtn: { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '2px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  row: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  smallGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  fullGroup: { marginBottom: '20px' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: '12px', color: '#94a3b8' },
  input: { width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '15px' },
  inputSimple: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '15px', minHeight: '100px', boxSizing: 'border-box' },
  submitBtn: { width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }
};

export default AddListing;
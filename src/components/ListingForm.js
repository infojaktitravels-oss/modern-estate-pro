import React, { useState, useEffect } from 'react';
import { UploadCloud, Loader2, X, Home, DollarSign, MapPin } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const ListingForm = ({ user, addProperty }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    beds: '',
    baths: '',
    sqft: '',
    type: 'Residential',
    description: ''
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      alert("Please login first");
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreview(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreview(preview.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const urls = [];
    for (let file of images) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error("UPLOAD ERROR:", uploadError);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        urls.push(publicUrlData.publicUrl);
      }
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return alert("Please upload at least one image.");
    setLoading(true);

    try {
      const imageUrls = await uploadImages();

      // ✅ FIX: Saving everything to the 'properties' table in one go
      // This matches the columns seen in your Supabase screenshot
      const { data, error } = await supabase
        .from('properties')
        .insert({
          title: form.title,
          price: parseFloat(form.price), // Ensure it's a number
          location: form.location,
          beds: parseInt(form.beds) || 0,
          baths: parseInt(form.baths) || 0,
          sqft: parseInt(form.sqft) || 0,
          property_type: form.type,
          agent_id: user.id,
          image_url: imageUrls[0], // Primary image for the card
          images: imageUrls,       // Full gallery (text array column)
        })
        .select()
        .single();

      if (error) throw error;

      if (addProperty) addProperty(data);
      alert("Property published successfully!");
      navigate('/agent-dashboard');

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Property Details</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}><Home size={16}/> Title</label>
            <input name="title" placeholder="e.g. Modern Luxury Villa" value={form.title} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}><DollarSign size={16}/> Price</label>
              <input name="price" type="number" placeholder="750000" value={form.price} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}><MapPin size={16}/> Location</label>
              <input name="location" placeholder="City, Area" value={form.location} onChange={handleChange} style={styles.input} required />
            </div>
          </div>

          <div style={styles.row}>
            <input name="beds" type="number" placeholder="Beds" onChange={handleChange} style={styles.input} />
            <input name="baths" type="number" placeholder="Baths" onChange={handleChange} style={styles.input} />
            <input name="sqft" type="number" placeholder="Sqft" onChange={handleChange} style={styles.input} />
          </div>

          <label style={styles.uploadBox}>
            <UploadCloud size={32} />
            <p>Click to upload property photos</p>
            <input type="file" multiple hidden onChange={handleImageChange} accept="image/*" />
          </label>

          <div style={styles.previewGrid}>
            {preview.map((img, i) => (
              <div key={i} style={styles.previewWrapper}>
                <img src={img} alt="preview" style={styles.previewImg} />
                <button type="button" onClick={() => removeImage(i)} style={styles.removeBtn}><X size={12}/></button>
              </div>
            ))}
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? <Loader2 className="spin" /> : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', display: 'flex', justifyContent: 'center' },
  card: { background: '#ffffff', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '700px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  title: { fontSize: '1.8rem', marginBottom: '30px', color: '#1e293b', fontWeight: '800' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  label: { fontSize: '14px', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' },
  input: { padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', width: '100%', boxSizing: 'border-box' },
  row: { display: 'flex', gap: '15px' },
  uploadBox: { border: '2px dashed #cbd5e1', padding: '30px', textAlign: 'center', borderRadius: '16px', cursor: 'pointer', color: '#64748b', transition: '0.2s', backgroundColor: '#fcfdfe' },
  previewGrid: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  previewWrapper: { position: 'relative' },
  previewImg: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0' },
  removeBtn: { position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '4px' },
  button: { background: '#2563eb', color: '#fff', padding: '16px', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }
};

export default ListingForm;
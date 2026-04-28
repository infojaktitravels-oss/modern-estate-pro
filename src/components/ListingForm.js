import React, { useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const ListingForm = ({ user, addProperty }) => {
  const [form, setForm] = useState({
    title: '',
    price: '',
    beds: '',
    baths: '',
    sqft: '',
    type: 'Residential'
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreview(previews);
  };

  // Upload images to Supabase
  const uploadImages = async () => {
    const urls = [];

    for (let file of images) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (error) {
        console.error(error);
        continue;
      }

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      urls.push(data.publicUrl);
    }

    return urls;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = await uploadImages();

      const newProperty = {
        ...form,
        images: imageUrls,
        user_id: user.id
      };

      // Save to Supabase DB
      const { error } = await supabase
        .from('properties')
        .insert([newProperty]);

      if (error) throw error;

      addProperty(newProperty);

      alert('Property listed successfully!');
      setForm({
        title: '',
        price: '',
        beds: '',
        baths: '',
        sqft: '',
        type: 'Residential'
      });
      setImages([]);
      setPreview([]);

    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Property Listing</h2>

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* IMAGE UPLOAD */}
        <label style={styles.uploadBox}>
          <UploadCloud size={40} />
          <p>Click or drag images to upload</p>
          <input type="file" multiple hidden onChange={handleImageChange} />
        </label>

        {/* PREVIEW */}
        <div style={styles.previewGrid}>
          {preview.map((src, i) => (
            <img key={i} src={src} alt="preview" style={styles.previewImg} />
          ))}
        </div>

        {/* INPUTS */}
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} style={styles.input} required />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} style={styles.input} required />

        <div style={styles.row}>
          <input name="beds" placeholder="Beds" value={form.beds} onChange={handleChange} style={styles.input} />
          <input name="baths" placeholder="Baths" value={form.baths} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.row}>
          <input name="sqft" placeholder="Sqft" value={form.sqft} onChange={handleChange} style={styles.input} />
          <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
            <option>Residential</option>
            <option>Commercial</option>
          </select>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? <Loader2 style={styles.spinner} /> : 'Publish Listing'}
        </button>

      </form>
    </div>
  );
};

const styles = {
  container: { padding: '40px', maxWidth: '800px', margin: 'auto' },
  title: { marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },

  uploadBox: {
    border: '2px dashed #cbd5e1',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '12px'
  },

  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 100px)',
    gap: '10px'
  },

  previewImg: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px'
  },

  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },

  row: {
    display: 'flex',
    gap: '10px'
  },

  button: {
    background: '#2563eb',
    color: 'white',
    padding: '14px',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 'bold'
  },

  spinner: {
    animation: 'spin 1s linear infinite'
  }
};

export default ListingForm;
import React, { useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const ListingForm = ({ user, addProperty }) => {
  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    beds: '',
    baths: '',
    sqft: '',
    type: 'Residential',
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreview(previews);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = await uploadImages();

      // ✅ Insert property
      const { data, error } = await supabase
        .from('properties')
        .insert({
          title: form.title,
          price: form.price,
          location: form.location,
          image_url: imageUrls[0], // main image
          beds: form.beds,
          baths: form.baths,
          sqft: form.sqft,
          property_type: form.type,
          agent_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // ✅ Insert multiple images
      if (imageUrls.length > 0) {
        await supabase.from('property_images').insert(
          imageUrls.map(url => ({
            property_id: data.id,
            image_url: url,
          }))
        );
      }

      addProperty(data);
      alert("Property added successfully!");

      setForm({
        title: '',
        price: '',
        location: '',
        beds: '',
        baths: '',
        sqft: '',
        type: 'Residential',
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
      <div style={styles.card}>
        <h2 style={styles.title}>Add New Property</h2>

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* INPUTS */}
          {['title', 'price', 'location'].map(field => (
            <input
              key={field}
              name={field}
              placeholder={field.toUpperCase()}
              value={form[field]}
              onChange={handleChange}
              style={styles.input}
              required
            />
          ))}

          <div style={styles.row}>
            <input name="beds" placeholder="Beds" onChange={handleChange} style={styles.input} />
            <input name="baths" placeholder="Baths" onChange={handleChange} style={styles.input} />
            <input name="sqft" placeholder="Sqft" onChange={handleChange} style={styles.input} />
          </div>

          {/* IMAGE UPLOAD */}
          <label style={styles.uploadBox}>
            <UploadCloud size={28} />
            <span>Upload Property Images</span>
            <input type="file" multiple hidden onChange={handleImageChange} />
          </label>

          {/* PREVIEW */}
          <div style={styles.previewGrid}>
            {preview.map((img, i) => (
              <img key={i} src={img} alt="preview" style={styles.previewImg} />
            ))}
          </div>

          {/* BUTTON */}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? <Loader2 className="spin" /> : 'Submit Property'}
          </button>

        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#0f172a',
    minHeight: '100vh',
    padding: '40px',
    display: 'flex',
    justifyContent: 'center'
  },
  card: {
    background: '#ffffff',
    padding: '30px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '20px',
    color: '#0f172a',
    fontWeight: '800'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem'
  },
  row: {
    display: 'flex',
    gap: '10px'
  },
  uploadBox: {
    border: '2px dashed #2563eb',
    padding: '20px',
    textAlign: 'center',
    borderRadius: '12px',
    cursor: 'pointer',
    color: '#2563eb',
    fontWeight: '600'
  },
  previewGrid: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  previewImg: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  button: {
    background: '#2563eb',
    color: '#fff',
    padding: '14px',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer'
  }
};

export default ListingForm;
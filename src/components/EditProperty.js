import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const EditProperty = () => {
  const { id } = useParams();
  const [form, setForm] = useState({});

  // ✅ FIXED useEffect (no duplicate function)
  useEffect(() => {
    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setForm(data);
      if (error) console.error(error);
    };

    fetchProperty();
  }, [id]);

  const updateProperty = async () => {
    const { error } = await supabase
      .from('properties')
      .update(form)
      .eq('id', id);

    if (error) {
      alert("Error updating property");
      console.error(error);
    } else {
      alert("Updated successfully!");
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>Edit Property</h2>

      <input
        value={form.title || ''}
        onChange={e => setForm({ ...form, title: e.target.value })}
        placeholder="Property Title"
        style={{ padding: '10px', marginBottom: '10px', width: '300px' }}
      />

      <br />

      <button onClick={updateProperty} style={{ padding: '10px 20px' }}>
        Save
      </button>
    </div>
  );
};

export default EditProperty;
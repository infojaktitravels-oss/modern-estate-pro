import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const EditProperty = () => {
  const { id } = useParams();
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const fetchProperty = async () => {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    setForm(data);
  };

  const updateProperty = async () => {
    await supabase
      .from('properties')
      .update(form)
      .eq('id', id);

    alert("Updated!");
  };

  return (
    <div>
      <h2>Edit Property</h2>
      <input value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} />
      <button onClick={updateProperty}>Save</button>
    </div>
  );
};

export default EditProperty;
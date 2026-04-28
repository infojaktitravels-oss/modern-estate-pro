import React, { useState, useEffect } from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Header from './components/Header';
import Hero from './components/Hero';
import Properties from './components/Properties'; 
import About from './components/About';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Auth from './components/Auth';
import AgentDashboard from './components/AgentDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import ListingForm from './components/ListingForm';
import Settings from './components/Settings'; 
import PropertyDetails from './components/PropertyDetails';
import AdminDashboard from './components/AdminDashboard';
import { supabase } from './supabaseClient'; // Import your real database client

function App() {
  // 1. User should be null (no user) or an object. Never an empty array.
  const [user, setUser] = useState(null); 
  
  // 2. Fixed the broken array syntax here
  const [properties, setProperties] = useState([
    { 
      id: 1, 
      title: 'Modern Sunset Villa', 
      price: '$850,000', 
      location: 'Malibu, CA', 
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800',
      beds: '4', baths: '3', sqft: '2,500', type: 'Residential'
    },
    { 
      id: 2, 
      title: 'Luxury Skyline Apartment', 
      price: '$1,200,000', 
      location: 'New York, NY', 
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800',
      beds: '2', baths: '2', sqft: '1,100', type: 'Commercial'
    }
  ]);

  // 3. REALITY CHECK: Fetch data from Supabase on load
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    checkUser();
  }, []);

  const addProperty = (newProp) => {
    setProperties([newProp, ...properties]);
  };

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', scrollBehavior: 'smooth' }}>
      <Header user={user} setUser={setUser} />
      
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <section id="properties"><Properties properties={properties} /></section>
              <section id="about"><About /></section>
              <section id="pricing"><Pricing user={user} setUser={setUser} /></section>
              <section id="contact"><Contact /></section>
            </>
          } />
          
          <Route path="/login" element={<Auth setUser={setUser} />} />
          <Route path="/pricing" element={<Pricing user={user} setUser={setUser} />} />
          <Route path="/property/:id" element={<PropertyDetails properties={properties} />} />

          <Route 
            path="/settings" 
            element={user ? <Settings user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/list-property" 
            element={user ? <ListingForm addProperty={addProperty} user={user} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/agent-portal" 
            element={user?.role === 'agent' ? <AgentDashboard user={user} properties={properties} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/buyer-dashboard" 
            element={user?.role === 'buyer' ? <BuyerDashboard user={user} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      <footer style={{ padding: '60px 6%', backgroundColor: '#0f172a', color: 'white', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>ModernEstate</h2>
        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Helping you find the perfect place to call home.</p>
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '20px', fontSize: '0.9rem', color: '#64748b' }}>
          &copy; 2026 ModernEstate. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';

// Components
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
import AddListing from './components/AddListing';
import EditProperty from './components/EditProperty';
import { supabase } from './supabaseClient';


// 🔐 PROTECTED ROUTE COMPONENT
const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

// 🧠 ROLE-BASED ROUTE
const RoleRoute = ({ user, role, children }) => {
  return user?.user_metadata?.role === role
    ? children
    : <Navigate to="/login" />;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  // 🔐 Auth
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 📦 Fetch Properties
  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (!error && data) setProperties(data);
    };

    fetchProperties();
  }, []);

  const addProperty = (newProp) => {
    setProperties((prev) => [newProp, ...prev]);
  };

  // ⏳ Loading
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Loading ModernEstate...</h2>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <Header user={user} setUser={setUser} />

      <main style={{ minHeight: '80vh' }}>
        <Routes>

          {/* 🏠 HOME */}
          <Route path="/" element={
            <>
              <Hero />
              <section id="properties">
                <Properties properties={properties} />
              </section>
              <section id="about"><About /></section>
              <section id="pricing">
                <Pricing user={user} setUser={setUser} />
              </section>
              <section id="contact"><Contact /></section>
            </>
          } />

          {/* 🌐 PUBLIC */}
          <Route path="/login" element={<Auth setUser={setUser} />} />
          <Route path="/property/:id" element={<PropertyDetails properties={properties} />} />

          {/* 🔐 PROTECTED */}
          <Route path="/settings" element={
            <ProtectedRoute user={user}>
              <Settings user={user} setUser={setUser} />
            </ProtectedRoute>
          } />

          <Route path="/list-property" element={
            <ProtectedRoute user={user}>
              <ListingForm addProperty={addProperty} user={user} />
            </ProtectedRoute>
          } />

          <Route path="/add-listing" element={
            <ProtectedRoute user={user}>
              <AddListing user={user} />
            </ProtectedRoute>
          } />

          {/* 👤 ROLE BASED */}
          <Route path="/agent-portal" element={
            <RoleRoute user={user} role="agent">
              <AgentDashboard user={user} properties={properties} />
            </RoleRoute>
          } />

          <Route path="/buyer-dashboard" element={
            <RoleRoute user={user} role="buyer">
              <BuyerDashboard user={user} />
            </RoleRoute>
          } />

          <Route path="/admin" element={
            <RoleRoute user={user} role="admin">
              <AdminDashboard />
            </RoleRoute>
          } />

          <Route path="/edit/:id" 
  element={
    <ProtectedRoute user={user}>
      <EditProperty user={user} />
    </ProtectedRoute>
  } 
/>

          {/* 🔁 FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
          

        </Routes>
      </main>

      {/* FOOTER */}
      <footer style={{ padding: '60px 6%', backgroundColor: '#0f172a', color: 'white', textAlign: 'center' }}>
        <h2>ModernEstate</h2>
        <p style={{ color: '#94a3b8' }}>
          Helping you find the perfect place to call home.
        </p>
        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#64748b' }}>
          © 2026 ModernEstate. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
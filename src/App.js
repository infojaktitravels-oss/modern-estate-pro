import React, { useState, useEffect } from 'react'; 
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

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
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// 🧠 ROLE-BASED ROUTE
const RoleRoute = ({ user, role, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return user?.user_metadata?.role === role
    ? children
    : <Navigate to="/" replace />; 
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]); // Fixed typo
  const navigate = useNavigate();

  // 🔐 Auth Listener & Initialization
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProperties([]);
        setFilteredProperties([]);
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // 📦 Fetch Properties
  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (!error && data) {
        setProperties(data);
        setFilteredProperties(data); // Initialize filtered list
      }
    };
    fetchProperties();
  }, []);

  // 🔍 Search Logic
  const handleSearch = (query) => {
    if (!query || query.trim() === "") {
      setFilteredProperties(properties);
      return;
    }
    const filtered = properties.filter(p => 
      p.location?.toLowerCase().includes(query.toLowerCase()) || 
      p.title?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProperties(filtered);
  };

  const addProperty = (newProp) => {
    setProperties((prev) => [newProp, ...prev]);
    setFilteredProperties((prev) => [newProp, ...prev]);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
        <h2 style={{ color: '#0f172a', fontWeight: '800' }}>ModernEstate</h2>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '"Inter", sans-serif', color: '#0f172a' }}>
      <Header user={user} setUser={setUser} />

      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {/* 🏠 HOME */}
          <Route path="/" element={
            <>
              {/* Pass handleSearch to Hero */}
              <Hero onSearch={handleSearch} /> 
              <section id="properties">
                {/* Use filteredProperties instead of properties */}
                <Properties properties={filteredProperties} />
              </section>
              <section id="about"><About /></section>
              <section id="pricing">
                <Pricing user={user} />
              </section>
              <section id="contact"><Contact /></section>
            </>
          } />

          {/* 🌐 PUBLIC */}
          <Route path="/login" element={<Auth setUser={setUser} />} />
          <Route path="/property/:id" element={<PropertyDetails user={user} />} />

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

          <Route path="/edit/:id" element={
            <ProtectedRoute user={user}>
              <EditProperty user={user} />
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer style={{ padding: '80px 6%', backgroundColor: '#0f172a', color: 'white', textAlign: 'center' }}>
        <h2 style={{ fontWeight: '800', marginBottom: '10px' }}>ModernEstate</h2>
        <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto 20px' }}>
          Helping you find the perfect place to call home with ease and transparency.
        </p>
        <div style={{ marginTop: '30px', fontSize: '0.85rem', color: '#64748b', borderTop: '1px solid #1e293b', paddingTop: '20px' }}>
          © 2026 ModernEstate. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
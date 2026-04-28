import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { LayoutDashboard, Building2, Bell, TrendingUp, Users, DollarSign } from 'lucide-react';

const AgentDashboard = ({ user }) => {

  // ✅ STATE (fixes setLeads error)
  const [stats, setStats] = useState({ listings: 0, leads: 0, sales: 0 });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA (fixed all errors inside)
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // ✅ Properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*')
        .eq('agent_id', user.id);

      // ✅ Leads
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .eq('agent_id', user.id);

      // ✅ Notifications (optional)
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id);

      // ✅ Set state
      setStats({
        listings: propertiesData?.length || 0,
        leads: leadsData?.length || 0,
        sales: 0
      });

      setLeads(leadsData || []);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  // ✅ LOADING UI
  if (loading) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h3 style={{ marginBottom: '20px' }}>Agent Panel</h3>
        <div style={styles.navItem}><LayoutDashboard size={18}/> Dashboard</div>
        <div style={styles.navItem}><Building2 size={18}/> Properties</div>
        <div style={styles.navItem}><Bell size={18}/> Notifications</div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        <h1>Welcome, {user?.email}</h1>

        {/* STATS */}
        <div style={styles.grid}>
          <Card icon={<Building2 />} title="Listings" value={stats.listings} />
          <Card icon={<Users />} title="Leads" value={stats.leads} />
          <Card icon={<DollarSign />} title="Sales" value={`$${stats.sales}`} />
          <Card icon={<TrendingUp />} title="Growth" value="+14%" />
        </div>

        {/* LEADS TABLE */}
        <div style={styles.tableBox}>
          <h3>Recent Leads</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Interest</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.client_name}</td>
                    <td>{lead.property_title}</td>
                    <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No leads found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
};

// ✅ SMALL CARD COMPONENT
const Card = ({ icon, title, value }) => (
  <div style={styles.card}>
    <div>{icon}</div>
    <h4>{title}</h4>
    <h2>{value}</h2>
  </div>
);

// ✅ STYLES
const styles = {
  container: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: '220px', background: '#1e293b', color: 'white', padding: '20px' },
  navItem: { marginBottom: '10px', display: 'flex', gap: '10px', cursor: 'pointer' },
  main: { flex: 1, padding: '40px', background: '#f1f5f9' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px', marginTop: '20px' },
  card: { background: 'white', padding: '20px', borderRadius: '10px' },
  tableBox: { marginTop: '40px', background: 'white', padding: '20px', borderRadius: '10px' },
  table: { width: '100%', borderCollapse: 'collapse' }
};

export default AgentDashboard;
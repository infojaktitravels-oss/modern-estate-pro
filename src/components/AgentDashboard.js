import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { LayoutDashboard, Building2, Bell, TrendingUp, Users, DollarSign } from 'lucide-react';

const AgentDashboard = ({ user }) => {
  const [stats, setStats] = useState({ listings: 0, leads: 0, sales: 0 });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentData = async () => {
      // 1. Fetch real properties owned by this agent
      const { data: propData } = await supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('agent_id', user.id);

      // 2. Fetch leads for this agent
      const { data: leadData } = await supabase
        .from('leads')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });

      setStats({
        listings: propData?.length || 0,
        leads: leadData?.length || 0,
        sales: 0 // You can calculate this from a 'sales' table later
      });
      setLeads(leadData || []);
      setLoading(false);
    };

    if (user) fetchAgentData();
  }, [user]);

  if (loading) return <div style={styles.loading}>Updating Dashboard...</div>;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarBrand}>AGENT MENU</div>
        <nav style={styles.nav}>
          <div style={styles.navItemActive}><LayoutDashboard size={20} /> Dashboard</div>
          <div style={styles.navItem}><Building2 size={20} /> My Properties</div>
          <div style={styles.navItem}><Bell size={20} /> Notifications</div>
        </nav>
      </aside>

      <main style={styles.main}>
        <h1 style={styles.welcome}>Welcome back, {user?.user_metadata?.first_name || 'Agent'}</h1>
        
        <div style={styles.statsGrid}>
          <StatCard icon={<Building2 color="#2563eb"/>} label="Active Listings" value={stats.listings} color="#eff6ff" />
          <StatCard icon={<Users color="#059669"/>} label="Total Leads" value={stats.leads} color="#ecfdf5" />
          <StatCard icon={<DollarSign color="#d97706"/>} label="Total Sales" value={`$${stats.sales}M`} color="#fffbeb" />
          <StatCard icon={<TrendingUp color="#7c3aed"/>} label="Performance" value="+14%" color="#f5f3ff" />
        </div>

        <div style={styles.tableCard}>
          <h3 style={styles.tableTitle}>Recent Leads</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Interest</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={styles.tr}>
                  <td style={styles.td}>{lead.client_name}</td>
                  <td style={styles.td}>{lead.property_title}</td>
                  <td style={styles.td}><span style={styles.badge}>{lead.status}</span></td>
                  <td style={styles.td}>{new Date(lead.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {leads.length === 0 && <tr><td colSpan="4" style={styles.empty}>No leads yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

// Simplified StatCard Component
const StatCard = ({ icon, label, value, color }) => (
  <div style={{...styles.card, backgroundColor: 'white'}}>
    <div style={{...styles.iconBox, backgroundColor: color}}>{icon}</div>
    <div>
      <p style={styles.cardLabel}>{label}</p>
      <h2 style={styles.cardValue}>{value}</h2>
    </div>
  </div>
);

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' },
  sidebar: { width: '260px', backgroundColor: '#1e293b', color: 'white', padding: '24px' },
  sidebarBrand: { fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '24px', letterSpacing: '1px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#94a3b8' },
  navItemActive: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', backgroundColor: '#334155', color: 'white' },
  main: { flex: 1, padding: '40px' },
  welcome: { fontSize: '1.8rem', color: '#0f172a', marginBottom: '32px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' },
  card: { padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  iconBox: { padding: '12px', borderRadius: '12px' },
  cardLabel: { fontSize: '0.875rem', color: '#64748b', margin: 0 },
  cardValue: { fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', margin: 0 },
  tableCard: { backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  tableTitle: { marginBottom: '20px', color: '#0f172a' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thRow: { borderBottom: '1px solid #f1f5f9' },
  th: { textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '0.875rem' },
  td: { padding: '16px 12px', borderBottom: '1px solid #f8fafc', fontSize: '0.9rem', color: '#334155' },
  badge: { backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' },
  loading: { padding: '100px', textAlign: 'center', fontSize: '1.2rem' },
  empty: { textAlign: 'center', padding: '40px', color: '#94a3b8' }
};

export default AgentDashboard;
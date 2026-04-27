import React from 'react';
import { LayoutDashboard, Building, Users, TrendingUp, DollarSign, Bell } from 'lucide-react';

const AgentDashboard = () => {
  const agentName = "Agent Smith";

  const stats = [
    { label: 'Active Listings', value: '12', icon: <Building size={20} />, color: '#3b82f6' },
    { label: 'Total Leads', value: '48', icon: <Users size={20} />, color: '#10b981' },
    { label: 'Total Sales', value: '$2.4M', icon: <DollarSign size={20} />, color: '#f59e0b' },
    { label: 'Performance', value: '+14%', icon: <TrendingUp size={20} />, color: '#8b5cf6' },
  ];

  return (
    <div style={styles.container}>
      
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Agent Menu</div>
        <div style={styles.sidebarItem}><LayoutDashboard size={18} /> Dashboard</div>
        <div style={styles.sidebarItem}><Building size={18} /> My Properties</div>
        <div style={styles.sidebarItem}><Bell size={18} /> Notifications</div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <h1 style={styles.title}>Welcome back, {agentName}</h1>
        
        {/* Stats */}
        <div style={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <div key={idx} style={styles.statCard}>
              <div style={{ ...styles.iconBox, backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <div style={styles.statLabel}>{stat.label}</div>
                <div style={styles.statValue}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={styles.tableSection}>
          <h2 style={styles.sectionTitle}>Recent Leads</h2>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Interest</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>John Doe</td>
                <td style={styles.td}>Luxury Villa</td>
                <td style={styles.td}>
                  <span style={styles.statusBadge}>New</span>
                </td>
                <td style={styles.td}>Apr 27, 2026</td>
              </tr>
              <tr>
                <td style={styles.td}>Sarah Wilson</td>
                <td style={styles.td}>Downtown Condo</td>
                <td style={styles.td}>
                  <span style={styles.statusBadgePending}>Follow-up</span>
                </td>
                <td style={styles.td}>Apr 26, 2026</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', marginTop: '80px' },
  sidebar: { width: '250px', minWidth: '200px', backgroundColor: '#1e293b', color: 'white', padding: '20px' },
  sidebarTitle: { fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px' },
  sidebarItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#cbd5e1', marginBottom: '5px' },
  main: { flex: 1, padding: '40px' },
  title: { fontSize: '1.8rem', color: '#0f172a', marginBottom: '30px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' },
  statCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  iconBox: { padding: '10px', borderRadius: '10px', color: 'white' },
  statLabel: { fontSize: '0.9rem', color: '#64748b' },
  statValue: { fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' },
  tableSection: { backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  sectionTitle: { fontSize: '1.1rem', marginBottom: '20px', color: '#1e293b' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { borderBottom: '1px solid #e2e8f0', textAlign: 'left' },
  th: { padding: '12px', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' },
  td: { padding: '15px 12px', color: '#334155', fontSize: '0.95rem', borderBottom: '1px solid #f1f5f9' },
  statusBadge: { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' },
  statusBadgePending: { backgroundColor: '#fef9c3', color: '#854d0e', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' },
};

export default AgentDashboard;
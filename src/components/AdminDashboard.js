import React from 'react';
import { Users, Home, DollarSign } from 'lucide-react'; // Removed ShieldCheck
const AdminDashboard = ({ allProperties, allUsers }) => {
  return (
    <div style={{ padding: '100px 6%', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '30px' }}>Platform Control Center</h1>
      
      {/* Stats Overview */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}><Users color="#2563eb"/> <div><span>Total Users</span><h3>1,240</h3></div></div>
        <div style={styles.statCard}><Home color="#10b981"/> <div><span>Total Listings</span><h3>450</h3></div></div>
        <div style={styles.statCard}><DollarSign color="#f59e0b"/> <div><span>Revenue (MTD)</span><h3>$12,400</h3></div></div>
      </div>

      <div style={styles.mainGrid}>
        {/* Listing Approval Queue */}
        <div style={styles.tableCard}>
          <h3>Pending Approvals</h3>
          <table style={styles.table}>
            <thead>
              <tr><th>Property</th><th>Agent</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Skyline Loft</td>
                <td>Agent Smith</td>
                <td><span style={styles.badgePending}>Pending</span></td>
                <td><button style={styles.approveBtn}>Approve</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* User Management */}
        <div style={styles.tableCard}>
          <h3>Subscription Management</h3>
          <div style={styles.userList}>
            <div style={styles.userRow}>
              <span>Sarah Wilson</span>
              <span style={styles.badgePro}>PRO</span>
              <button style={styles.editBtn}>Edit Plan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' },
  statCard: { backgroundColor: 'white', padding: '25px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  mainGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' },
  tableCard: { backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  badgePending: { backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' },
  badgePro: { backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' },
  approveBtn: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
  editBtn: { background: 'none', border: '1px solid #e2e8f0', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' },
  userRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f5f9' }
};

export default AdminDashboard;
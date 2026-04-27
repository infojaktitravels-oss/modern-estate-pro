import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Settings, LogOut, ChevronDown, Heart, PlusCircle } from 'lucide-react';

const Header = ({ user, setUser }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      {/* Left: Logo */}
      <Link to="/" style={styles.logoSection}>
        <div style={styles.iconBox}><Home size={22} color="white" /></div>
        <span style={styles.logoText}>ModernEstate</span>
      </Link>
      
      {/* Center: Main Navigation */}
      <div style={styles.menu}>
        <a href="/#properties" style={styles.navLink}>Properties</a>
        <a href="/#about" style={styles.navLink}>About</a>
        <a href="/#pricing" style={styles.navLink}>Pricing</a>
        <a href="/#contact" style={styles.navLink}>Contact</a>
      </div>

      {/* Right: Auth Actions */}
      <div style={styles.authActions}>
        {!user ? (
          <div style={styles.authGap}>
            <Link to="/login" style={styles.loginText}>Sign In</Link>
            <Link to="/login" style={styles.primaryBtn}>Get Started</Link>
          </div>
        ) : (
          <div style={styles.userControls}>
            {user.role === 'buyer' && (
              <Link to="/buyer-dashboard" style={styles.wishlistBtn} title="Saved Homes">
                <Heart size={20} color="#64748b" />
                <span style={styles.badge}>2</span>
              </Link>
            )}

            <div style={styles.profileContainer}>
              <button 
                style={styles.profileTrigger} 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div style={styles.avatar}>{user.name?.charAt(0) || 'U'}</div>
                <ChevronDown size={14} color="#64748b" />
              </button>

              {showDropdown && (
                <>
                  {/* Backdrop to close dropdown when clicking outside */}
                  <div style={styles.backdrop} onClick={() => setShowDropdown(false)} />
                  <div style={styles.dropdown}>
                    <div style={styles.dropdownHeader}>
                      <span style={styles.userName}>{user.name}</span>
                      <span style={styles.userRole}>{user.role} Account</span>
                    </div>
                    <Link to={user.role === 'buyer' ? "/buyer-dashboard" : "/agent-portal"} style={styles.dropItem} onClick={() => setShowDropdown(false)}>
                      <User size={16} /> Dashboard
                    </Link>
                    <Link to="/settings" style={styles.dropItem} onClick={() => setShowDropdown(false)}>
                      <Settings size={16} /> Settings
                    </Link>
                    <div style={styles.divider} />
                    <button style={styles.logoutBtn} onClick={handleLogout}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

            <Link to="/list-property" style={styles.listBtn}>
              <PlusCircle size={18} /> 
              <span>List Property</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '0 6%', 
    height: '80px',
    backgroundColor: '#ffffff', 
    boxShadow: '0 2px 15px rgba(0,0,0,0.04)', 
    position: 'sticky', 
    top: 0, 
    zIndex: 1000 
  },
  logoSection: { display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' },
  iconBox: { backgroundColor: '#2563eb', padding: '8px', borderRadius: '10px', display: 'flex' },
  logoText: { fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' },
  
  menu: { display: 'flex', gap: '32px', alignItems: 'center' },
  navLink: { textDecoration: 'none', color: '#64748b', fontWeight: '600', fontSize: '0.9rem', transition: '0.2s color' },
  
  authActions: { display: 'flex', alignItems: 'center' },
  authGap: { display: 'flex', alignItems: 'center', gap: '24px' },
  loginText: { textDecoration: 'none', color: '#0f172a', fontWeight: '700', fontSize: '0.9rem' },
  primaryBtn: { backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' },
  
  userControls: { display: 'flex', alignItems: 'center', gap: '16px' },
  wishlistBtn: { position: 'relative', display: 'flex', padding: '8px', borderRadius: '50%', backgroundColor: '#f8fafc', textDecoration: 'none' },
  badge: { position: 'absolute', top: '0', right: '0', backgroundColor: '#ef4444', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' },
  
  profileContainer: { position: 'relative' },
  profileTrigger: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    cursor: 'pointer', 
    padding: '4px 8px', 
    borderRadius: '40px', 
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff',
    transition: '0.2s shadow'
  },
  avatar: { width: '32px', height: '32px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' },
  
  backdrop: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 },
  dropdown: { 
    position: 'absolute', 
    top: '50px', 
    right: 0, 
    backgroundColor: 'white', 
    width: '220px', 
    borderRadius: '16px', 
    boxShadow: '0 10px 40px rgba(0,0,0,0.12)', 
    border: '1px solid #f1f5f9', 
    overflow: 'hidden', 
    padding: '8px' 
  },
  dropdownHeader: { padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '2px' },
  userName: { fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' },
  userRole: { fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  dropItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', textDecoration: 'none', color: '#475569', fontSize: '0.9rem', borderRadius: '8px', transition: '0.2s' },
  divider: { height: '1px', backgroundColor: '#f1f5f9', margin: '8px 0' },
  logoutBtn: { width: '100%', border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#ef4444', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '8px' },
  
  listBtn: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    backgroundColor: '#0f172a', 
    color: 'white', 
    padding: '10px 18px', 
    borderRadius: '10px', 
    border: 'none', 
    cursor: 'pointer', 
    fontWeight: '700',
    fontSize: '0.9rem',
    textDecoration: 'none'
  }
};

export default Header;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('buyer'); 
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    
    // Simulate User Data
    const userData = {
      name: "SA User",
      email: "user@example.com",
      role: role,
      plan: 'pro' 
    };

    setUser(userData); 
    
    if (role === 'agent' || role === 'seller') {
      navigate('/agent-portal');
    } else {
      navigate('/buyer-dashboard');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authCard}>
        <div style={styles.header}>
          <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={styles.subtitle}>{isLogin ? 'Login to manage your real estate journey' : 'Join ModernEstate today'}</p>
        </div>

        <div style={styles.roleContainer}>
          <button 
            type="button"
            onClick={() => setRole('buyer')}
            style={{...styles.roleBtn, borderColor: role === 'buyer' ? '#2563eb' : '#e2e8f0', backgroundColor: role === 'buyer' ? '#eff6ff' : 'white'}}
          >
            <User size={20} color={role === 'buyer' ? '#2563eb' : '#64748b'} />
            <span style={{color: role === 'buyer' ? '#2563eb' : '#64748b'}}>Buyer</span>
          </button>

          <button 
            type="button"
            onClick={() => setRole('agent')}
            style={{...styles.roleBtn, borderColor: role === 'agent' ? '#2563eb' : '#e2e8f0', backgroundColor: role === 'agent' ? '#eff6ff' : 'white'}}
          >
            <ShieldCheck size={20} color={role === 'agent' ? '#2563eb' : '#64748b'} />
            <span style={{color: role === 'agent' ? '#2563eb' : '#64748b'}}>Agent/Seller</span>
          </button>
        </div>

        <form style={styles.form} onSubmit={handleAuth}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input type="email" placeholder="name@example.com" style={styles.input} required />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input type="password" placeholder="••••••••" style={styles.input} required />
            </div>
          </div>
          <button type="submit" style={styles.submitBtn}>
            {isLogin ? 'Sign In' : 'Get Started'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={styles.footer}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.toggle}>
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </div>
      </div>
    </div>
  );
};

// THE MISSING PIECE:
const styles = {
  container: { minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' },
  authCard: { backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '450px' },
  header: { textAlign: 'center', marginBottom: '32px' },
  title: { fontSize: '1.8rem', color: '#0f172a', marginBottom: '8px' },
  subtitle: { color: '#64748b', fontSize: '0.95rem' },
  roleContainer: { display: 'flex', gap: '12px', marginBottom: '24px' },
  roleBtn: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: '2px solid', cursor: 'pointer', transition: '0.2s', fontWeight: '600' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '12px', color: '#94a3b8' },
  input: { width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem' },
  submitBtn: { backgroundColor: '#2563eb', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' },
  footer: { textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '0.9rem' },
  toggle: { color: '#2563eb', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }
};

export default Auth;
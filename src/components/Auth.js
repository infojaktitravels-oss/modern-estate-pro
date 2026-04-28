import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Globe, ArrowRight } from 'lucide-react'; 
import { supabase } from '../supabaseClient';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- GOOGLE LOGIN FUNCTION ---
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) alert(error.message);
  };

  // --- EMAIL/PASSWORD AUTH ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert(error.message);
      } else {
        const userRole = data.user.user_metadata?.role;
        navigate(userRole === 'agent' ? '/agent-portal' : '/buyer-dashboard');
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: formData.role,
          }
        }
      });

      if (error) alert(error.message);
      else alert("Check your email for a confirmation link!");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.authCard}>
        <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        
        <button onClick={handleGoogleLogin} style={styles.googleBtn} type="button">
          <Globe size={20} /> Continue with Google
        </button>

        <div style={styles.divider}><span>OR</span></div>

        <form style={styles.form} onSubmit={handleAuth}>
          {!isLogin && (
            <>
              <div style={styles.row}>
                <input name="firstName" placeholder="First Name" style={styles.input} onChange={handleChange} required />
                <input name="lastName" placeholder="Last Name" style={styles.input} onChange={handleChange} required />
              </div>
              <input name="phone" placeholder="Phone Number" type="tel" style={styles.input} onChange={handleChange} required />
              
              <select name="role" style={styles.input} onChange={handleChange}>
                <option value="buyer">I am a Buyer</option>
                <option value="agent">I am an Agent/Seller</option>
              </select>
            </>
          )}
          
          <input name="email" type="email" placeholder="Email Address" style={styles.input} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" style={styles.input} onChange={handleChange} required />
          
          {!isLogin && (
            <input name="confirmPassword" type="password" placeholder="Confirm Password" style={styles.input} onChange={handleChange} required />
          )}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 style={{animation: 'spin 1s linear infinite'}} /> : (
              <>
                {isLogin ? 'Sign In' : 'Register'} <ArrowRight size={18} style={{marginLeft: '8px'}} />
              </>
            )}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin ? "New here?" : "Already have an account?"} 
          <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
            {isLogin ? ' Create an account' : ' Login here'}
          </span>
        </p>
      </div>
    </div>
  );
};

// Moving styles down here fixes the "used before defined" warning
const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: '20px' },
  authCard: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px' },
  title: { textAlign: 'center', marginBottom: '24px', color: '#1e293b' },
  googleBtn: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600' },
  divider: { textAlign: 'center', margin: '20px 0', borderBottom: '1px solid #e2e8f0', lineHeight: '0.1em' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  row: { display: 'flex', gap: '10px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
  submitBtn: { backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  toggleText: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' },
  link: { color: '#2563eb', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline', marginLeft: '5px' }
};

export default Auth;
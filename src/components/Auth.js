import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Ensure this path is correct

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // --- LOG IN LOGIC ---
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        // Redirect based on the role stored in metadata
        const userRole = data.user.user_metadata.role;
        if (userRole === 'agent') navigate('/agent-portal');
        else navigate('/buyer-dashboard');
      }
    } else {
      // --- SIGN UP LOGIC ---
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role, // Saves 'buyer' or 'agent' into Supabase
          },
        },
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Success! Check your email for a confirmation link.");
      }
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.authCard}>
        <div style={styles.header}>
          <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={styles.subtitle}>
            {isLogin ? 'Login to manage your journey' : 'Join ModernEstate today'}
          </p>
        </div>

        {/* Role Selection (Only shown on Register) */}
        {!isLogin && (
          <div style={styles.roleContainer}>
            <button
              type="button"
              onClick={() => setRole('buyer')}
              style={{
                ...styles.roleBtn,
                borderColor: role === 'buyer' ? '#2563eb' : '#e2e8f0',
                backgroundColor: role === 'buyer' ? '#eff6ff' : 'white',
              }}
            >
              <User size={20} color={role === 'buyer' ? '#2563eb' : '#64748b'} />
              <span style={{ color: role === 'buyer' ? '#2563eb' : '#64748b' }}>Buyer</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('agent')}
              style={{
                ...styles.roleBtn,
                borderColor: role === 'agent' ? '#2563eb' : '#e2e8f0',
                backgroundColor: role === 'agent' ? '#eff6ff' : 'white',
              }}
            >
              <ShieldCheck size={20} color={role === 'agent' ? '#2563eb' : '#64748b'} />
              <span style={{ color: role === 'agent' ? '#2563eb' : '#64748b' }}>Agent</span>
            </button>
          </div>
        )}

        <form style={styles.form} onSubmit={handleAuth}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="name@example.com"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Get Started'} <ArrowRight size={18} />
              </>
            )}
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

// ... keep your styles object exactly as it was ...

export default Auth;
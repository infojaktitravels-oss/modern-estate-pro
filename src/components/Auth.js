import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        // 🔐 LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        const loggedUser = data?.user;
        setUser(loggedUser);

        const userRole = loggedUser?.user_metadata?.role;

        // ✅ Redirect based on role
        if (userRole === 'agent') navigate('/agent-portal');
        else if (userRole === 'admin') navigate('/admin');
        else navigate('/buyer-dashboard');

      } else {
        // 📝 SIGN UP
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role, // buyer | agent
            },
          },
        });

        if (error) throw error;

        // ✅ Switch to login after signup
        alert('Success! Check your email to confirm your account.');
        setIsLogin(true);
      }

    } catch (error) {
      setErrorMsg(error.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <p style={styles.subtitle}>
          {isLogin ? 'Login to continue' : 'Join ModernEstate'}
        </p>

        {/* ROLE SELECT (Signup only) */}
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
              <User size={18} />
              Buyer
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
              <ShieldCheck size={18} />
              Agent
            </button>
          </div>
        )}

        <form onSubmit={handleAuth} style={styles.form}>

          <div style={styles.inputGroup}>
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <div style={styles.error}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={18} style={styles.spinner} />
            ) : (
              <>
                {isLogin ? 'Login' : 'Sign Up'} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p style={styles.switch}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
            {isLogin ? ' Register' : ' Login'}
          </span>
        </p>

      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '10px'
  },
  subtitle: {
    color: '#64748b',
    marginBottom: '20px'
  },
  roleContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  roleBtn: {
    flex: 1,
    padding: '10px',
    border: '2px solid',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    gap: '5px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid #e2e8f0',
    padding: '10px',
    borderRadius: '10px'
  },
  input: {
    border: 'none',
    outline: 'none',
    flex: 1
  },
  button: {
    background: '#2563eb',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold'
  },
  spinner: {
    animation: 'spin 1s linear infinite'
  },
  error: {
    color: 'red',
    fontSize: '0.9rem'
  },
  switch: {
    marginTop: '20px',
    fontSize: '0.9rem'
  },
  link: {
    color: '#2563eb',
    cursor: 'pointer',
    marginLeft: '5px'
  }
};

export default Auth;
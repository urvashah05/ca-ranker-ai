import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { login, error: authError, loading } = useContext(AuthContext);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      background: '#F8F1E5'
    }}>
      {/* Floating Decorative Orbs */}
      <div className="glow-orb" style={{ top: '-10%', left: '-10%' }} />
      <div className="glow-orb" style={{ bottom: '-10%', right: '-10%', animationDelay: '4s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass-card-gold" 
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px',
          zIndex: 10
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#1A120B',
            color: '#D4AF37',
            marginBottom: '16px'
          }}>
            <BookOpen size={24} />
          </div>
          <h2 style={{
            fontSize: '1.8rem',
            fontFamily: 'var(--font-sora)',
            color: '#1A120B',
            marginBottom: '8px'
          }}>
            CA Ranker <em style={{ fontStyle: 'normal', color: '#D4AF37' }}>AI</em>
          </h2>
          <p style={{
            color: 'var(--muted-brown)',
            fontSize: '0.9rem'
          }}>
            Welcome back, future Ranker. Let's study.
          </p>
        </div>

        {/* Form Alerts */}
        {(validationError || authError) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '8px',
              color: '#1A120B',
              fontSize: '0.85rem',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
            <span>{validationError || authError}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="luxury-input-group">
            <label className="luxury-label">EMAIL ADDRESS</label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={18} 
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted-brown)'
                }} 
              />
              <input
                type="email"
                placeholder="you@domain.com"
                className="luxury-input"
                style={{ paddingLeft: '44px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="luxury-input-group" style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="luxury-label" style={{ marginBottom: 0 }}>PASSWORD</label>
              <Link 
                to="/forgot-password" 
                style={{
                  fontFamily: 'var(--font-sora)',
                  fontSize: '0.75rem',
                  color: '#D4AF37',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted-brown)'
                }} 
              />
              <input
                type="password"
                placeholder="••••••••"
                className="luxury-input"
                style={{ paddingLeft: '44px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary-gold"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              display: 'flex',
              gap: '8px',
              marginBottom: '24px'
            }}
            disabled={loading}
          >
            {loading ? 'Entering Academic Vault...' : 'Enter Dashboard'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Footer Navigation */}
        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
          <p style={{ color: 'var(--muted-brown)', fontSize: '0.85rem' }}>
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              style={{
                color: '#D4AF37',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Sign Up Free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

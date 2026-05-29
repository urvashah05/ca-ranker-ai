import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Mail, User as UserIcon, ArrowRight, BookOpen, AlertCircle, Award, Clock } from 'lucide-react';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [examLevel, setExamLevel] = useState('Final');
  const [targetAIR, setTargetAIR] = useState('50');
  const [dailyStudyGoal, setDailyStudyGoal] = useState('8');
  
  const [validationError, setValidationError] = useState('');
  const { signup, error: authError, loading } = useContext(AuthContext);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!fullName || !email || !password || !confirmPassword || !examLevel) {
      setValidationError('Please fill in all mandatory fields.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    const success = await signup({
      fullName,
      email,
      password,
      examLevel,
      targetAIR,
      dailyStudyGoal
    });

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '120vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
      background: '#F8F1E5'
    }}>
      {/* Orbs */}
      <div className="glow-orb" style={{ top: '-10%', right: '-10%' }} />
      <div className="glow-orb" style={{ bottom: '-10%', left: '-10%', animationDelay: '3s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass-card-gold" 
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '40px',
          zIndex: 10
        }}
      >
        {/* Header */}
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
            Begin Your AIR Journey
          </h2>
          <p style={{
            color: 'var(--muted-brown)',
            fontSize: '0.9rem'
          }}>
            Craft your luxury academic vault and unlock AI analytics today.
          </p>
        </div>

        {/* Alerts */}
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

        <form onSubmit={handleSubmit}>
          {/* Row 1: Name */}
          <div className="luxury-input-group">
            <label className="luxury-label">FULL NAME</label>
            <div style={{ position: 'relative' }}>
              <UserIcon 
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
                type="text"
                placeholder="e.g., Urva Shah"
                className="luxury-input"
                style={{ paddingLeft: '44px' }}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Row 2: Email */}
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

          {/* Row 3: Passwords */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div className="luxury-input-group" style={{ marginBottom: 0 }}>
              <label className="luxury-label">PASSWORD</label>
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

            <div className="luxury-input-group" style={{ marginBottom: 0 }}>
              <label className="luxury-label">CONFIRM PASSWORD</label>
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Row 4: CA Specifics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
            marginBottom: '28px'
          }}>
            {/* Exam Level */}
            <div className="luxury-input-group" style={{ marginBottom: 0 }}>
              <label className="luxury-label">EXAM LEVEL</label>
              <select
                className="luxury-input"
                value={examLevel}
                onChange={(e) => setExamLevel(e.target.value)}
                disabled={loading}
                style={{ appearance: 'none', cursor: 'pointer' }}
              >
                <option value="Foundation">CA Foundation</option>
                <option value="Intermediate">CA Intermediate</option>
                <option value="Final">CA Final</option>
              </select>
            </div>

            {/* Target AIR */}
            <div className="luxury-input-group" style={{ marginBottom: 0 }}>
              <label className="luxury-label">TARGET AIR RANK</label>
              <div style={{ position: 'relative' }}>
                <Award 
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
                  type="number"
                  placeholder="e.g., 50"
                  className="luxury-input"
                  style={{ paddingLeft: '44px' }}
                  min="1"
                  max="1000"
                  value={targetAIR}
                  onChange={(e) => setTargetAIR(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Daily Goal */}
            <div className="luxury-input-group" style={{ marginBottom: 0 }}>
              <label className="luxury-label">STUDY GOAL (HRS)</label>
              <div style={{ position: 'relative' }}>
                <Clock 
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
                  type="number"
                  placeholder="e.g., 8"
                  className="luxury-input"
                  style={{ paddingLeft: '44px' }}
                  min="1"
                  max="24"
                  value={dailyStudyGoal}
                  onChange={(e) => setDailyStudyGoal(e.target.value)}
                  disabled={loading}
                />
              </div>
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
            {loading ? 'Creating Portfolio...' : 'Access My EdTech Vault'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
          <p style={{ color: 'var(--muted-brown)', fontSize: '0.85rem' }}>
            Already registered?{' '}
            <Link 
              to="/login" 
              style={{
                color: '#D4AF37',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

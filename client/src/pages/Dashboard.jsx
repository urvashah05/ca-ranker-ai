import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  LogOut, Flame, Clock, Award, BookOpen, 
  Brain, BarChart2, Play, CheckSquare, Sparkles, TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // If user is null or not loaded yet, show a luxurious fallback loader
  if (!user) {
    return (
      <div style={{
        height: '100vh',
        backgroundColor: '#F8F1E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid rgba(212, 175, 55, 0.2)',
          borderTopColor: '#D4AF37',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontFamily: 'var(--font-sora)', color: '#1A120B', fontSize: '0.95rem' }}>
          Opening Academic Vault...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-cream)',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Glow Orbs */}
      <div className="glow-orb" style={{ top: '-10%', left: '-10%' }} />
      <div className="glow-orb" style={{ bottom: '-10%', right: '-10%', animationDelay: '5s' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Top Navbar */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '48px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--espresso-brown)' }}>
              <span style={{
                display: 'inline-flex',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#1A120B',
                color: '#D4AF37',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen size={16} />
              </span>
              CA Ranker <em style={{ fontStyle: 'normal', color: '#D4AF37' }}>AI</em>
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{
              fontFamily: 'var(--font-sora)',
              fontSize: '0.9rem',
              color: 'var(--muted-brown)'
            }}>
              CA {user.examLevel} Aspirant
            </span>
            <button 
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'rgba(26, 18, 11, 0.05)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--espresso-brown)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sora)',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(26, 18, 11, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(26, 18, 11, 0.05)'}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {/* Welcome Section */}
        <section style={{ marginBottom: '40px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p style={{
              fontFamily: 'var(--font-sora)',
              color: '#D4AF37',
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px'
            }}>
              STUDENT VAULT OVERVIEW
            </p>
            <h2 style={{
              fontSize: '2.5rem',
              fontFamily: 'var(--font-sora)',
              color: 'var(--espresso-brown)',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '12px'
            }}>
              Welcome back, <span className="gradient-text-gold">{user.fullName}</span>.
            </h2>
            <p style={{ color: 'var(--muted-brown)', maxWidth: '600px' }}>
              Your consistency is compounding. Here are your real-time academic stats and daily missions. Keep pushing towards your target!
            </p>
          </motion.div>
        </section>

        {/* Metric Cards Grid */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {/* Card 1: Streak */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-card"
            style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'var(--muted-brown)', fontSize: '0.85rem', fontFamily: 'var(--font-sora)', fontWeight: 600 }}>
                DAILY STREAK
              </span>
              <span style={{ color: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '6px', borderRadius: '8px' }}>
                <Flame size={18} />
              </span>
            </div>
            <h3 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-sora)', color: 'var(--espresso-brown)', marginBottom: '4px' }}>
              {user.streak} <span style={{ fontSize: '1rem', color: 'var(--muted-brown)' }}>days</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-brown)' }}>
              Top 5% of CA Final aspirants
            </p>
          </motion.div>

          {/* Card 2: Today's Hours */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-card"
            style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'var(--muted-brown)', fontSize: '0.85rem', fontFamily: 'var(--font-sora)', fontWeight: 600 }}>
                TODAY'S STUDY
              </span>
              <span style={{ color: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '6px', borderRadius: '8px' }}>
                <Clock size={18} />
              </span>
            </div>
            <h3 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-sora)', color: 'var(--espresso-brown)', marginBottom: '4px' }}>
              0.0 <span style={{ fontSize: '1rem', color: 'var(--muted-brown)' }}>/ {user.dailyStudyGoal} hrs</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-brown)' }}>
              Daily goal progress: 0% complete
            </p>
          </motion.div>

          {/* Card 3: Target AIR */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-card"
            style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'var(--muted-brown)', fontSize: '0.85rem', fontFamily: 'var(--font-sora)', fontWeight: 600 }}>
                TARGET RANK
              </span>
              <span style={{ color: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '6px', borderRadius: '8px' }}>
                <Award size={18} />
              </span>
            </div>
            <h3 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-sora)', color: 'var(--espresso-brown)', marginBottom: '4px' }}>
              AIR &lt; {user.targetAIR}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-brown)' }}>
              ICAI Standard calibration active
            </p>
          </motion.div>
        </section>

        {/* Dashboard Main Workspace split */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '32px'
        }}>
          {/* Left panel: Pomodoro & Focus */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <motion.div 
              className="glass-card-gold" 
              style={{ padding: '32px' }}
            >
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontFamily: 'var(--font-sora)', color: 'var(--espresso-brown)', marginBottom: '16px' }}>
                <span style={{ color: '#D4AF37' }}><Brain size={20} /></span>
                Pomodoro Focus Vault
              </h3>
              <p style={{ color: 'var(--muted-brown)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Anchor your mind. Link active Pomodoro sessions to syllabus chapters to automatically update your study stats.
              </p>
              
              <div style={{
                textAlign: 'center',
                padding: '32px 0',
                backgroundColor: 'rgba(26, 18, 11, 0.03)',
                borderRadius: '16px',
                border: '1px dashed var(--border-light)',
                marginBottom: '24px'
              }}>
                <span style={{
                  fontSize: '3rem',
                  fontFamily: 'var(--font-sora)',
                  fontWeight: 300,
                  color: 'var(--espresso-brown)',
                  letterSpacing: '0.05em'
                }}>
                  25:00
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted-brown)', marginTop: '4px' }}>
                  FOCUS INTERVAL
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  flex: 2,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: 'var(--espresso-brown)',
                  color: 'var(--soft-white)',
                  border: 'none',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-sora)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}>
                  <Play size={16} fill="currentColor" />
                  Launch Focus Chamber
                </button>
                <button style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-light)',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-sora)',
                  color: 'var(--espresso-brown)',
                  cursor: 'pointer'
                }}>
                  Config
                </button>
              </div>
            </motion.div>

            {/* Daily tasks preview */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontFamily: 'var(--font-sora)', color: 'var(--espresso-brown)' }}>
                  <span style={{ color: '#D4AF37' }}><CheckSquare size={20} /></span>
                  Daily Syllabus Checklist
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>0/3 DONE</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(26,18,11,0.05)' }}>
                  <input type="checkbox" style={{ accentColor: '#D4AF37', width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--espresso-brown)' }}>Financial Reporting (FR) — Consolidation MCQs</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(26,18,11,0.05)' }}>
                  <input type="checkbox" style={{ accentColor: '#D4AF37', width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--espresso-brown)' }}>Audit — SA 500 Substantive Audit Evidence</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
                  <input type="checkbox" style={{ accentColor: '#D4AF37', width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--espresso-brown)' }}>Direct Tax (DT) — Read International Taxation Notes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right panel: AI Assistant & Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* AI Insights */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontFamily: 'var(--font-sora)', color: 'var(--espresso-brown)', marginBottom: '20px' }}>
                <span style={{ color: '#D4AF37' }}><Sparkles size={20} /></span>
                AI Mentor Recommendation
              </h3>
              
              <div style={{
                padding: '20px',
                backgroundColor: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--espresso-brown)', fontStyle: 'italic' }}>
                  "Urva, looking at historical ICAI data, DT international transfer pricing is heavily tested. I notice you haven't logged Pomodoro hours here yet. I recommend starting with a 25-minute MCQ session."
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1A120B',
                  color: '#D4AF37',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  AI
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--espresso-brown)', fontWeight: 600 }}>CA Mentor Bot</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-brown)' }}>Always Online</p>
                </div>
              </div>
            </div>

            {/* Performance Analytics Widget */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontFamily: 'var(--font-sora)', color: 'var(--espresso-brown)' }}>
                  <span style={{ color: '#D4AF37' }}><BarChart2 size={20} /></span>
                  Productivity Heatmap
                </h3>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>
                  <TrendingUp size={14} /> +12% this week
                </span>
              </div>
              
              {/* Dummy Heatmap */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '6px',
                marginBottom: '16px'
              }}>
                {[...Array(36)].map((_, i) => {
                  const intensity = [0.1, 0.3, 0.6, 0.9, 0.2, 0.7, 0.4][i % 7];
                  return (
                    <div 
                      key={i}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '4px',
                        backgroundColor: `rgba(212, 175, 55, ${intensity})`,
                        border: '1px solid rgba(212,175,55, 0.1)'
                      }}
                    />
                  );
                })}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted-brown)', textAlign: 'right' }}>
                Less active ░░▒▒▓▓ Highly active
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

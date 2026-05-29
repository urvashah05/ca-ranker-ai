import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, ArrowRight, Flame, Clock, Award, 
  ChevronRight, CheckCircle2, TrendingUp, Sparkles 
} from 'lucide-react';

const Landing = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [swapWord, setSwapWord] = useState('Give Exams');
  const [isStuck, setIsStuck] = useState(false);

  // Swap text words in hero
  useEffect(() => {
    const words = ['Track Progress', 'Improve Daily', 'Crack AIR'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % words.length;
      setSwapWord(words[index]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle stuck nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsStuck(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', color: 'var(--espresso-brown)', minHeight: '100vh' }}>
      
      {/* HEADER NAV */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        backgroundColor: '#FFFDF8',
        borderBottom: '1px solid rgba(44, 26, 18, 0.08)',
        boxShadow: isStuck ? '0 4px 24px rgba(44, 26, 18, 0.06)' : 'none',
        transition: 'var(--transition-fast)'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--espresso-brown)', fontWeight: 800, fontSize: '1.2rem' }}>
            <span style={{
              display: 'inline-flex',
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#1A120B',
              color: '#D4AF37',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={14} />
            </span>
            CA Ranker <em style={{ fontStyle: 'normal', color: '#D4AF37' }}>AI</em>
          </Link>

          <nav style={{ display: 'flex', gap: '24px' }}>
            <a href="#features" style={{ textDecoration: 'none', color: 'var(--muted-brown)', fontSize: '0.9rem', fontWeight: 500 }}>Features</a>
            <a href="#how" style={{ textDecoration: 'none', color: 'var(--muted-brown)', fontSize: '0.9rem', fontWeight: 500 }}>How it works</a>
            <a href="#why" style={{ textDecoration: 'none', color: 'var(--muted-brown)', fontSize: '0.9rem', fontWeight: 500 }}>Why us</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/login" className="nav-login" style={{
              textDecoration: 'none',
              color: 'var(--muted-brown)',
              fontSize: '0.9rem',
              fontWeight: 600,
              padding: '8px 16px'
            }}>
              Log in
            </Link>
            <Link to="/signup" className="btn-primary-gold" style={{
              padding: '8px 20px',
              fontSize: '0.85rem',
              borderRadius: '8px'
            }}>
              Sign up free
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{
        padding: '160px 24px 100px 24px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        {/* Glow Orbs */}
        <div className="glow-orb" style={{ top: '-10%', left: '-10%' }} />
        <div className="glow-orb" style={{ bottom: '-10%', right: '-10%', animationDelay: '4s' }} />

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            color: 'var(--espresso-brown)',
            padding: '6px 18px',
            borderRadius: '50px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '32px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D4AF37' }}></span>
            AI-Powered · CA prep · ICAI calibrated
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--espresso-brown)',
            marginBottom: '24px',
            fontFamily: 'var(--font-serif)'
          }}>
            The smarter way to<br />
            <span style={{ color: '#D4AF37' }}>{swapWord}</span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--muted-brown)',
            maxWidth: '560px',
            margin: '0 auto 40px auto',
            lineHeight: 1.75
          }}>
            5 intelligent AI study modes, Pomodoro focus, ICAI-style exam simulation and progress analytics — built for every CA aspirant.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '64px' }}>
            <Link to="/signup" className="btn-primary-gold" style={{ padding: '14px 32px' }}>
              Get started free <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Link>
            <a href="#how" className="btn-secondary-espresso" style={{ padding: '14px 32px' }}>
              See how it works
            </a>
          </div>

          {/* Luxury Floating Metrics System */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            maxWidth: '720px',
            margin: '0 auto'
          }}>
            <div className="glass-card" style={{ padding: '20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#D4AF37', marginBottom: '8px' }}>
                <Clock size={16} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-sora)' }}>STUDY TODAY</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--espresso-brown)' }}>6.2 hrs</h3>
            </div>

            <div className="glass-card" style={{ padding: '20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#D4AF37', marginBottom: '8px' }}>
                <Award size={16} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-sora)' }}>MOCK SCORE</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--espresso-brown)' }}>78/100</h3>
            </div>

            <div className="glass-card" style={{ padding: '20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#D4AF37', marginBottom: '8px' }}>
                <Flame size={16} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-sora)' }}>STREAK</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--espresso-brown)' }}>14 days 🔥</h3>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" style={{ padding: '100px 24px', backgroundColor: '#FFFDF8' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="tag">Core Features</span>
            <h2 className="h2" style={{ marginTop: '10px' }}>Everything you need.<br />Nothing you don't.</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🧠</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--espresso-brown)' }}>5 AI Study Modes</h3>
              <p style={{ color: 'var(--muted-brown)', fontSize: '0.9rem' }}>
                Exam, Revision, Test, Doubt &amp; Mistake Analysis — each dynamically tuned to ICAI's evaluation methodology.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>⏱️</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--espresso-brown)' }}>Pomodoro Timer</h3>
              <p style={{ color: 'var(--muted-brown)', fontSize: '0.9rem' }}>
                Custom study &amp; break intervals, task linking per session, and automatic daily study hour logging.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📊</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--espresso-brown)' }}>Progress Analytics</h3>
              <p style={{ color: 'var(--muted-brown)', fontSize: '0.9rem' }}>
                Subject-wise charts, task type distribution, and weekly study hour trends in a gorgeous visual grid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US TABS SECTION */}
      <section id="why" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="tag">Why CA Ranker AI</span>
            <h2 className="h2" style={{ marginTop: '10px' }}>Built for one outcome: your rank.</h2>
          </div>

          <div style={{
            display: 'flex',
            gap: '8px',
            backgroundColor: '#FFFDF8',
            border: '1px solid rgba(44, 26, 18, 0.08)',
            borderRadius: '50px',
            padding: '6px',
            width: 'fit-content',
            margin: '0 auto 48px auto'
          }}>
            {['Study Smarter', 'Stay Consistent', 'Exam Ready'].map((tabName, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                style={{
                  background: activeTab === idx ? 'var(--espresso-brown)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: activeTab === idx ? '#FFFDF8' : 'var(--muted-brown)',
                  fontFamily: 'var(--font-sora)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  padding: '10px 24px',
                  borderRadius: '50px',
                  transition: 'var(--transition-fast)'
                }}
              >
                {tabName}
              </button>
            ))}
          </div>

          <div className="glass-card-gold" style={{ padding: '40px' }}>
            {activeTab === 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--espresso-brown)' }}>Think like an examiner</h3>
                  <p style={{ color: 'var(--muted-brown)', marginBottom: '24px' }}>
                    CA Ranker AI parses thousands of ICAI evaluation grids to ensure the AI grades your subjective answers exactly how a certified evaluator would.
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', fontWeight: 500 }}><CheckCircle2 size={18} style={{ color: '#D4AF37' }} /> Examiner-calibrated scoring</li>
                    <li style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', fontWeight: 500 }}><CheckCircle2 size={18} style={{ color: '#D4AF37' }} /> Instant evaluation and gap analysis</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: '#FFFDF8', padding: '24px', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted-brown)' }}>AI EVALUATION FEEDBACK</span>
                  <p style={{ fontStyle: 'italic', fontSize: '0.85rem', marginTop: '12px', color: 'var(--espresso-brown)' }}>
                    "Your answer captures the core provisions of Sec 149(6) of CA 2013, but lacks key ICAI terminology like 'pecuniary relationship'. Suggesting revision."
                  </p>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--espresso-brown)' }}>Never break the streak</h3>
                  <p style={{ color: 'var(--muted-brown)', marginBottom: '24px' }}>
                    Track study logs, build daily streaks, and stay accountable with interactive gamification dashboards designed for high-stress preparation environments.
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', fontWeight: 500 }}><CheckCircle2 size={18} style={{ color: '#D4AF37' }} /> Spaced repetition planning algorithms</li>
                    <li style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', fontWeight: 500 }}><CheckCircle2 size={18} style={{ color: '#D4AF37' }} /> Daily study hours lock &amp; streak tracking</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: '#FFFDF8', padding: '24px', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.25)', textAlign: 'center' }}>
                  <Flame size={32} style={{ color: '#D4AF37', margin: '0 auto 12px auto' }} />
                  <h4 style={{ fontSize: '1.8rem', color: 'var(--espresso-brown)' }}>14 Days</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted-brown)' }}>CURRENT STREAK 🔥</p>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--espresso-brown)' }}>Simulate real exam stress</h3>
                  <p style={{ color: 'var(--muted-brown)', marginBottom: '24px' }}>
                    Run full syllabus and topic-wise mock tests in an interface designed exactly like the physical exam setup, featuring live timer limits and auto grading.
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', fontWeight: 500 }}><CheckCircle2 size={18} style={{ color: '#D4AF37' }} /> True-to-life timer controls</li>
                    <li style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', fontWeight: 500 }}><CheckCircle2 size={18} style={{ color: '#D4AF37' }} /> Instant performance analytics</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: '#FFFDF8', padding: '24px', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.25)', textAlign: 'center' }}>
                  <Award size={32} style={{ color: '#D4AF37', margin: '0 auto 12px auto' }} />
                  <h4 style={{ fontSize: '1.8rem', color: 'var(--espresso-brown)' }}>78%</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted-brown)' }}>ESTIMATED PREPARATION READY INDEX</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        padding: '120px 24px',
        backgroundColor: '#1A120B',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        color: '#FFFDF8'
      }}>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '640px', margin: '0 auto' }}>
          <span style={{ color: 'rgba(212, 175, 55, 0.6)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            START TODAY. RANK TOMORROW.
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: '16px 0', color: '#FFFDF8' }}>
            Your AIR journey starts now.
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '40px', fontSize: '0.95rem' }}>
            Join thousands of CA aspirants who are unlocking dynamic study schedules, mock evaluations, and analytics metrics today.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/signup" className="btn-primary-gold" style={{ padding: '14px 32px' }}>
              Create free account
            </Link>
            <Link to="/login" className="btn-secondary-espresso" style={{
              padding: '14px 32px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#FFFDF8'
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: '#1A120B',
        color: 'rgba(255, 255, 255, 0.45)',
        padding: '40px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        fontSize: '0.85rem'
      }}>
        <p>© 2026 CA Ranker AI · Built for Chartered Accountancy aspirants.</p>
      </footer>

    </div>
  );
};

export default Landing;

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, API } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  LogOut, Flame, Clock, Award, BookOpen, 
  Brain, BarChart2, Play, Pause, RotateCcw, 
  CheckSquare, Plus, Trash2, Sparkles, TrendingUp 
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Dashboard stats loaded from profile updates
  const [totalStudyHours, setTotalStudyHours] = useState(user?.totalStudyHours || 0);
  const [streak, setStreak] = useState(user?.streak || 0);

  // --- TASK CHECKLIST STATE ---
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('General');
  const [tasksLoading, setTasksLoading] = useState(true);

  // --- POMODORO TIMER STATE ---
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [pomoSubject, setPomoSubject] = useState('General');
  const [initialMinutes, setInitialMinutes] = useState(25);
  const timerRef = useRef(null);

  // --- ANALYTICS STATE ---
  const [analyticsData, setAnalyticsData] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    if (user) {
      setTotalStudyHours(user.totalStudyHours);
      setStreak(user.streak);
      fetchTasks();
      fetchAnalytics();
    }
  }, [user]);

  // Fetch Tasks from API
  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      if (data.success) {
        setTasks(data.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setTasksLoading(false);
    }
  };

  // Fetch Analytics from API
  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get('/sessions/analytics');
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // --- TASK OPERATIONS ---
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const { data } = await API.post('/tasks', {
        title: taskTitle,
        subject: taskSubject
      });
      if (data.success) {
        setTasks([data.data, ...tasks]);
        setTaskTitle('');
      }
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const { data } = await API.put(`/tasks/${taskId}`);
      if (data.success) {
        setTasks(tasks.map(t => t._id === taskId ? { ...t, completed: data.data.completed } : t));
      }
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const { data } = await API.delete(`/tasks/${taskId}`);
      if (data.success) {
        setTasks(tasks.filter(t => t._id !== taskId));
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // --- POMODORO TIMER CORE ---
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished!
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, minutes, seconds]);

  // Synthesize a gorgeous ambient golden bell sound via Web Audio API
  const playGoldChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High A pitch
      
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.error('Web Audio not supported or blocked:', e);
    }
  };

  const handleTimerComplete = async () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    playGoldChime();

    try {
      const { data } = await API.post('/sessions', {
        duration: initialMinutes,
        subject: pomoSubject
      });

      if (data.success) {
        // Increment frontend total study hours and streaks
        const hoursAdded = Number((initialMinutes / 60).toFixed(1));
        setTotalStudyHours(prev => Number((prev + hoursAdded).toFixed(1)));
        setStreak(prev => prev === 0 ? 1 : prev + 1);

        alert(`Congratulations! You completed ${initialMinutes} minutes of focus in ${pomoSubject}! Logged successfully.`);
        fetchAnalytics(); // reload graph statistics
      }
    } catch (err) {
      console.error('Error logging focus session:', err);
    } finally {
      setMinutes(initialMinutes);
      setSeconds(0);
    }
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setMinutes(initialMinutes);
    setSeconds(0);
  };

  const handleModeChange = (mins) => {
    setIsActive(false);
    setInitialMinutes(mins);
    setMinutes(mins);
    setSeconds(0);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
              CA {user?.examLevel} Aspirant
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
              Welcome back, <span className="gradient-text-gold">{user?.fullName}</span>.
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
            <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'var(--muted-brown)', fontSize: '0.85rem', fontFamily: 'var(--font-sora)', fontWeight: 600 }}>
                DAILY STREAK
              </span>
              <span style={{ color: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '6px', borderRadius: '8px', marginLeft: 'auto' }}>
                <Flame size={18} />
              </span>
            </div>
            <h3 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-sora)', color: 'var(--espresso-brown)', marginBottom: '4px' }}>
              {streak} <span style={{ fontSize: '1rem', color: 'var(--muted-brown)' }}>days</span>
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
            <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'var(--muted-brown)', fontSize: '0.85rem', fontFamily: 'var(--font-sora)', fontWeight: 600 }}>
                TOTAL LOGGED HOURS
              </span>
              <span style={{ color: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '6px', borderRadius: '8px', marginLeft: 'auto' }}>
                <Clock size={18} />
              </span>
            </div>
            <h3 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-sora)', color: 'var(--espresso-brown)', marginBottom: '4px' }}>
              {totalStudyHours} <span style={{ fontSize: '1rem', color: 'var(--muted-brown)' }}>hrs</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-brown)' }}>
              Your study goal is {user?.dailyStudyGoal} hrs/day
            </p>
          </motion.div>

          {/* Card 3: Target AIR */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-card"
            style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'var(--muted-brown)', fontSize: '0.85rem', fontFamily: 'var(--font-sora)', fontWeight: 600 }}>
                TARGET RANK
              </span>
              <span style={{ color: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '6px', borderRadius: '8px', marginLeft: 'auto' }}>
                <Award size={18} />
              </span>
            </div>
            <h3 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-sora)', color: 'var(--espresso-brown)', marginBottom: '4px' }}>
              AIR &lt; {user?.targetAIR}
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
              
              {/* Pomodoro controls select mode */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {[[25, 'Focus'], [5, 'Short Break'], [15, 'Long Break']].map(([mins, lbl]) => (
                  <button
                    key={mins}
                    onClick={() => handleModeChange(mins)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: initialMinutes === mins ? 'var(--espresso-brown)' : 'transparent',
                      color: initialMinutes === mins ? '#FFFDF8' : 'var(--muted-brown)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-sora)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              {/* Subject selector */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-brown)', fontFamily: 'var(--font-sora)' }}>
                  ACTIVE SUBJECT:
                </label>
                <select
                  value={pomoSubject}
                  onChange={(e) => setPomoSubject(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: 'rgba(255, 253, 248, 0.9)',
                    fontFamily: 'var(--font-sora)',
                    fontSize: '0.85rem',
                    color: 'var(--espresso-brown)'
                  }}
                >
                  <option value="FR">Financial Reporting (FR)</option>
                  <option value="Audit">Advanced Auditing (Audit)</option>
                  <option value="DT">Direct Tax (DT)</option>
                  <option value="IDT">Indirect Tax (IDT)</option>
                  <option value="AFM">Advanced Financial Mgmt (AFM)</option>
                  <option value="SCMPE">Strategic Cost Mgmt (SCMPE)</option>
                  <option value="General">General / Other</option>
                </select>
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '32px 0',
                backgroundColor: 'rgba(26, 18, 11, 0.03)',
                borderRadius: '16px',
                border: '1px dashed var(--border-light)',
                marginBottom: '24px'
              }}>
                <span style={{
                  fontSize: '3.6rem',
                  fontFamily: 'var(--font-sora)',
                  fontWeight: 300,
                  color: 'var(--espresso-brown)',
                  letterSpacing: '0.05em'
                }}>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted-brown)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {isActive ? 'focusing Chamber Active' : 'chamber standby'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={handleStartPause}
                  style={{
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
                  }}
                >
                  {isActive ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                  {isActive ? 'Pause Chamber' : 'Launch Focus Chamber'}
                </button>
                <button 
                  onClick={handleReset}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-light)',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-sora)',
                    color: 'var(--espresso-brown)',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </motion.div>

            {/* Daily Checklist Widget */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontFamily: 'var(--font-sora)', color: 'var(--espresso-brown)' }}>
                  <span style={{ color: '#D4AF37' }}><CheckSquare size={20} /></span>
                  Daily Syllabus Checklist
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>
                  {tasks.filter(t => t.completed).length}/{tasks.length} DONE
                </span>
              </div>

              {/* Add Task Form */}
              <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Add a syllabus topic to study..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  style={{
                    flex: 2,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: 'rgba(255, 253, 248, 0.8)',
                    fontSize: '0.9rem',
                    color: 'var(--espresso-brown)',
                    outline: 'none'
                  }}
                />
                <select
                  value={taskSubject}
                  onChange={(e) => setTaskSubject(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: 'rgba(255, 253, 248, 0.8)',
                    fontFamily: 'var(--font-sora)',
                    fontSize: '0.8rem',
                    color: 'var(--espresso-brown)'
                  }}
                >
                  <option value="General">Gen</option>
                  <option value="FR">FR</option>
                  <option value="Audit">Audit</option>
                  <option value="DT">DT</option>
                  <option value="IDT">IDT</option>
                  <option value="AFM">AFM</option>
                  <option value="SCMPE">SCMPE</option>
                </select>
                <button
                  type="submit"
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#FFFDF8',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Plus size={16} />
                </button>
              </form>

              {/* Task list list */}
              {tasksLoading ? (
                <div style={{ textAlign: 'center', color: 'var(--muted-brown)', fontSize: '0.9rem', padding: '10px 0' }}>
                  Loading checklist...
                </div>
              ) : tasks.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--muted-brown)', fontSize: '0.85rem', padding: '20px 0', border: '1px dashed var(--border-light)', borderRadius: '12px' }}>
                  No syllabus items added. Start planning!
                </div>
              ) : (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                  {tasks.map(t => (
                    <motion.li 
                      key={t._id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '12px 14px', 
                        backgroundColor: t.completed ? 'rgba(26,18,11,0.02)' : 'rgba(255,253,248,0.9)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <input 
                          type="checkbox" 
                          checked={t.completed}
                          onChange={() => handleToggleTask(t._id)}
                          style={{ accentColor: '#D4AF37', width: '16px', height: '16px', cursor: 'pointer' }} 
                        />
                        <span style={{ 
                          fontSize: '0.9rem', 
                          color: 'var(--espresso-brown)',
                          textDecoration: t.completed ? 'line-through' : 'none',
                          opacity: t.completed ? 0.5 : 1
                        }}>
                          <span style={{
                            display: 'inline-block',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(212, 175, 55, 0.1)',
                            color: '#C89B2C',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            marginRight: '8px'
                          }}>
                            {t.subject}
                          </span>
                          {t.title}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(t._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(26,18,11,0.3)',
                          cursor: 'pointer',
                          transition: 'var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#bf4343'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(26,18,11,0.3)'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right panel: AI Assistant & Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Recharts Analytics Panel */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontFamily: 'var(--font-sora)', color: 'var(--espresso-brown)' }}>
                  <span style={{ color: '#D4AF37' }}><BarChart2 size={20} /></span>
                  Focus Hour Distribution
                </h3>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>
                  <TrendingUp size={14} /> live statistics
                </span>
              </div>

              {/* Render dynamic BarChart */}
              {analyticsLoading ? (
                <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-brown)', fontSize: '0.9rem' }}>
                  Loading analytics...
                </div>
              ) : analyticsData.length === 0 || analyticsData.every(d => d.hours === 0) ? (
                <div style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-light)', borderRadius: '12px', padding: '16px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted-brown)', textAlign: 'center', marginBottom: '8px' }}>
                    No focus sessions logged yet.
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-brown)', textAlign: 'center' }}>
                    Log completed Pomodoros to automatically draw dynamic visual bars!
                  </p>
                </div>
              ) : (
                <div style={{ width: '100%', height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis 
                        dataKey="name" 
                        stroke="var(--muted-brown)" 
                        fontSize={10} 
                        tickLine={false} 
                      />
                      <YAxis 
                        stroke="var(--muted-brown)" 
                        fontSize={10} 
                        tickLine={false} 
                        allowDecimals={true}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFDF8', 
                          border: '1px solid var(--border-gold)',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: 'var(--espresso-brown)',
                          fontFamily: 'var(--font-sora)'
                        }} 
                      />
                      <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                        {analyticsData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index % 2 === 0 ? 'var(--accent-gold)' : 'var(--espresso-brown)'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* AI Insights Section */}
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
                  "Hello {user?.fullName}, looking at historical ICAI exam models, transfer pricing in DT and corporate audits are heavily tested. I recommend using the focus timer for a 25-minute study block in those areas today."
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
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-brown)' }}>Syllabus Optimizer active</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

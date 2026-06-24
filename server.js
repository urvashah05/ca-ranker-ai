/**
 * server.js — CA Ranker AI
 * Serves the frontend + backend API on a single port (3000)
 */

const express = require('express')
const path    = require('path')
const fs      = require('fs')
const jwt     = require('jsonwebtoken')
const bcrypt  = require('bcryptjs')

const app  = express()
const PORT = process.env.PORT || 3000
const JWT_SECRET = 'ca_ranker_ai_luxury_academic_key_2026'
const DATA_FILE  = path.join(__dirname, 'data', 'users.json')

// ── MIDDLEWARE ────────────────────────────────────────────────
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// ── JSON FILE DB HELPERS ──────────────────────────────────────
function getUsers() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) { fs.writeFileSync(DATA_FILE, '[]'); return [] }
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || '[]') } catch { return [] }
}
function saveUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2))
}
function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' })
}

// ── AUTH MIDDLEWARE ───────────────────────────────────────────
function protect(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized' })
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Token invalid' })
  }
}

// ── API: SIGNUP ───────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password, examLevel, targetAIR, dailyStudyGoal } = req.body
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all fields' })
    }
    const users = getUsers()
    if (users.find(u => u.email === email.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = {
      _id: 'u_' + Date.now(),
      fullName,
      email: email.toLowerCase(),
      password: hashed,
      examLevel: examLevel || 'Final',
      targetAIR: Number(targetAIR) || 100,
      dailyStudyGoal: Number(dailyStudyGoal) || 6,
      streak: 0,
      totalStudyHours: 0,
      createdAt: new Date().toISOString()
    }
    users.push(user)
    saveUsers(users)
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, fullName: user.fullName, email: user.email, examLevel: user.examLevel, targetAIR: user.targetAIR, dailyStudyGoal: user.dailyStudyGoal, streak: user.streak, totalStudyHours: user.totalStudyHours }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── API: LOGIN ────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all fields' })
    }
    const users = getUsers()
    const user = users.find(u => u.email === email.toLowerCase())
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }
    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, fullName: user.fullName, email: user.email, examLevel: user.examLevel, targetAIR: user.targetAIR, dailyStudyGoal: user.dailyStudyGoal, streak: user.streak, totalStudyHours: user.totalStudyHours }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── API: GET PROFILE ──────────────────────────────────────────
app.get('/api/auth/profile', protect, (req, res) => {
  const users = getUsers()
  const user = users.find(u => u._id === req.userId)
  if (!user) return res.status(404).json({ success: false, message: 'User not found' })
  res.json({
    success: true,
    user: { id: user._id, fullName: user.fullName, email: user.email, examLevel: user.examLevel, targetAIR: user.targetAIR, dailyStudyGoal: user.dailyStudyGoal, streak: user.streak, totalStudyHours: user.totalStudyHours }
  })
})

// ── FRONTEND ROUTES ───────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'))
})
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'admin.html'))
})
app.get('/pages/:page', (req, res) => {
  const file = path.join(__dirname, 'public', 'pages', req.params.page)
  res.sendFile(file, err => {
    if (err) res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'))
  })
})

// ── START ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  CA Ranker AI  →  http://localhost:${PORT}\n`)
})

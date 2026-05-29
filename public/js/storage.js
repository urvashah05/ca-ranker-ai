/**
 * storage.js — Complete data engine for CA Ranker AI
 * ALL localStorage access goes through here. No direct calls elsewhere.
 */

const KEYS = {
  USER:      'caranker_user',
  SESSION:   'caranker_session',
  PROGRESS:  'caranker_progress',
  STUDYLOG:  'caranker_studylog',
  MOCKHIST:  'caranker_mockhistory',
  POMOSETTS: 'caranker_pomosettings',
  TASKS:     'caranker_tasks',
}

// ─── SUBJECTS ────────────────────────────────────────────────
export const SUBJECT_DATA = {
  'CA Final': [
    // Group I
    { id: 'FR',   name: 'Financial Reporting (FR)',                          group: 'Group I',  paper: 'Paper 1', total: 55 },
    { id: 'AFM',  name: 'Advanced Financial Management (AFM)',               group: 'Group I',  paper: 'Paper 2', total: 50 },
    { id: 'AAAE', name: 'Adv. Auditing, Assurance & Professional Ethics',    group: 'Group I',  paper: 'Paper 3', total: 45 },
    // Group II
    { id: 'DT',   name: 'Direct Tax Laws & International Taxation',          group: 'Group II', paper: 'Paper 4', total: 60 },
    { id: 'IDT',  name: 'Indirect Tax Laws (GST, Customs & FTP)',            group: 'Group II', paper: 'Paper 5', total: 55 },
    { id: 'IBS',  name: 'Integrated Business Solutions (Case Study)',        group: 'Group II', paper: 'Paper 6', total: 40 },
  ],
  'CA Inter': [
    // Group I
    { id: 'AdvAcc',  name: 'Advanced Accounting',                            group: 'Group I',  paper: 'Paper 1', total: 45 },
    { id: 'CorpLaw', name: 'Corporate & Other Laws',                         group: 'Group I',  paper: 'Paper 2', total: 38 },
    { id: 'Tax',     name: 'Taxation (Income Tax & GST)',                    group: 'Group I',  paper: 'Paper 3', total: 55 },
    // Group II
    { id: 'CMA',     name: 'Cost & Management Accounting',                   group: 'Group II', paper: 'Paper 4', total: 40 },
    { id: 'Audit',   name: 'Auditing & Ethics',                              group: 'Group II', paper: 'Paper 5', total: 35 },
    { id: 'FMSM',    name: 'Financial Management & Strategic Management',    group: 'Group II', paper: 'Paper 6', total: 42 },
  ],
  'Foundation': [
    { id: 'PPA',     name: 'Principles & Practice of Accounting',            group: '',  paper: 'Paper 1', total: 30 },
    { id: 'BizLaw',  name: 'Business Laws',                                  group: '',  paper: 'Paper 2', total: 25 },
    { id: 'QA',      name: 'Quantitative Aptitude (Maths, LR & Stats)',      group: '',  paper: 'Paper 3', total: 35 },
    { id: 'BizEcon', name: 'Business Economics',                             group: '',  paper: 'Paper 4', total: 28 },
  ],
  'Other': [
    { id: 'S1', name: 'Subject 1', group: '', paper: '', total: 30 },
    { id: 'S2', name: 'Subject 2', group: '', paper: '', total: 30 },
    { id: 'S3', name: 'Subject 3', group: '', paper: '', total: 30 },
  ],
}

export function getSubjectsForGoal(goal) {
  return SUBJECT_DATA[goal] || SUBJECT_DATA['Other']
}

// ─── HELPERS ─────────────────────────────────────────────────
function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}
function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

// ─── USER ─────────────────────────────────────────────────────
export function saveUser(user) { save(KEYS.USER, user) }
export function getUser() { return load(KEYS.USER) }

// ─── SESSION ──────────────────────────────────────────────────
export function setSession() {
  const user = getUser()
  save(KEYS.SESSION, { isLoggedIn: true, loginAt: new Date().toISOString(), name: user?.name })
}
export function getSession() { return load(KEYS.SESSION) }
export function isLoggedIn() { const s = getSession(); return !!(s && s.isLoggedIn) }
export function logout() {
  localStorage.removeItem(KEYS.SESSION)
  window.location.href = '/pages/login.html'
}

// ─── PROGRESS ─────────────────────────────────────────────────
export function getProgress(subjectId) {
  const all = load(KEYS.PROGRESS) || {}
  return all[subjectId] || { topicsCovered: 0, hours: 0, lastStudied: null }
}
export function getAllProgress() { return load(KEYS.PROGRESS) || {} }

export function saveProgress(subjectId, delta) {
  const all = load(KEYS.PROGRESS) || {}
  const cur = all[subjectId] || { topicsCovered: 0, hours: 0, lastStudied: null }
  all[subjectId] = {
    topicsCovered: Math.min(cur.topicsCovered + (delta.topicsCovered || 0), delta.totalTopics || 999),
    hours: parseFloat((cur.hours + (delta.hours || 0)).toFixed(1)),
    lastStudied: new Date().toISOString(),
  }
  save(KEYS.PROGRESS, all)
  // Also log study hours
  if (delta.hours > 0) logStudyHours(new Date().toISOString().split('T')[0], delta.hours, subjectId)
}

export function getCoveragePercent(subjectId, totalTopics) {
  const p = getProgress(subjectId)
  if (!totalTopics) return 0
  return Math.min(100, Math.round((p.topicsCovered / totalTopics) * 100))
}

export function getAvgCoverage(goal) {
  const subjects = getSubjectsForGoal(goal)
  if (!subjects.length) return 0
  const total = subjects.reduce((sum, s) => sum + getCoveragePercent(s.id, s.total), 0)
  return Math.round(total / subjects.length)
}

export function getWeakAreas(goal) {
  const subjects = getSubjectsForGoal(goal)
  return subjects.filter(s => getCoveragePercent(s.id, s.total) < 30)
}

export function resetProgress() {
  localStorage.removeItem(KEYS.PROGRESS)
  localStorage.removeItem(KEYS.STUDYLOG)
  localStorage.removeItem(KEYS.MOCKHIST)
  localStorage.removeItem(KEYS.TASKS)
}

// ─── STUDY LOG ────────────────────────────────────────────────
export function logStudyHours(date, hours, subject) {
  const log = load(KEYS.STUDYLOG) || {}
  if (!log[date]) log[date] = { hours: 0, sessions: 0, subjects: [] }
  log[date].hours = parseFloat((log[date].hours + hours).toFixed(1))
  log[date].sessions += 1
  if (subject && !log[date].subjects.includes(subject)) log[date].subjects.push(subject)
  save(KEYS.STUDYLOG, log)
}

export function getStudyLog(date) {
  const log = load(KEYS.STUDYLOG) || {}
  return log[date] || { hours: 0, sessions: 0, subjects: [] }
}

export function getTodayHours() {
  return getStudyLog(new Date().toISOString().split('T')[0]).hours
}

export function getWeeklyHours() {
  const log = load(KEYS.STUDYLOG) || {}
  const result = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    result.push(log[key]?.hours || 0)
  }
  return result // [Mon, Tue, Wed, Thu, Fri, Sat, Sun] relative to today
}

export function calculateStreak() {
  const log = load(KEYS.STUDYLOG) || {}
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    if (log[key] && log[key].hours > 0) streak++
    else if (i > 0) break
  }
  return streak
}

// ─── MOCK TESTS ───────────────────────────────────────────────
export function saveMockResult(result) {
  const hist = load(KEYS.MOCKHIST) || []
  hist.unshift({ ...result, date: new Date().toISOString() })
  save(KEYS.MOCKHIST, hist)
}
export function getMockHistory() { return load(KEYS.MOCKHIST) || [] }
export function getBestMockScore() {
  const hist = getMockHistory()
  if (!hist.length) return null
  return hist.reduce((best, r) => r.percentage > (best?.percentage || 0) ? r : best, null)
}
export function getRecentMocks(n = 5) { return getMockHistory().slice(0, n) }

// ─── POMODORO SETTINGS ────────────────────────────────────────
const POMO_DEFAULTS = { focusDuration: 25, shortBreak: 5, longBreak: 15, longBreakAfter: 4 }
export function savePomoSettings(s) { save(KEYS.POMOSETTS, { ...POMO_DEFAULTS, ...s }) }
export function getPomoSettings() { return { ...POMO_DEFAULTS, ...(load(KEYS.POMOSETTS) || {}) } }

// ─── TASKS ────────────────────────────────────────────────────
export function getTasks() { return load(KEYS.TASKS) || [] }
export function addTask(task) {
  const tasks = getTasks()
  tasks.unshift({ id: Date.now(), done: false, createdAt: new Date().toISOString(), ...task })
  save(KEYS.TASKS, tasks)
}
export function toggleTask(id) {
  const tasks = getTasks().map(t => t.id === id ? { ...t, done: !t.done } : t)
  save(KEYS.TASKS, tasks)
}
export function deleteTask(id) {
  save(KEYS.TASKS, getTasks().filter(t => t.id !== id))
}

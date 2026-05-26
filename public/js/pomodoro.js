import { getPomoSettings, savePomoSettings, logStudyHours, getSubjectsForGoal } from '/js/storage.js'

let state = {
  mode: 'focus',
  timeLeft: 0,
  isRunning: false,
  sessionCount: 0,
  interval: null,
  totalTime: 0,
  subject: '',
  topic: '',
}

let settings = getPomoSettings()

export function initPomodoro(goal) {
  settings = getPomoSettings()
  state.timeLeft = settings.focusDuration * 60
  state.totalTime = settings.focusDuration * 60

  renderSubjectOptions(goal)
  renderDurationPills()
  updateDisplay()
  updateRing()
  renderSessionDots()

  document.getElementById('pomoStart')?.addEventListener('click', startTimer)
  document.getElementById('pomoPause')?.addEventListener('click', pauseTimer)
  document.getElementById('pomoReset')?.addEventListener('click', resetTimer)
  document.getElementById('pomoSkip')?.addEventListener('click',  skipSession)

  document.getElementById('pomoSubject')?.addEventListener('change', e => { state.subject = e.target.value })
  document.getElementById('pomoTopic')?.addEventListener('input',  e => { state.topic = e.target.value })
}

function renderSubjectOptions(goal) {
  const sel = document.getElementById('pomoSubject')
  if (!sel) return
  const subjects = getSubjectsForGoal(goal)
  sel.innerHTML = `<option value="">Select subject</option>` +
    subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')
}

function renderDurationPills() {
  const focusPills = [15, 20, 25, 30, 45, 60]
  const shortPills = [5, 10, 15]
  const longPills  = [15, 20, 30]

  renderPills('focusPills',  focusPills, settings.focusDuration, v => {
    settings.focusDuration = v; savePomoSettings(settings)
    if (state.mode === 'focus' && !state.isRunning) { state.timeLeft = v * 60; state.totalTime = v * 60; updateDisplay(); updateRing() }
  })
  renderPills('shortPills', shortPills, settings.shortBreak, v => {
    settings.shortBreak = v; savePomoSettings(settings)
    if (state.mode === 'shortBreak' && !state.isRunning) { state.timeLeft = v * 60; state.totalTime = v * 60; updateDisplay(); updateRing() }
  })
  renderPills('longPills', longPills, settings.longBreak, v => {
    settings.longBreak = v; savePomoSettings(settings)
    if (state.mode === 'longBreak' && !state.isRunning) { state.timeLeft = v * 60; state.totalTime = v * 60; updateDisplay(); updateRing() }
  })
}

function renderPills(containerId, values, active, onChange) {
  const el = document.getElementById(containerId)
  if (!el) return
  el.innerHTML = values.map(v => `
    <button class="pomo-pill ${v === active ? 'active' : ''}" data-val="${v}">${v}m</button>
  `).join('')
  el.querySelectorAll('.pomo-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.pomo-pill').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      onChange(+btn.dataset.val)
    })
  })
}

function startTimer() {
  if (state.isRunning) return
  state.isRunning = true
  document.getElementById('pomoStart').style.display = 'none'
  document.getElementById('pomoPause').style.display = 'inline-flex'
  state.interval = setInterval(tick, 1000)
}

function pauseTimer() {
  state.isRunning = false
  clearInterval(state.interval)
  document.getElementById('pomoStart').style.display = 'inline-flex'
  document.getElementById('pomoPause').style.display = 'none'
}

function resetTimer() {
  pauseTimer()
  state.timeLeft = getDuration(state.mode) * 60
  state.totalTime = state.timeLeft
  updateDisplay()
  updateRing()
}

function skipSession() {
  pauseTimer()
  onSessionEnd()
}

function tick() {
  state.timeLeft--
  updateDisplay()
  updateRing()
  if (state.timeLeft <= 0) onSessionEnd()
}

function onSessionEnd() {
  pauseTimer()
  if (state.mode === 'focus') {
    state.sessionCount++
    logStudyHours(
      new Date().toISOString().split('T')[0],
      getDuration('focus') / 60,
      state.subject || 'General'
    )
    addSessionLog()
    document.dispatchEvent(new CustomEvent('studySessionLogged'))
    notify('Focus session complete! Time for a break.')
    if (state.sessionCount % settings.longBreakAfter === 0) switchMode('longBreak')
    else switchMode('shortBreak')
  } else {
    notify('Break over! Back to studying.')
    switchMode('focus')
  }
  renderSessionDots()
  startTimer()
}

function switchMode(mode) {
  state.mode = mode
  state.timeLeft = getDuration(mode) * 60
  state.totalTime = state.timeLeft
  updateDisplay()
  updateRing()
  document.querySelectorAll('.pomo-mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode)
  })
}

function getDuration(mode) {
  if (mode === 'focus')      return settings.focusDuration
  if (mode === 'shortBreak') return settings.shortBreak
  return settings.longBreak
}

function updateDisplay() {
  const m = String(Math.floor(state.timeLeft / 60)).padStart(2, '0')
  const s = String(state.timeLeft % 60).padStart(2, '0')
  const timeEl = document.getElementById('pomoTime')
  const modeEl = document.getElementById('pomoMode')
  if (timeEl) timeEl.textContent = `${m}:${s}`
  if (modeEl) modeEl.textContent = state.mode === 'focus' ? 'Focus Session' : state.mode === 'shortBreak' ? 'Short Break' : 'Long Break'
}

function updateRing() {
  const arc = document.getElementById('pomoArc')
  if (!arc) return
  const r = 90
  const circ = 2 * Math.PI * r
  const pct = state.totalTime > 0 ? state.timeLeft / state.totalTime : 1
  arc.style.strokeDasharray = circ
  arc.style.strokeDashoffset = circ * (1 - pct)
}

function renderSessionDots() {
  const el = document.getElementById('sessionDots')
  if (!el) return
  const total = settings.longBreakAfter
  const done  = state.sessionCount % total
  el.innerHTML = Array.from({ length: total }, (_, i) =>
    `<span class="session-dot ${i < done ? 'done' : ''}"></span>`
  ).join('')
}

function addSessionLog() {
  const el = document.getElementById('pomoLog')
  if (!el) return
  const now = new Date()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const subj = state.subject || 'General'
  const topic = state.topic || '—'
  const mins = getDuration('focus')
  const entry = document.createElement('div')
  entry.className = 'pomo-log-entry'
  entry.innerHTML = `<span class="pomo-log-icon">📚</span> <strong>${subj}</strong> — ${topic} · ${mins} min · ${time}`
  el.prepend(entry)
}

function notify(msg) {
  if (Notification.permission === 'granted') {
    new Notification('CA Ranker AI', { body: msg })
  }
}

export function requestNotificationPermission() {
  if (Notification.permission === 'default') Notification.requestPermission()
}

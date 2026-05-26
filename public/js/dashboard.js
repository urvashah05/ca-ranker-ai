import { getUser, getSession, logout, getTodayHours, calculateStreak, getBestMockScore, getWeakAreas, getSubjectsForGoal, getCoveragePercent, getAvgCoverage, getWeeklyHours } from '/js/storage.js'

// ── INIT ──────────────────────────────────────────────────────
function init() {
  const user = getUser()
  const session = getSession()
  if (!user || !session) return

  const firstName = user.name.split(' ')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  setText('dbGreeting', greeting)
  setText('dbWelcome', `Welcome back, ${firstName} 👋`)
  setText('dbSubtitle', 'Your AIR journey continues.')
  setText('dbGoalBadge', user.goal || 'CA Final')

  // Avatar initials
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  document.querySelectorAll('.db-avatar-text').forEach(el => el.textContent = initials)

  // AIR ring label
  const goal = user.goal || 'CA Final'
  if (goal === 'CA Final')   { setText('dbAirSub', '< 100'); setText('dbAirGoal', 'CA Final 2025') }
  else if (goal === 'CA Inter') { setText('dbAirSub', '< 50'); setText('dbAirGoal', 'CA Inter') }
  else { setText('dbAirSub', 'Keep Improving'); setText('dbAirGoal', goal) }

  // Stats
  updateStats(user.goal)

  // Subjects
  buildSubjects(user.goal)

  // Weekly chart
  buildWeeklyChart()

  // AIR ring animate
  setTimeout(() => {
    const wrap = document.getElementById('dbAirWrap')
    if (wrap) wrap.classList.add('db-animated')
  }, 400)

  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll('.db-prog-fill').forEach(el => {
      el.style.width = el.dataset.pct + '%'
    })
  }, 700)
}

function updateStats(goal) {
  const todayHrs = getTodayHours()
  const streak   = calculateStreak()
  const best     = getBestMockScore()
  const weak     = getWeakAreas(goal)

  // Update stat cards
  const cards = document.querySelectorAll('.db-stat-card')
  if (cards[0]) cards[0].querySelector('.db-stat-val').innerHTML = `${todayHrs} <span class="db-stat-unit">hrs</span>`
  if (cards[1]) cards[1].querySelector('.db-stat-val').innerHTML = `${streak} <span class="db-stat-unit">days 🔥</span>`
  if (cards[2]) cards[2].querySelector('.db-stat-val').innerHTML = best ? `${best.score} <span class="db-stat-unit">/ ${best.total}</span>` : `-- <span class="db-stat-unit">/ 100</span>`
  if (cards[3]) cards[3].querySelector('.db-stat-val').innerHTML = `${weak.length} <span class="db-stat-unit">topics</span>`
}

function buildSubjects(goal) {
  const subjects = getSubjectsForGoal(goal)
  const grid = document.getElementById('dbSubjectsGrid')
  if (!grid) return
  grid.innerHTML = subjects.map(s => {
    const pct = getCoveragePercent(s.id, s.total)
    return `
      <div class="db-prog-row">
        <span class="db-prog-name">${s.name}</span>
        <div class="db-prog-track">
          <div class="db-prog-fill" data-pct="${pct}" style="width:0%"></div>
        </div>
        <span class="db-prog-pct">${pct}%</span>
      </div>`
  }).join('')
}

function buildWeeklyChart() {
  const hours = getWeeklyHours()
  const days  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const todayIdx = (new Date().getDay() + 6) % 7
  const max = Math.max(...hours, 1)
  const chart = document.getElementById('dbWeeklyChart')
  if (!chart) return
  chart.innerHTML = hours.map((h, i) => {
    const pct = Math.round((h / max) * 100)
    const isToday = i === todayIdx
    const isFuture = i > todayIdx
    return `
      <div class="chart-col">
        <span class="chart-val">${h > 0 ? h + 'h' : ''}</span>
        <div class="chart-bar-wrap">
          <div class="chart-bar ${isToday ? 'today' : isFuture ? 'future' : 'past'}"
               style="height:${isFuture ? 4 : Math.max(pct, h > 0 ? 8 : 4)}%"></div>
        </div>
        <span class="chart-label ${isToday ? 'today' : ''}">${days[i]}</span>
      </div>`
  }).join('')
}

// ── SIDEBAR NAVIGATION ────────────────────────────────────────
function initSidebar() {
  const items = document.querySelectorAll('.db-nav-item')
  const sections = ['home','progress','study','pomodoro','mock','settings']
  items.forEach((item, i) => {
    item.addEventListener('click', e => {
      e.preventDefault()
      items.forEach(it => it.classList.remove('active'))
      item.classList.add('active')
      showSection(sections[i] || 'home')
    })
  })
}

function showSection(name) {
  document.querySelectorAll('.db-section').forEach(s => s.classList.remove('active'))
  const el = document.getElementById('section-' + name)
  if (el) el.classList.add('active')
}

// ── LOGOUT ────────────────────────────────────────────────────
document.getElementById('logoutBtn')?.addEventListener('click', logout)
document.getElementById('dropdownLogout')?.addEventListener('click', logout)

// ── AVATAR DROPDOWN ───────────────────────────────────────────
const avatarBtn  = document.getElementById('avatarBtn')
const dropdown   = document.getElementById('avatarDropdown')
if (avatarBtn && dropdown) {
  avatarBtn.addEventListener('click', e => { e.stopPropagation(); dropdown.classList.toggle('open') })
  document.addEventListener('click', () => dropdown.classList.remove('open'))
}

// ── HELPERS ───────────────────────────────────────────────────
function setText(id, val) {
  const el = document.getElementById(id)
  if (el) el.textContent = val
}

// ── LISTEN FOR DATA UPDATES ───────────────────────────────────
document.addEventListener('progressUpdated', () => {
  const user = getUser()
  if (user) { buildSubjects(user.goal); updateStats(user.goal) }
})
document.addEventListener('studySessionLogged', () => {
  const user = getUser()
  if (user) { updateStats(user.goal); buildWeeklyChart() }
})

// ── RUN ───────────────────────────────────────────────────────
initSidebar()
init()

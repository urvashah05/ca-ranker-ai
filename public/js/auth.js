import { saveUser, getUser, setSession } from '/js/storage.js'

// ─── SIGNUP ──────────────────────────────────────────────────
export function handleSignup(e) {
  e.preventDefault()
  clearAllErrors()

  const nameEl  = document.getElementById('signupName')
  const emailEl = document.getElementById('signupEmail')
  const passEl  = document.getElementById('signupPassword')
  const ageEl   = document.getElementById('signupAge')
  const goalEl  = document.getElementById('signupGoal')
  const btn     = document.getElementById('signupBtn')

  const name  = nameEl.value.trim()
  const email = emailEl.value.trim().toLowerCase()
  const pass  = passEl.value
  const age   = ageEl.value.trim()
  const goal  = goalEl.value

  let valid = true
  if (!name || name.length < 2)          { showFieldError(nameEl,  'Please enter your full name (min 2 chars)'); valid = false }
  if (!email || !isValidEmail(email))    { showFieldError(emailEl, 'Please enter a valid email address'); valid = false }
  if (!pass || pass.length < 6)          { showFieldError(passEl,  'Password must be at least 6 characters'); valid = false }
  if (!age || +age < 15 || +age > 60)    { showFieldError(ageEl,   'Please enter a valid age (15–60)'); valid = false }
  if (!goal)                             { showFieldError(goalEl,  'Please select your goal'); valid = false }
  if (!valid) return

  const existing = getUser()
  if (existing && existing.email === email) {
    showBanner('signupBanner', 'This email is already registered. Please log in.', 'error')
    return
  }

  saveUser({ name, email, password: pass, age: +age, goal, joinedAt: new Date().toISOString() })
  setSession()

  btn.textContent = 'Creating account…'
  btn.disabled = true
  setTimeout(() => { window.location.href = '/pages/dashboard.html' }, 800)
}

// ─── LOGIN ───────────────────────────────────────────────────
export function handleLogin(e) {
  e.preventDefault()
  clearAllErrors()

  const emailEl = document.getElementById('loginEmail')
  const passEl  = document.getElementById('loginPassword')
  const btn     = document.getElementById('loginBtn')

  const email = emailEl.value.trim().toLowerCase()
  const pass  = passEl.value

  if (!email) { showFieldError(emailEl, 'Please enter your email'); return }
  if (!pass)  { showFieldError(passEl,  'Please enter your password'); return }

  const user = getUser()
  if (!user || user.email !== email || user.password !== pass) {
    showBanner('loginBanner', 'Incorrect email or password. Please try again.', 'error')
    shakeCard()
    return
  }

  setSession()
  btn.textContent = 'Logging in…'
  btn.disabled = true
  setTimeout(() => { window.location.href = '/pages/dashboard.html' }, 800)
}

// ─── HELPERS ─────────────────────────────────────────────────
export function showFieldError(el, msg) {
  el.classList.add('field-error')
  let err = el.parentElement.querySelector('.field-err-msg')
  if (!err) { err = document.createElement('span'); err.className = 'field-err-msg'; el.parentElement.appendChild(err) }
  err.textContent = msg
  err.classList.add('visible')
  el.addEventListener('input', () => clearFieldError(el), { once: true })
}

export function clearFieldError(el) {
  el.classList.remove('field-error')
  el.parentElement.querySelector('.field-err-msg')?.remove()
}

function clearAllErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'))
  document.querySelectorAll('.field-err-msg').forEach(el => el.remove())
  document.querySelectorAll('.auth-banner').forEach(el => { el.textContent = ''; el.className = 'auth-banner' })
}

export function showBanner(id, msg, type = 'error') {
  const el = document.getElementById(id)
  if (!el) return
  el.textContent = msg
  el.className = `auth-banner auth-banner--${type} visible`
  setTimeout(() => { el.className = 'auth-banner' }, 5000)
}

function shakeCard() {
  const card = document.querySelector('.auth-card')
  if (!card) return
  card.classList.remove('shake')
  void card.offsetWidth
  card.classList.add('shake')
  setTimeout(() => card.classList.remove('shake'), 600)
}

function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }

// ─── PASSWORD STRENGTH ───────────────────────────────────────
export function initPasswordStrength(inputId, fillId, labelId) {
  const input = document.getElementById(inputId)
  const fill  = document.getElementById(fillId)
  const label = document.getElementById(labelId)
  if (!input || !fill) return
  input.addEventListener('input', () => {
    const v = input.value
    let score = 0, cls = '', text = ''
    if (v.length >= 6)  score++
    if (v.length >= 10) score++
    if (/[A-Z]/.test(v) || /[0-9!@#$%]/.test(v)) score++
    if (score === 1) { cls = 'weak';   text = 'Weak' }
    else if (score === 2) { cls = 'medium'; text = 'Medium' }
    else if (score >= 3)  { cls = 'strong'; text = 'Strong' }
    fill.className = `pw-strength-fill ${cls}`
    fill.style.width = score === 0 ? '0' : score === 1 ? '33%' : score === 2 ? '66%' : '100%'
    if (label) label.textContent = text
  })
}

// ─── PASSWORD TOGGLE ─────────────────────────────────────────
export function initPasswordToggle(inputId, btnId) {
  const input = document.getElementById(inputId)
  const btn   = document.getElementById(btnId)
  if (!input || !btn) return
  btn.addEventListener('click', () => {
    const show = input.type === 'password'
    input.type = show ? 'text' : 'password'
    btn.innerHTML = show
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
  })
}

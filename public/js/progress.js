import {
  getSubjectsForGoal, getProgress, saveProgress,
  getCoveragePercent, getAllProgress
} from '/js/storage.js'

// ─── RENDER SUBJECT BARS (home section) ──────────────────────
export function renderSubjectBars(containerId, goal) {
  const el = document.getElementById(containerId)
  if (!el) return
  const subjects = getSubjectsForGoal(goal)
  el.innerHTML = subjects.map(s => {
    const pct = getCoveragePercent(s.id, s.total)
    return `
      <div class="subj-row" data-id="${s.id}" data-total="${s.total}">
        <span class="subj-name">${s.name}</span>
        <div class="subj-track">
          <div class="subj-fill" style="width:0%" data-pct="${pct}"></div>
        </div>
        <span class="subj-pct">${pct}%</span>
      </div>`
  }).join('')
  // Animate bars
  requestAnimationFrame(() => {
    el.querySelectorAll('.subj-fill').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%'
    })
  })
}

// ─── RENDER PROGRESS CARDS (progress section) ────────────────
export function renderProgressCards(containerId, goal) {
  const el = document.getElementById(containerId)
  if (!el) return
  const subjects = getSubjectsForGoal(goal)
  el.innerHTML = subjects.map(s => {
    const p   = getProgress(s.id)
    const pct = getCoveragePercent(s.id, s.total)
    const status = pct === 0 ? 'Not Started' : pct >= 100 ? 'Completed' : 'In Progress'
    const statusCls = pct === 0 ? 'badge-grey' : pct >= 100 ? 'badge-green' : 'badge-amber'
    const lastStudied = p.lastStudied
      ? daysSince(p.lastStudied) === 0 ? 'Today'
        : daysSince(p.lastStudied) === 1 ? 'Yesterday'
        : `${daysSince(p.lastStudied)} days ago`
      : 'Never'
    const circ = 2 * Math.PI * 28
    const offset = circ - (pct / 100) * circ
    return `
      <div class="prog-card">
        <div class="prog-card-top">
          <span class="prog-card-name">${s.name}</span>
          <span class="prog-badge ${statusCls}">${status}</span>
        </div>
        <div class="prog-card-ring-row">
          <svg width="70" height="70" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(44,26,18,.08)" stroke-width="6"/>
            <circle cx="35" cy="35" r="28" fill="none" stroke="#D4AF37" stroke-width="6"
              stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
              transform="rotate(-90 35 35)" class="prog-ring-arc"/>
            <text x="35" y="39" text-anchor="middle" font-size="13" font-weight="800" fill="#1A120B">${pct}%</text>
          </svg>
          <div class="prog-card-stats">
            <div class="prog-stat"><span class="prog-stat-val">${p.topicsCovered}</span><span class="prog-stat-lbl"> / ${s.total} topics</span></div>
            <div class="prog-stat"><span class="prog-stat-val">${p.hours}</span><span class="prog-stat-lbl"> hrs studied</span></div>
            <div class="prog-stat-lbl">Last: ${lastStudied}</div>
          </div>
        </div>
        <div class="subj-track" style="margin:12px 0 16px">
          <div class="subj-fill" style="width:${pct}%" data-pct="${pct}"></div>
        </div>
        <button class="btn-update-prog" data-id="${s.id}" data-name="${s.name}" data-total="${s.total}">+ Update Progress</button>
      </div>`
  }).join('')

  // Bind update buttons
  el.querySelectorAll('.btn-update-prog').forEach(btn => {
    btn.addEventListener('click', () => openProgressModal(btn.dataset.id, btn.dataset.name, +btn.dataset.total))
  })
}

// ─── PROGRESS MODAL ──────────────────────────────────────────
export function openProgressModal(subjectId, subjectName, totalTopics) {
  const existing = document.getElementById('progressModal')
  if (existing) existing.remove()

  const modal = document.createElement('div')
  modal.id = 'progressModal'
  modal.className = 'modal-overlay'
  modal.innerHTML = `
    <div class="modal-card">
      <h3 class="modal-title">Update Progress</h3>
      <p class="modal-subject">${subjectName}</p>
      <div class="form-group">
        <label class="form-label">Topics covered this session</label>
        <div class="stepper">
          <button type="button" class="stepper-btn" id="stepDown">−</button>
          <input type="number" id="topicsInput" class="form-input stepper-input" value="1" min="0" max="${totalTopics}"/>
          <button type="button" class="stepper-btn" id="stepUp">+</button>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Hours studied</label>
        <input type="number" id="hoursInput" class="form-input" value="0.5" min="0" max="12" step="0.5"/>
      </div>
      <div class="form-group">
        <label class="form-label">Notes (optional)</label>
        <textarea id="notesInput" class="form-input" rows="2" placeholder="e.g. Chapter 3 — Consolidation"></textarea>
      </div>
      <div class="modal-actions">
        <button class="btn-p" id="saveProgressBtn">Save</button>
        <button class="btn-g" id="cancelProgressBtn">Cancel</button>
      </div>
    </div>`
  document.body.appendChild(modal)

  document.getElementById('stepDown').addEventListener('click', () => {
    const inp = document.getElementById('topicsInput')
    inp.value = Math.max(0, +inp.value - 1)
  })
  document.getElementById('stepUp').addEventListener('click', () => {
    const inp = document.getElementById('topicsInput')
    inp.value = Math.min(totalTopics, +inp.value + 1)
  })
  document.getElementById('cancelProgressBtn').addEventListener('click', () => modal.remove())
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })

  document.getElementById('saveProgressBtn').addEventListener('click', () => {
    const topics = +document.getElementById('topicsInput').value || 0
    const hours  = +document.getElementById('hoursInput').value  || 0
    saveProgress(subjectId, { topicsCovered: topics, hours, totalTopics })
    modal.remove()
    // Refresh progress section
    document.dispatchEvent(new CustomEvent('progressUpdated'))
  })
}

function daysSince(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime()
  return Math.floor(diff / 86400000)
}

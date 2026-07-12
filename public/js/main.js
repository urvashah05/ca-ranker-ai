/**
 * main.js — Landing page logic
 * CA Ranker AI
 * All existing script.js logic preserved and cleaned up.
 */

/* ── NAV STUCK ── */
const nav = document.getElementById('nav')
if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 30), { passive: true })
}

/* ── HAMBURGER ── */
const burger   = document.getElementById('burger')
const navLinks = document.getElementById('navLinks')
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open')
    navLinks.classList.toggle('open')
  })
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open')
    navLinks.classList.remove('open')
  }))
}

/* ── HERO PARALLAX ── */
const hcard = document.getElementById('hcard')
if (hcard) {
  document.addEventListener('mousemove', e => {
    const r  = hcard.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width  / 2)) / (innerWidth  / 2)
    const dy = (e.clientY - (r.top  + r.height / 2)) / (innerHeight / 2)
    hcard.style.transform = `translateY(${-6 + dy * -6}px) rotateY(${dx * 5}deg) rotateX(${dy * -4}deg)`
  })
}

/* ── SWAP TEXT ── */
const swapEl = document.getElementById('swap')
if (swapEl) {
  const words = ['Track Progress', 'Improve Daily', 'Crack AIR']
  let wi = 0
  setInterval(() => {
    swapEl.classList.add('out')
    setTimeout(() => {
      wi = (wi + 1) % words.length
      swapEl.textContent = words[wi]
      swapEl.classList.remove('out')
    }, 350)
  }, 2000)
}

/* ── POMODORO TIMER ── */
let secs = 25 * 60
const ptimeEl    = document.getElementById('ptime')
const dashPomoEl = document.getElementById('dashPomoTime')
const whyPtimeEl = document.getElementById('whyPtime')
if (ptimeEl || dashPomoEl || whyPtimeEl) {
  setInterval(() => {
    secs--; if (secs < 0) secs = 25 * 60
    const m = String(Math.floor(secs / 60)).padStart(2, '0')
    const s = String(secs % 60).padStart(2, '0')
    if (ptimeEl)    ptimeEl.textContent    = `${m}:${s}`
    if (dashPomoEl) dashPomoEl.textContent = `${m}:${s}`
    if (whyPtimeEl) whyPtimeEl.textContent = `${m}:${s}`
  }, 1000)
}

/* ── WHY TABS ── */
document.querySelectorAll('.why-tbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const i = btn.dataset.w
    document.querySelectorAll('.why-tbtn').forEach(b => b.classList.remove('active'))
    document.querySelectorAll('.why-panel').forEach(p => p.classList.remove('active'))
    btn.classList.add('active')
    document.getElementById('wp' + i)?.classList.add('active')
  })
})

/* ── SLIDER DRAG ── */
const track = document.getElementById('sliderTrack')
if (track) {
  let isDragging = false, startX = 0
  track.addEventListener('mousedown', e => {
    isDragging = true; startX = e.pageX
    track.style.animationPlayState = 'paused'
  })
  window.addEventListener('mousemove', e => {
    if (!isDragging) return
    track.style.transform = `translateX(${e.pageX - startX}px)`
  })
  window.addEventListener('mouseup', () => {
    isDragging = false
    track.style.animationPlayState = 'running'
    track.style.transform = ''
  })
}

/* ── FCARD HOVER ── */
document.querySelectorAll('.fcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - .5) * 10
    const y = ((e.clientY - r.top)  / r.height - .5) * 10
    card.style.transform = `translateY(-5px) rotateX(${-y}deg) rotateY(${x}deg)`
  })
  card.addEventListener('mouseleave', () => card.style.transform = '')
})

/* ── SCROLL REVEAL (non-hero) ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target) } })
}, { threshold: 0.1 })
document.querySelectorAll('.up:not(.hero-inner .up)').forEach(el => io.observe(el))

/* ── AIR TARGET RING ── */
;(function(){
  const wrap = document.getElementById('airWrap')
  if (!wrap) return
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return
      wrap.classList.add('air-animated')
      wrap.querySelectorAll('.air-metric-val').forEach((el, idx) => {
        const target = parseFloat(el.dataset.count)
        const dec    = parseInt(el.dataset.dec) || 0
        const inc    = target / (1400 / 16)
        let cur = 0
        setTimeout(() => {
          const t = setInterval(() => {
            cur = Math.min(cur + inc, target)
            el.textContent = dec > 0 ? cur.toFixed(dec) : Math.floor(cur)
            if (cur >= target) clearInterval(t)
          }, 16)
        }, 700 + idx * 200)
      })
      obs.unobserve(wrap)
    })
  }, { threshold: 0.3 })
  obs.observe(wrap)
})()

/* ── TRACK STREAK COUNTER ── */
;(function(){
  const el = document.querySelector('.tc-streak-val')
  if (!el) return
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return
      const target = parseInt(el.dataset.count)
      let cur = 0
      const t = setInterval(() => {
        cur = Math.min(cur + 1, target)
        el.textContent = cur
        if (cur >= target) clearInterval(t)
      }, 80)
      obs.unobserve(e.target)
    })
  }, { threshold: 0.5 })
  obs.observe(el)
})()

/* ── JOURNEY TIMELINE ── */
;(function(){
  const scene    = document.getElementById('jScene')
  const waveDraw = document.getElementById('jWaveDraw')
  const rows     = document.querySelectorAll('.j-row')
  if (!scene || !waveDraw) return
  let totalLen = 0
  requestAnimationFrame(() => {
    totalLen = waveDraw.getTotalLength() || 900
    waveDraw.style.strokeDasharray  = totalLen
    waveDraw.style.strokeDashoffset = totalLen
  })
  function onScroll() {
    if (!totalLen) return
    const rect = scene.getBoundingClientRect()
    const wh   = window.innerHeight
    const p    = Math.min(1, Math.max(0, (wh - rect.top) / (rect.height + wh * 0.2)))
    waveDraw.style.strokeDashoffset = totalLen - totalLen * p
    rows.forEach(row => { if (row.getBoundingClientRect().top < wh * 0.88) row.classList.add('visible') })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})()

/* ── PROOF COUNTERS ── */
;(function(){
  function animateCounter(el) {
    const target = +el.dataset.target
    const inc = target / (1800 / 16)
    let cur = 0
    const t = setInterval(() => {
      cur = Math.min(cur + inc, target)
      el.textContent = target < 10 ? cur.toFixed(1) : Math.floor(cur).toLocaleString()
      if (cur >= target) clearInterval(t)
    }, 16)
  }
  const proofEl = document.querySelector('.hero-proof')
  if (!proofEl) return
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return
      e.target.querySelectorAll('.proof-num').forEach(animateCounter)
      obs.unobserve(e.target)
    })
  }, { threshold: 0.5 })
  obs.observe(proofEl)
})()


/* ── ① AIR RANK SLIDER ── */
;(function () {
  const slider   = document.getElementById('airRankSlider')
  const airSub   = document.querySelector('.air-sub')
  const airArc   = document.getElementById('airArc')
  const msgEl    = document.getElementById('airSliderMsg')
  if (!slider || !airSub || !airArc) return

  const CIRCUM = 974 // stroke-dasharray value
  const MAX    = 500

  const messages = {
    top:    'You\'re aiming for the top! Keep this energy every day.',
    great:  'Excellent target! Consistency and AI will get you there.',
    good:   'Solid goal. Focus on weak areas and mock tests.',
    steady: 'Every rank counts. Start building your strategy today.',
    start:  'Great starting point! Use AI tools to move up fast.'
  }

  function getMsg (rank) {
    if (rank <= 10)  return messages.top
    if (rank <= 50)  return messages.great
    if (rank <= 100) return messages.good
    if (rank <= 250) return messages.steady
    return messages.start
  }

  function updateSlider (rank) {
    // Update label inside ring
    airSub.textContent = '< ' + rank

    // Arc fill: rank 1 = full circle, rank MAX = ~5% fill (so it's always visible)
    const fillRatio = 1 - (rank - 1) / (MAX - 1)
    const offset    = CIRCUM - (CIRCUM * (0.05 + fillRatio * 0.95))
    airArc.style.strokeDashoffset    = offset
    airArc.style.transition          = 'stroke-dashoffset .25s cubic-bezier(.4,0,.2,1)'
    airArc.style.animation           = 'none' // override CSS keyframe when interacting

    // Slider track gradient
    const pct = ((rank - 1) / (MAX - 1) * 100).toFixed(1)
    slider.style.setProperty('--val', pct + '%')

    // Message
    msgEl.textContent = getMsg(rank)
  }

  // Init on load with default value
  updateSlider(parseInt(slider.value, 10))

  slider.addEventListener('input', () => {
    updateSlider(parseInt(slider.value, 10))
  })
})()

/* ── ③ STUDY MODES TABS ── */
;(function () {
  document.querySelectorAll('.sm-tbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.sm
      document.querySelectorAll('.sm-tbtn').forEach(b => {
        b.classList.remove('active')
        b.setAttribute('aria-selected', 'false')
      })
      document.querySelectorAll('.sm-panel').forEach(p => p.classList.remove('active'))
      btn.classList.add('active')
      btn.setAttribute('aria-selected', 'true')
      const panel = document.getElementById('smp' + idx)
      if (panel) panel.classList.add('active')
    })
  })

  // Mock test countdown timer
  let mockSeconds = 12 * 60 + 47
  const timerEl   = document.getElementById('smTimer')
  if (timerEl) {
    setInterval(() => {
      if (mockSeconds > 0) mockSeconds--
      const m = String(Math.floor(mockSeconds / 60)).padStart(2, '0')
      const s = String(mockSeconds % 60).padStart(2, '0')
      timerEl.textContent = m + ':' + s
    }, 1000)
  }
})()

/* ── ④ LIVE ONBOARDING PREVIEW ── */
;(function () {
  const btn         = document.getElementById('obGenerateBtn')
  const placeholder = document.getElementById('obPlaceholder')
  const loading     = document.getElementById('obLoading')
  const plan        = document.getElementById('obPlan')
  const examSel     = document.getElementById('obExam')
  const subjSel     = document.getElementById('obSubject')
  const planSubject = document.getElementById('obPlanSubject')
  const planMeta    = document.getElementById('obPlanMeta')
  const planHours   = document.getElementById('obPlanHours')
  const planTasks   = document.getElementById('obTasks')
  if (!btn) return

  const planData = {
    FR: {
      name: 'Financial Reporting',
      hours: '4.5 hrs/day',
      tasks: [
        { text: 'Revise Ind AS 19 & 109 — key measurement principles', time: '1.5 hrs' },
        { text: 'Attempt 10 ICAI MCQs on Consolidation (AS 21)', time: '1 hr' },
        { text: 'Write 2 full descriptive answers under timed conditions', time: '2 hrs' }
      ]
    },
    AFM: {
      name: 'Advanced Financial Management',
      hours: '5 hrs/day',
      tasks: [
        { text: 'Practice 5 derivatives pricing problems (Black-Scholes)', time: '2 hrs' },
        { text: 'Revise Foreign Exchange Risk — hedging strategies summary', time: '1.5 hrs' },
        { text: 'Solve 3 past ICAI questions on Capital Budgeting with NPV', time: '1.5 hrs' }
      ]
    },
    Audit: {
      name: 'Auditing & Ethics',
      hours: '3.5 hrs/day',
      tasks: [
        { text: 'Read & mind-map SA 700 Series (SA 700, 701, 705, 706)', time: '1.5 hrs' },
        { text: 'Practice short-note questions on CARO 2020 reporting', time: '1 hr' },
        { text: 'Revise Professional Ethics — ICAI Code key clauses', time: '1 hr' }
      ]
    },
    DT: {
      name: 'Direct Tax Laws',
      hours: '5 hrs/day',
      tasks: [
        { text: 'Revise Transfer Pricing — methods & documentation', time: '2 hrs' },
        { text: 'Solve 6 computation problems on Business Income', time: '2 hrs' },
        { text: 'Flashcard drill on Section 80 deductions & limits', time: '1 hr' }
      ]
    },
    IDT: {
      name: 'Indirect Tax Laws',
      hours: '4 hrs/day',
      tasks: [
        { text: 'Revise Time & Place of Supply rules with examples', time: '1.5 hrs' },
        { text: 'Attempt 15 MCQs on Input Tax Credit conditions', time: '1.5 hrs' },
        { text: 'Summarise Custom Duty valuation methods in notes', time: '1 hr' }
      ]
    },
    IBS: {
      name: 'Integrated Business Solutions',
      hours: '6 hrs/day',
      tasks: [
        { text: 'Case study analysis — integrate FR + DT + Audit perspectives', time: '3 hrs' },
        { text: 'Time-boxed writing: 2 case memos under 20 min each', time: '2 hrs' },
        { text: 'Review ICAI suggested answers for 2023 IBS paper', time: '1 hr' }
      ]
    },
    Corp: {
      name: 'Corporate & Other Laws',
      hours: '3 hrs/day',
      tasks: [
        { text: 'Revise SEBI LODR vs Companies Act 2013 — comparison table', time: '1.5 hrs' },
        { text: 'Practice short questions on Insolvency & Bankruptcy Code', time: '1 hr' },
        { text: 'Flashcard review — key sections & penalties', time: '0.5 hrs' }
      ]
    },
    SCMPE: {
      name: 'Strategic Cost Management',
      hours: '4 hrs/day',
      tasks: [
        { text: 'Solve 4 standard costing variance analysis problems', time: '2 hrs' },
        { text: 'Revise Activity Based Costing with a practice case', time: '1.5 hrs' },
        { text: 'Mind-map Target Costing vs Kaizen Costing differences', time: '0.5 hrs' }
      ]
    }
  }

  const examLabels = {
    final: 'CA Final',
    inter: 'CA Intermediate',
    foundation: 'CA Foundation'
  }

  btn.addEventListener('click', () => {
    const examVal = examSel.value
    const subjVal = subjSel.value
    if (!examVal || !subjVal) {
      examSel.focus()
      examSel.style.borderColor = '#B45309'
      subjSel.style.borderColor = '#B45309'
      setTimeout(() => {
        examSel.style.borderColor = ''
        subjSel.style.borderColor = ''
      }, 1800)
      return
    }

    // Show loading
    placeholder.style.display = 'none'
    plan.style.display         = 'none'
    loading.style.display      = 'flex'

    setTimeout(() => {
      const data = planData[subjVal] || planData.FR
      const examLabel = examLabels[examVal] || 'CA Final'

      planSubject.textContent = data.name
      planMeta.textContent    = examLabel + ' · 3-day recovery sprint'
      planHours.textContent   = data.hours

      planTasks.innerHTML = data.tasks.map((t, i) => `
        <div class="ob-task">
          <span class="ob-task-num">${i + 1}</span>
          <span>${t.text}</span>
          <span class="ob-task-time">${t.time}</span>
        </div>
      `).join('')

      loading.style.display = 'none'
      plan.style.display    = 'block'
    }, 1500)
  })
})()

/* ── GITHUB HEATMAP ── */
;(function(){
  const grid = document.getElementById('heatmapGrid')
  if (!grid) return
  const cells = 53 * 7
  const today = new Date().getDay()
  const html = []
  for (let i = 0; i < cells; i++) {
    const daysAgo = cells - i
    const isPast = daysAgo > 0
    const rand = Math.random()
    let cls = 'hm-c0'
    if (isPast && daysAgo < 50)      cls = rand > .6 ? 'hm-c4' : rand > .4 ? 'hm-c3' : rand > .25 ? 'hm-c2' : rand > .1 ? 'hm-c1' : 'hm-c0'
    else if (isPast && daysAgo < 150) cls = rand > .7 ? 'hm-c3' : rand > .5 ? 'hm-c2' : rand > .3 ? 'hm-c1' : 'hm-c0'
    else if (isPast)                  cls = rand > .8 ? 'hm-c2' : rand > .6 ? 'hm-c1' : 'hm-c0'
    html.push('<div class="hm-cell ' + cls + '"></div>')
  }
  grid.innerHTML = html.join('')

  // Animate streak counter
  const streakEl = document.querySelector('.heatmap-streak-big')
  if (streakEl) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const target = parseInt(streakEl.dataset.count)
        let cur = 0
        const t = setInterval(() => {
          cur = Math.min(cur + 1, target)
          streakEl.textContent = cur
          if (cur >= target) clearInterval(t)
        }, 40)
        obs.unobserve(e.target)
      })
    }, { threshold: 0.5 })
    obs.observe(streakEl)
  }
})()

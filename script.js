/* ── NAV STUCK ── */
const nav = document.getElementById('nav')
window.addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 30), { passive: true })

/* ── HAMBURGER ── */
const burger   = document.getElementById('burger')
const navLinks = document.getElementById('navLinks')
burger.addEventListener('click', () => {
  burger.classList.toggle('open')
  navLinks.classList.toggle('open')
})
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open')
  navLinks.classList.remove('open')
}))

/* ── HERO DASHBOARD 3D PARALLAX ── */
const hcard = document.getElementById('hcard')
document.addEventListener('mousemove', e => {
  if (!hcard) return
  const r  = hcard.getBoundingClientRect()
  const dx = (e.clientX - (r.left + r.width  / 2)) / (innerWidth  / 2)
  const dy = (e.clientY - (r.top  + r.height / 2)) / (innerHeight / 2)
  hcard.style.transform = `translateY(${-6 + dy * -6}px) rotateY(${dx * 5}deg) rotateX(${dy * -4}deg)`
})

/* ── SWAP TEXT ── */
const words = ['Track Progress', 'Improve Daily', 'Crack AIR']
let wi = 0
const swapEl = document.getElementById('swap')
setInterval(() => {
  swapEl.classList.add('out')
  setTimeout(() => {
    wi = (wi + 1) % words.length
    swapEl.textContent = words[wi]
    swapEl.classList.remove('out')
  }, 350)
}, 2000)

/* ── POMODORO TIMER ── */
let secs = 25 * 60
const ptimeEl    = document.getElementById('ptime')
const dashPomoEl = document.getElementById('dashPomoTime')
const whyPtimeEl = document.getElementById('whyPtime')
setInterval(() => {
  secs--; if (secs < 0) secs = 25 * 60
  const m = String(Math.floor(secs / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')
  if (ptimeEl)    ptimeEl.textContent    = `${m}:${s}`
  if (dashPomoEl) dashPomoEl.textContent = `${m}:${s}`
  if (whyPtimeEl) whyPtimeEl.textContent = `${m}:${s}`
}, 1000)

/* ── WHY TABS ── */
document.querySelectorAll('.why-tbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const i = btn.dataset.w
    document.querySelectorAll('.why-tbtn').forEach(b => b.classList.remove('active'))
    document.querySelectorAll('.why-panel').forEach(p => p.classList.remove('active'))
    btn.classList.add('active')
    document.getElementById('wp' + i).classList.add('active')
  })
})

/* ── 2D SLIDER — drag to scroll ── */
const track = document.getElementById('sliderTrack')
if (track) {
  let isDragging = false, startX = 0, scrollLeft = 0
  track.addEventListener('mousedown', e => {
    isDragging = true; startX = e.pageX; scrollLeft = track.scrollLeft
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
document.querySelectorAll('.fcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - .5) * 10
    const y = ((e.clientY - r.top)  / r.height - .5) * 10
    card.style.transform = `translateY(-5px) rotateX(${-y}deg) rotateY(${x}deg)`
  })
  card.addEventListener('mouseleave', () => card.style.transform = '')
})

/* ── SCROLL REVEAL (non-hero only) ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target) } })
}, { threshold: 0.1 })
document.querySelectorAll('.up:not(.hero-inner .up)').forEach(el => io.observe(el))

/* ── AIR TARGET SYSTEM ANIMATION ── */
;(function(){
  const wrap = document.getElementById('airWrap')
  if (!wrap) return

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        wrap.classList.add('air-animated')
        // animate metric counters with staggered delay
        wrap.querySelectorAll('.air-metric-val').forEach((el, idx) => {
          const target = parseFloat(el.dataset.count)
          const dec    = parseInt(el.dataset.dec) || 0
          const dur    = 1400
          const step   = 16
          const inc    = target / (dur / step)
          let cur = 0
          const delay = 700 + idx * 200
          setTimeout(() => {
            const t = setInterval(() => {
              cur = Math.min(cur + inc, target)
              el.textContent = dec > 0 ? cur.toFixed(dec) : Math.floor(cur)
              if (cur >= target) clearInterval(t)
            }, step)
          }, delay)
        })
        obs.unobserve(wrap)
      }
    })
  }, { threshold: 0.3 })
  obs.observe(wrap)
})()

/* ── TRACK SECTION STREAK COUNTER ── */
;(function(){
  const streakEl = document.querySelector('.tc-streak-val')
  if (!streakEl) return
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        const target = parseInt(streakEl.dataset.count)
        let cur = 0
        const t = setInterval(() => {
          cur = Math.min(cur + 1, target)
          streakEl.textContent = cur
          if (cur >= target) clearInterval(t)
        }, 80)
        obs.unobserve(e.target)
      }
    })
  }, { threshold: 0.5 })
  obs.observe(streakEl)
})()
;(function(){
  const wrap   = document.getElementById('jpWrap')
  const path   = document.getElementById('jpPath')
  const nodes  = [0,1,2,3].map(i => document.getElementById('jpN' + i))
  const labels = [0,1,2,3].map(i => document.getElementById('jpL' + i))
  if (!wrap || !path) return

  // node positions as % of total path length
  const nodeAt = [0.02, 0.33, 0.66, 0.98]

  function runAnimation(){
    const totalLen = path.getTotalLength() || 1200
    path.style.strokeDasharray  = totalLen
    path.style.strokeDashoffset = totalLen
    wrap.classList.add('jp-animated')

    const dur = 2400 // ms — matches CSS animation
    const start = performance.now()

    function tick(now){
      const p = Math.min((now - start) / dur, 1)
      const drawn = p * totalLen
      const remaining = totalLen - drawn
      path.style.strokeDashoffset = remaining

      nodeAt.forEach((pos, i) => {
        if (p >= pos && !nodes[i].classList.contains('jp-active')){
          nodes[i].classList.add('jp-active')
          labels[i].classList.add('jp-active')
        }
      })
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  // trigger when hero journey preview enters viewport
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        setTimeout(runAnimation, 600) // slight delay after page load
        obs.unobserve(wrap)
      }
    })
  }, { threshold: 0.3 })
  obs.observe(wrap)
})()
function animateCounter(el){
  const target = +el.dataset.target
  const dur = 1800
  const step = 16
  const inc = target / (dur / step)
  let cur = 0
  const t = setInterval(() => {
    cur = Math.min(cur + inc, target)
    el.textContent = target < 10 ? cur.toFixed(1) : Math.floor(cur).toLocaleString()
    if (cur >= target) clearInterval(t)
  }, step)
}
const proofObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting){
      e.target.querySelectorAll('.proof-num').forEach(animateCounter)
      proofObs.unobserve(e.target)
    }
  })
}, { threshold: 0.5 })
const proofEl = document.querySelector('.hero-proof')
if (proofEl) proofObs.observe(proofEl)

/* ── JOURNEY TIMELINE ANIMATION ── */
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

  function onScroll(){
    if (!totalLen) return
    const rect     = scene.getBoundingClientRect()
    const wh       = window.innerHeight
    const progress = Math.min(1, Math.max(0, (wh - rect.top) / (rect.height + wh * 0.2)))

    waveDraw.style.strokeDashoffset = totalLen - (totalLen * progress)

    rows.forEach(row => {
      if (row.getBoundingClientRect().top < wh * 0.88) row.classList.add('visible')
    })
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})()

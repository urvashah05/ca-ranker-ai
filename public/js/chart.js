import { getWeeklyHours } from '/js/storage.js'

export function renderWeeklyChart(containerId) {
  const el = document.getElementById(containerId)
  if (!el) return
  const hours = getWeeklyHours()
  const days  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const todayIdx = (new Date().getDay() + 6) % 7
  const max = Math.max(...hours, 1)

  el.innerHTML = hours.map((h, i) => {
    const pct    = Math.round((h / max) * 100)
    const isToday = i === todayIdx
    const isFuture = i > todayIdx
    return `
      <div class="chart-col">
        <span class="chart-val">${h > 0 ? h + 'h' : ''}</span>
        <div class="chart-bar-wrap">
          <div class="chart-bar ${isToday ? 'today' : isFuture ? 'future' : 'past'}"
               style="height:${isFuture ? 4 : Math.max(pct, h > 0 ? 8 : 4)}%"
               data-hours="${h}"></div>
        </div>
        <span class="chart-label ${isToday ? 'today' : ''}">${days[i]}</span>
      </div>`
  }).join('')
}

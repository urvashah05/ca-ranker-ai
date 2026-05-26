import { getTasks, addTask, toggleTask, deleteTask } from '/js/storage.js'

export function initTasks(containerId) {
  renderTasks(containerId)

  const form  = document.getElementById('taskForm')
  const input = document.getElementById('taskInput')
  if (!form || !input) return

  form.addEventListener('submit', e => {
    e.preventDefault()
    const text = input.value.trim()
    if (!text) return
    addTask({ text, subject: document.getElementById('taskSubject')?.value || '' })
    input.value = ''
    renderTasks(containerId)
  })
}

export function renderTasks(containerId) {
  const el = document.getElementById(containerId)
  if (!el) return
  const tasks = getTasks()

  if (!tasks.length) {
    el.innerHTML = `
      <div class="tasks-empty">
        <div class="tasks-empty-icon">📋</div>
        <p class="tasks-empty-text">No tasks yet</p>
        <p class="tasks-empty-sub">Add a task below to start your session</p>
      </div>`
    return
  }

  el.innerHTML = tasks.map(t => `
    <div class="task-row ${t.done ? 'done' : ''}" data-id="${t.id}">
      <button class="task-check" data-id="${t.id}" aria-label="Toggle">
        ${t.done ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
      </button>
      <span class="task-text">${t.text}${t.subject ? ` <span class="task-subj">${t.subject}</span>` : ''}</span>
      <button class="task-del" data-id="${t.id}" aria-label="Delete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('')

  el.querySelectorAll('.task-check').forEach(btn => {
    btn.addEventListener('click', () => { toggleTask(+btn.dataset.id); renderTasks(containerId) })
  })
  el.querySelectorAll('.task-del').forEach(btn => {
    btn.addEventListener('click', () => { deleteTask(+btn.dataset.id); renderTasks(containerId) })
  })
}

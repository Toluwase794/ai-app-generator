const tasks = [
  { id: 1, title: "Finish project report", priority: "high", status: "todo", section: "today" },
  { id: 2, title: "Email client about feedback", priority: "medium", status: "in progress", section: "today" },
  { id: 3, title: "Plan team meeting agenda", priority: "low", status: "done", section: "today" },
  { id: 4, title: "Update website content", priority: "medium", status: "todo", section: "this-week" },
  { id: 5, title: "Prepare budget proposal", priority: "high", status: "in progress", section: "this-week" },
  { id: 6, title: "Review marketing strategy", priority: "low", status: "todo", section: "this-week" },
  { id: 7, title: "Backup database", priority: "medium", status: "done", section: "backlog" },
  { id: 8, title: "Research new tools", priority: "low", status: "todo", section: "backlog" },
  { id: 9, title: "Organize files", priority: "medium", status: "todo", section: "backlog" },
  { id: 10, title: "Fix login bug", priority: "high", status: "in progress", section: "today" }
];

const filterButtons = document.querySelectorAll('aside .filter-buttons button');
const taskSummary = document.getElementById('task-summary');

let activeFilter = 'all';

function renderTasks() {
  // Clear all task lists
  ['today', 'this-week', 'backlog'].forEach(sectionId => {
    const ul = document.querySelector(`#${sectionId} .task-list`);
    ul.innerHTML = '';
  });

  // Filter tasks by activeFilter
  const filteredTasks = tasks.filter(task => activeFilter === 'all' || task.status === activeFilter);

  // Render tasks in their sections
  filteredTasks.forEach(task => {
    const ul = document.querySelector(`#${task.section} .task-list`);
    if (!ul) return;

    const li = document.createElement('li');
    li.className = 'task';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-title';
    titleSpan.textContent = task.title;

    const tagSpan = document.createElement('span');
    tagSpan.className = `tag ${task.priority}`;
    tagSpan.textContent = task.priority;

    const statusSpan = document.createElement('span');
    statusSpan.className = `status ${task.status.replace(' ', '\ ' )}`;
    statusSpan.textContent = task.status;

    li.appendChild(titleSpan);
    li.appendChild(tagSpan);
    li.appendChild(statusSpan);

    ul.appendChild(li);
  });

  updateSummary();
}

function updateSummary() {
  const total = tasks.length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  taskSummary.textContent = `Total Tasks: ${total} | Done: ${doneCount}`;
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.status;
    renderTasks();
  });
});

// Initial render
renderTasks();

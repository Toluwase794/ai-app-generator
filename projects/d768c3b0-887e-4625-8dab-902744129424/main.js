(function() {
  const todoInput = document.getElementById('todo-input');
  const categorySelect = document.getElementById('category-select');
  const addTodoBtn = document.getElementById('add-todo-btn');
  const todosList = document.getElementById('todos');
  const categoryFilters = document.querySelectorAll('.category-filter');
  const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');

  let todos = [];
  let currentFilter = 'All';

  // Load dark mode preference
  function loadDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
      document.body.classList.add('dark');
      toggleDarkModeBtn.textContent = '☀️';
    } else {
      document.body.classList.remove('dark');
      toggleDarkModeBtn.textContent = '🌙';
    }
  }

  // Save dark mode preference
  function saveDarkMode(enabled) {
    localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');
  }

  toggleDarkModeBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    toggleDarkModeBtn.textContent = isDark ? '☀️' : '🌙';
    saveDarkMode(isDark);
  });

  // Save todos to localStorage
  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  // Load todos from localStorage
  function loadTodos() {
    const stored = localStorage.getItem('todos');
    if (stored) {
      try {
        todos = JSON.parse(stored);
      } catch {
        todos = [];
      }
    }
  }

  // Render todos based on current filter
  function renderTodos() {
    todosList.innerHTML = '';
    const filtered = currentFilter === 'All' ? todos : todos.filter(t => t.category === currentFilter);

    if (filtered.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.textContent = 'No to-dos here.';
      emptyLi.style.fontStyle = 'italic';
      emptyLi.style.color = 'var(--color-muted, #666)';
      todosList.appendChild(emptyLi);
      return;
    }

    filtered.forEach(todo => {
      const li = document.createElement('li');
      li.className = todo.completed ? 'completed' : '';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.setAttribute('aria-label', 'Mark to-do as completed');
      checkbox.addEventListener('change', () => {
        todo.completed = checkbox.checked;
        saveTodos();
        renderTodos();
      });

      const textSpan = document.createElement('span');
      textSpan.className = 'todo-text';
      textSpan.textContent = todo.text;

      const categorySpan = document.createElement('span');
      categorySpan.className = 'todo-category';
      categorySpan.textContent = todo.category;

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'todo-actions';

      const deleteBtn = document.createElement('button');
      deleteBtn.setAttribute('aria-label', 'Delete to-do');
      deleteBtn.textContent = '🗑️';
      deleteBtn.title = 'Delete';
      deleteBtn.addEventListener('click', () => {
        todos = todos.filter(t => t.id !== todo.id);
        saveTodos();
        renderTodos();
      });

      actionsDiv.appendChild(deleteBtn);

      li.appendChild(checkbox);
      li.appendChild(textSpan);
      li.appendChild(categorySpan);
      li.appendChild(actionsDiv);

      todosList.appendChild(li);
    });
  }

  // Add new todo
  function addTodo() {
    const text = todoInput.value.trim();
    const category = categorySelect.value;
    if (!text) {
      todoInput.focus();
      return;
    }

    const newTodo = {
      id: Date.now().toString(),
      text: text,
      category: category,
      completed: false
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();

    todoInput.value = '';
    todoInput.focus();
  }

  addTodoBtn.addEventListener('click', addTodo);

  todoInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });

  // Category filter buttons
  categoryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.category;
      renderTodos();
    });
  });

  // Initialize app
  function init() {
    loadDarkMode();
    loadTodos();
    renderTodos();
  }

  init();
})();

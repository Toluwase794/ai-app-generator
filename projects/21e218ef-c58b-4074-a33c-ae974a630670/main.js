const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

function createTaskElement(text) {
  const li = document.createElement('li');
  li.className = 'task-item';

  const taskText = document.createElement('span');
  taskText.className = 'task-text';
  taskText.textContent = text;

  // Checkmark element (hidden by default)
  const checkmark = document.createElement('span');
  checkmark.className = 'checkmark';
  checkmark.textContent = '✔';
  checkmark.style.display = 'none';

  taskText.prepend(checkmark);

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.innerHTML = '&#128465;'; // Trash can unicode

  // Toggle completed on clicking task text
  taskText.addEventListener('click', () => {
    const completed = taskText.classList.toggle('completed');
    checkmark.style.display = completed ? 'inline' : 'none';
  });

  // Delete task on clicking delete button
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    taskList.removeChild(li);
  });

  li.appendChild(taskText);
  li.appendChild(deleteBtn);

  return li;
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;
  const taskElement = createTaskElement(text);
  taskList.appendChild(taskElement);
  taskInput.value = '';
  taskInput.focus();
}

addBtn.addEventListener('click', addTask);

// Allow pressing Enter to add task
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

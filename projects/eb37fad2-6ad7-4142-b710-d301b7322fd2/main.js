const habitsContainer = document.getElementById('habits-container');
const addHabitBtn = document.getElementById('add-habit-btn');
const habitNameInput = document.getElementById('habit-name');

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Store habits and their completion states in localStorage
function loadHabits() {
  const data = localStorage.getItem('habitTrackerData');
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

function saveHabits(habits) {
  localStorage.setItem('habitTrackerData', JSON.stringify(habits));
}

function createHabitElement(habit) {
  const habitDiv = document.createElement('div');
  habitDiv.classList.add('habit');
  habitDiv.dataset.id = habit.id;

  const header = document.createElement('div');
  header.classList.add('habit-header');

  const title = document.createElement('div');
  title.textContent = habit.name;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    deleteHabit(habit.id);
  });

  header.appendChild(title);
  header.appendChild(deleteBtn);

  const weekdaysDiv = document.createElement('div');
  weekdaysDiv.classList.add('weekdays');

  daysOfWeek.forEach((day, index) => {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');

    const dayName = document.createElement('div');
    dayName.classList.add('day-name');
    dayName.textContent = day;

    const checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('checkbox-container');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = habit.completions[index] || false;
    checkbox.addEventListener('change', () => {
      habit.completions[index] = checkbox.checked;
      updateHabit(habit);
    });

    checkboxContainer.appendChild(checkbox);
    dayDiv.appendChild(dayName);
    dayDiv.appendChild(checkboxContainer);
    weekdaysDiv.appendChild(dayDiv);
  });

  habitDiv.appendChild(header);
  habitDiv.appendChild(weekdaysDiv);

  return habitDiv;
}

function renderHabits() {
  habitsContainer.innerHTML = '';
  const habits = loadHabits();
  habits.forEach(habit => {
    const habitEl = createHabitElement(habit);
    habitsContainer.appendChild(habitEl);
  });
}

function addHabit(name) {
  if (!name.trim()) return;
  const habits = loadHabits();
  const newHabit = {
    id: Date.now().toString(),
    name: name.trim(),
    completions: Array(7).fill(false)
  };
  habits.push(newHabit);
  saveHabits(habits);
  renderHabits();
}

function updateHabit(updatedHabit) {
  const habits = loadHabits();
  const index = habits.findIndex(h => h.id === updatedHabit.id);
  if (index !== -1) {
    habits[index] = updatedHabit;
    saveHabits(habits);
  }
}

function deleteHabit(id) {
  let habits = loadHabits();
  habits = habits.filter(habit => habit.id !== id);
  saveHabits(habits);
  renderHabits();
}

addHabitBtn.addEventListener('click', () => {
  addHabit(habitNameInput.value);
  habitNameInput.value = '';
  habitNameInput.focus();
});

habitNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addHabit(habitNameInput.value);
    habitNameInput.value = '';
  }
});

// Initial render
renderHabits();

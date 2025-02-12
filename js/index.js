const tasksList = document.querySelector('.todo-list')
const tasksInput = document.querySelector('.todo-core__form-input')
const tasksListOpenButton = document.querySelector('.todo-core__form-open-button')
const listControlButtons = document.querySelector('.todo-core__buttons')
const completeAllButton = document.querySelector('.complete-all-button')
const deleteAllButton = document.querySelector('.delete-all-button')
const tasksSortSelect = document.querySelector('.select-sort')
const moon = document.getElementById('moon');
let tasks = []

class Task {
  constructor(text, completed = false, date = Date.now()) {
    this.id = generateId();
    this.text = text;
    this.date = date;
    this.completed = completed;
    this.hidden = false;
    this.visible = true;
  }
}

loadTasks();
renderTasks()

tasksList.addEventListener('click', completeTask)
tasksList.addEventListener('click', removeTask)
tasksListOpenButton.addEventListener('click', toggleTasksList)
tasksSortSelect.addEventListener('change', sortTasks)
completeAllButton.addEventListener('click', () => {
  if (tasks.length !== 0) toggleCompletedProperty()
})
deleteAllButton.addEventListener('click', () => {
  if (tasks.length !== 0) clearTasks()
})
tasksInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    if (tasksInput.value && tasksInput.value !== ' ') {
      createTask(tasksInput.value);
      renderTasks(tasks)
      tasksInput.value = '';
    }
  }
})

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  console.log('Loaded tasks:', savedTasks); // Проверка загруженных задач
  tasks = savedTasks.map(task => new Task(task.text, task.completed, task.date));
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  console.log('Tasks saved:', tasks); // Проверка сохранённых задач
}



function completeTask(event) {
  if (event.target.closest('.todo-list__task-state')) {
    const taskItem = event.target.closest('.todo-list__task');
    if (taskItem) {
      const taskText = taskItem.querySelector('.todo-list__task-text');
      if (taskText) {
        const taskToComplete = tasks.find(task => task.text === taskText.textContent);
        taskToComplete.completed = taskToComplete.completed ? false : true;
        taskText.classList.toggle('completed')
      }
      const taskState = taskItem.querySelector('.todo-list__task-state');
      if (taskState) {
        taskState.classList.toggle('completed')
        const taskStateSvg = taskState.querySelector('.todo-list__task-state-svg');
        if (taskStateSvg) {
          taskStateSvg.classList.toggle('completed')
          sortTasks()
          renderTasks()
        }
      }
    }
  }
}

function removeTask(event) {
  const closeButton = event.target.closest('.todo-list__task-close-button');
  if (closeButton) {
    const taskItem = closeButton.closest('.todo-list__task');
    if (taskItem) {
      const taskText = taskItem.querySelector('.todo-list__task-text');
      if (taskText) {
        const taskToRemove = tasks.find(task => task.text === taskText.textContent);
        if (taskToRemove) {
          tasks = tasks.filter(task => task.id !== taskToRemove.id);
          saveTasks();
          renderTasks();
        }
      }
    }
  }
}

function createTask(inputValue) {
  const newTask = new Task(inputValue);
  tasks.push(newTask);
  console.log(tasks);
  
  if (tasksListOpenButton.querySelector('svg').classList.contains('closed')) {
    toggleTasksList();
  };

  saveTasks();
  sortTasks();
}

function renderTasks() {
  if (tasks.length !== 0) {
    tasksListOpenButton.classList.remove('hidden');
  } else {
    tasksListOpenButton.classList.add('hidden');
  }

  tasksList.innerHTML = '';

  tasks.forEach(task => {
    if (task.visible) {
      const taskItem = document.createElement('li');
      taskItem.classList.add('todo-list__task');
      taskItem.innerHTML = `
        <figure class="todo-list__task-state ${task.completed ? 'completed' : ''}">
          <svg class="todo-list__task-state-svg ${task.completed ? 'completed' : ''}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd">
              <path d="m26.2501621 5.33837836 1.4996758 1.32324328-15.5969199 17.67650916-7.73415619-5.5243973 1.16247638-1.627467 6.26576181 4.4757335z" fill="rgb(0,0,0)" fill-rule="nonzero"/>
            </g>
          </svg>
        </figure>
        <span class="todo-list__task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
        <button class="todo-list__task-close-button">
          <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
            <g>
              <g id="cross">
                <g>
                  <polygon points="612,36.004 576.521,0.603 306,270.608 35.478,0.603 0,36.004 270.522,306.011 0,575.997 35.478,611.397 306,341.411 576.521,611.397 612,575.997 341.459,306.011 "/>
                </g>
              </g>
            </g>
          </svg>
        </button>
      `;

      tasksList.appendChild(taskItem);
    }
  });
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function sortTasks() {
  const sortParameter = tasksSortSelect.value;

  // Сброс видимости всех задач
  tasks.forEach(task => task.visible = true);

  if (sortParameter === 'completed') {
    tasks.forEach(task => task.visible = task.completed);
  } else if (sortParameter === 'in_progress') {
    tasks.forEach(task => task.visible = !task.completed);
  }

  // Сортировка по дате создания или имени
  if (sortParameter === 'date_created') {
    tasks.sort((a, b) => a.date - b.date);
  } else if (sortParameter === 'name') {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
  }
  renderTasks();
}

function toggleTasksList() {
  const openButtonSvg = tasksListOpenButton.querySelector('svg');
  openButtonSvg.classList.toggle('closed')
  tasksList.classList.toggle('hidden')
  listControlButtons.classList.toggle('hidden')
}

function toggleCompletedProperty() {
  const allCompleted = tasks.every(task => task.completed); // Проверяем, все ли задачи завершены

  tasks.forEach(task => {
    task.completed = !allCompleted; // Если все завершены, устанавливаем false, иначе true
  });
  renderTasks();
}

function clearTasks() {
  tasks = [];
  saveTasks();
  renderTasks();
}




moon.addEventListener('click', () => {
  moon.classList.toggle('full-moon');
  document.querySelector('.body').classList.toggle('dark-theme');
  tasksInput.classList.toggle('dark-theme');
});





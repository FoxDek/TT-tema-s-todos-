const tasksList = document.querySelector('.todo-list');
const inputField = document.querySelector('.todo-core__form-input');
const addButton = document.querySelector('.todo-core__form-open-button');

tasksList.addEventListener('click', completeTask);
tasksList.addEventListener('click', removeElem);
addButton.addEventListener('click', addTask);
inputField.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    addTask();
  }
});

// Массив с фразами
const phrases = [
  "Могёшь!",
  "Продолжаем в том же духе!",
  "Отличная работа!",
  "Ты справляешься!",
  "Продолжай в том же духе!",
  "Супер!",
  "Молодец!"
];

class Note {
  constructor(text) {
    this.text = text;
  }
}

function completeTask(event) {
  if (event.target.closest('.todo-list__task-state')) {
    const taskItem = event.target.closest('.todo-list__task');
    if (taskItem) {
      const taskText = taskItem.querySelector('.todo-list__task-text');
      if (taskText) {
        taskText.classList.toggle('completed');
      }
      const taskState = taskItem.querySelector('.todo-list__task-state');
      if (taskState) {
        taskState.classList.toggle('completed');
        const taskStateSvg = taskState.querySelector('.todo-list__task-state-svg');
        if (taskStateSvg) {
          taskStateSvg.classList.toggle('completed');
        }
      }

      // Проверяем, выполнена ли задача
      if (taskText.classList.contains('completed')) {
        // Создаем облачко с фразой
        showPhrase(taskItem);
      }
    }
  }
}

function removeElem(event) {
  if (event.target.closest('.todo-list__task-close-button')) {
    const taskItem = event.target.closest('.todo-list__task');
    if (taskItem) {
      taskItem.remove();
    }
  }
}

function addTask() {
  const taskText = inputField.value.trim();
  if (taskText) {
    const newTask = new Note(taskText);
    createTaskElement(newTask);
    inputField.value = ''; // Очистить поле ввода
  }
}

function createTaskElement(note) {
  const taskItem = document.createElement('li');
  taskItem.classList.add('todo-list__task');

  taskItem.innerHTML = `
    <figure class="todo-list__task-state">
      <svg class="todo-list__task-state-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <g id="checklist,-approve,-check,-correct,-success" fill="none" fill-rule="evenodd">
          <path id="Path" d="m26.2501621 5.33837836 1.4996758 1.32324328-15.5969199 17.67650916-7.73415619-5.5243973 1.16247638-1.627467 6.26576181 4.4757335z" fill="rgb(0,0,0)" fill-rule="nonzero"/>
        </g>
      </svg>
    </figure>
    <span class="todo-list__task-text">${note.text}</span>
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

function showPhrase(taskItem) {
  // Выбираем случайную фразу из массива
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  // Создаем элемент для облачка
  const phraseBubble = document.createElement('div');
  phraseBubble.classList.add('phrase-bubble');
  phraseBubble.textContent = randomPhrase;

  // Позиционируем облачко чуть левее задачи
  const taskRect = taskItem.getBoundingClientRect();
  phraseBubble.style.position = 'absolute';
  phraseBubble.style.left = `${taskRect.left - 100}px`; // Сдвигаем влево на 100px
  phraseBubble.style.top = `${taskRect.top}px`; // Выравниваем по вертикали

  // Добавляем облачко к body, чтобы оно не было ограничено родительским элементом
  document.body.appendChild(phraseBubble);

  // Удаляем облачко через 2 секунды
  setTimeout(() => {
    phraseBubble.remove();
  }, 2000);
}

// CSS для облачка (добавьте это в ваш CSS файл)
const style = document.createElement('style');
style.textContent = `
  .phrase-bubble {
    color: white;
    background-color: #D6A8F0;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: opacity 0.5s;
    z-index: 1000; /* Убедитесь, что облачко отображается поверх других элементов */
  }
`;
document.head.appendChild(style);

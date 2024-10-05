
let selectedCards = [];

function cardCreate(tasksData) {
  const cardList = document.getElementById("cardList");
  if (cardList) {
    tasksData.forEach(task => {
      // Создаем новую карточку
      const newCard = document.createElement("div");
      newCard.className = "card" + ` id:${task.id}`;
      //newCard.classList.add(task.id);
      // Создаем заголовок карточки
      const cardTitle = document.createElement("span");
      cardTitle.className = "card-title";
      cardTitle.textContent = task.title;
      // Создаем кнопку статуса карточки -->
      const statusBtn = document.createElement("div");
      statusBtn.className = "status-btn";
      // Добавляем заголовок и кнопку статуса в карточку -->
      newCard.appendChild(cardTitle);
      newCard.appendChild(statusBtn);
      // Добавляем новую карточку в список -->
      cardList.appendChild(newCard);
      newCard.addEventListener('click', () => {
        const title = newCard.querySelector('.card-title');
        const textTitle = document.querySelector('.task-title');
        const taskText = document.querySelector('.task-text');
        fetch('/multiF', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: getCardId(newCard) }) //не newCard id, а то, что записалось в бдшку
        }).then(
          response => response.json()).then(
            data => {
              title.value = data[0].title; textTitle.value = data[0].title; taskText.value = data[0].description;
              console.log("Загрузка текста: ", data[0]); //почему возвращается массив промисов вместо одного промиса?????
            }).catch(
              error => { console.error('Ошибка в response: ', error) }
            );

        //TODO: переделать на выбор через галочки (или через полоску слева в плашке для таски, чтобы
        //можно было провести мышкой вертикально и нажать delete (кнопку?))
        newCard.addEventListener('mousedown', event => {
          // Запоминаем начальное время нажатия
          const startTime = new Date().getTime();
          const timeout = setTimeout(() => {
            // Если нажатие длилось более 500 мс, выделяем или убираем выделение
            if (!selectedCards.includes(newCard)) {
              newCard.classList.add('selected');
              selectedCards.push(newCard);
            } else {
              newCard.classList.remove('selected');
              selectedCards = selectedCards.filter(selectedCard => selectedCard !== newCard);
            }
          }, 500);
          // При отпускании кнопки мыши или перемещении курсора, сбрасываем таймер
          const clearSelection = () => {
            clearTimeout(timeout);
            document.removeEventListener('mouseup', clearSelection);
            newCard.removeEventListener('mousemove', clearSelection);
          };
        });
      });
      console.log('Карточка добавлена!');
    });
  }
}

//переменная, в которой хранится id карточки нажатой ранее (или стандартной при открытии главной сраницы)
var CD = 0;

function getCardId(card) {
  const classList = card.classList;
  // Ищем класс, который начинается с "card" и содержит ID
  const idClass = [...classList].find(className => className.startsWith('id:'));
  console.log(idClass);
  if (idClass) {
    // Разделяем строку класса для получения ID
    const id = idClass.split(':')[1]; // Первый элемент после разделения это ID
    console.log(`Нажата карточка с ID: ${id}`);
    CD = id; //запоминаем id последней нажатой карточки
    return id;
  }
}

function cF(route, method, ...data) {
  const url = `/${route}`;
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method === 'post') {
    options.body = JSON.stringify(data[0]); //options.body = JSON.stringify(data); TODO убрать МАССИВ в data (из-за упаковки в postData?)
    //console.log(options); //TODO, values in {}, key = NULL
  } else if (method === 'get') {

  }

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
// Пример использования:
// Для GET-запроса
cF('get', 'param1', 'param2')
  .then((data) => {
    console.log('GET Response:', data);
  });

// Для POST-запроса
const postData = { key1: 'value1', key2: 'value2' };
cF('post', postData)
  .then((data) => {
    console.log('POST Response:', data);
  });
*/

//а нужна ли вообще эта функция или достаточно просто писать запрос в cF?
function sendDataToServer(text, type) {
  if (type === 'title') {
    const postData = { id: CD, title: text };
    cF("updateTaskField", 'post', postData);
    console.log("Отправка данных на сервер:", postData);
  }
  else {
    const postData = { id: CD, description: text };
    cF("updateTaskField", 'post', postData);
    console.log("Отправка данных на сервер:", postData);
  }
}


document.addEventListener('DOMContentLoaded', async function () {

  /*
    Получение тасок при загрузке страницы
  */

  try {
    let response = await fetch('/getTasks');
    let tasksData = await response.json();
    cardCreate(tasksData);
  } catch (error) {
    console.error('Error:', error);
  }

  //часть для кнопки добавления задач
  const addButton = document.querySelector('.add-button');
  // Обработчик события для кнопки "Добавить"
  addButton.addEventListener('click', () => {
    fetch('/addTasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: "1",
        title: "New task",
        description: "New text of task",
        status: "todo",
        datetime: new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '')
      })
    }).then(
      fetch('/getOneTask', { //TODO: переписать в multiF, с выборкой по самому позднему времени добавления задачи
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: "1"
        })
      }).then(response => response.json()).then(data => { cardCreate(data); console.log(data); console.log("getonetask response"); })
    );
  });

  /*
  Обновление текста в тасках
  */
  //если событие инпут, то вызываем задержку, если снова событие, то убираем задержку. Событийная модель? - каждый раз новое событие или нужно ли убирать старые?

  /*
  TIMER
  */

  const tTitle = document.querySelector('.task-title');
  const tText = document.querySelector('.task-text');
  //Переменные для хранения таймеров
  let typingTimerTitle;
  let typingTimerDesc;

  tTitle.addEventListener("input", (event) => {
    // Сбрасываем предыдущий таймер, если он существует
    clearTimeout(typingTimerTitle);
    // Устанавливаем новый таймер на 0.7 секунд после последнего ввода
    typingTimerTitle = setTimeout(function () {
      // Здесь можно выполнить отправку данных на сервер
      sendDataToServer(`${tTitle.value}`, 'title');
    }, 700);
  });

  tText.addEventListener("input", (event) => {
    clearTimeout(typingTimerDesc);
    typingTimerDesc = setTimeout(function () {
      sendDataToServer(`${tText.value}`, 'desc');
    }, 700);
  });

  /*
  End of timer
  */

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Delete') { //добавить проверку на пустоту массива
      if (confirm("Удалить таски?")) {
        selectedCards.forEach(selectedCard => {
          fetch('/rmTasks', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: getCardId(selectedCard)
            })
          })
          selectedCard.remove();
        });
        selectedCards = [];
      }
    }
  });

});
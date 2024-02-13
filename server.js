 
  function cardCreate(tasksData){
  const cardList = document.getElementById("cardList"); 
  if (cardList) {
        tasksData.forEach(task => {
  	    <!-- // Создаем новую карточку -->
             const newCard = document.createElement("div"); 
             newCard.className = "card" + ` id:${task.id}`; 
	     //newCard.classList.add(task.id);
            <!-- // Создаем заголовок карточки -->
             const cardTitle = document.createElement("span"); 
             cardTitle.className = "card-title"; 
             cardTitle.textContent = task.title; 

            <!-- // Создаем кнопку статуса карточки -->
             const statusBtn = document.createElement("div"); 
             statusBtn.className = "status-btn"; 

            <!-- // Добавляем заголовок и кнопку статуса в карточку -->
             newCard.appendChild(cardTitle); 
             newCard.appendChild(statusBtn); 

            <!-- // Добавляем новую карточку в список -->
             cardList.appendChild(newCard); 
			 console.log('Карточка добавлена!');    
  	});
  	}           
  }


  //какая-то переменная, в которой хранится id карточки нажатой ранее (или стандартной при загрузке)
  var CD = 0;

  function getCardId(card){
	  const classList = card.classList;
		    // Ищем класс, который начинается с "card" и содержит ID
		    const idClass = [...classList].find(className => className.startsWith('id:'));
			console.log(idClass);
		    if (idClass) {
		        // Разделяем строку класса для получения ID
		        const id = idClass.split(':')[1]; // Первый элемент после разделения это ID
		        console.log(`Нажата карточка с ID: ${id}`);
		        CD = id;
		        return id;
		    }
  }

function cF(route ,method, ...data) {
  const url = `/${route}`; // Замените на URL вашего сервера
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json', 
    },
  };

  if (method === 'post') {
    options.body = JSON.stringify(data[0]); //options.body = JSON.stringify(data); TODO гребаный МАССИВ в data
    //console.log(data[0]);
    console.log(options); //TODO, values in {}, key = NULL
  } else if (method === 'get') {
    // Если нужно передать данные в URL при GET-запросе, то добавьте их здесь
    // Например: url += `?param1=${data[0]}&param2=${data[1]}`;
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


document.addEventListener('DOMContentLoaded', async function() {

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
  
  //cF(/updateTaskField, post, id: getCardId(card), title: this.value)
  
 //по клику добавлять все содержимое? Тупо
  document.addEventListener('click', (event) => {
  //console.log(event.target.className);
  
  }); 
  


  //часть для кнопки добавления записей
const addButton = document.querySelector('.add-button');
// Обработчик события для кнопки "Добавить"
addButton.addEventListener('click', () => {

fetch('/addTasks', {
	method:'POST', 
	headers: {
    	'Content-Type': 'application/json'
  	},
	body: JSON.stringify({
	user_id: "1", 
	title: "New task", 
	description:"New text of task", 
	status: "todo"
		})
	}).then(
	fetch('/getOneTask', { //TODO: переписать в multiF, с выборкой по самому позднему времени добавления задачи
			method: 'POST',
			headers: {
		    	'Content-Type': 'application/json'
		  	},
			body: JSON.stringify({
			user_id: "1" 
			})
			}
				).then(response => response.json()).then(data => {cardCreate(data)})
			); 
	
});
  
  //переписать все в document.body.addEventListener('click', () => {});
  
  
  //если событие инпут, то вызываем задержку, если снова событие, то убираем задержку. Событийная модель? - каждый раз новое событие или нужно ли убирать старые?
  const tTitle = document.querySelector('.task-title');
  const tText = document.querySelector('.task-text');
  
  tTitle.addEventListener('change', (event)=>{
  //argsdata = {}; //как получить id карточки?
  console.log(CD);
  //timerT(event);
  const postData = { id: CD, title: `${event.target.value}` }; //лишние скобки TODO "[{"id":"77","title":"change"}]"
  cF("updateTaskField", 'post', postData); //"id": `${getCardId(card)}`, "title": `${event.target.value}`
    
  });
  /*
  let shouldHandleInput = true;
 //let delay = 1500;
  function timerT(input){
  	/*
  	for (var i = 0; i<=1500; i++){
		if(input){break; console.log("Break");}
		delay = delay-i;
		console.log("wait");
	}
	delay = 1500;
	console.log("done!");
	*/
	/*
	const tt = setTimeout(() => {console.log("done!")}, 1500); 
	if(input) {clearTimeout(tt); console.log("Break");}
*/	
/*
const a = tTitle.innerText;
	if (shouldHandleInput) {
	    
	    console.log(tTitle.innerText);
	    shouldHandleInput = false;
	    setTimeout(function() {
	      shouldHandleInput = true;
	    }, 1000);
	  const b = tTitle.innerText;
	  if(a===b){console.log("no!");}
	  else{
	  console.log("SERVER!");
	  }
	  }
	  
  }
  */
  
  //TODO: повесить слушателя и на текст
  
  
  //Выбор карточек для удаления
 const cards = document.querySelectorAll('.card');
 let selectedCards = [];
    // Добавляем обработчик события для каждой карточки
    cards.forEach(card => {
    
    //короткое нажатие на карточку
        card.addEventListener('click', () => {
        	//TODO: переместить весь код в блок focusin
        	//а фокус будет теряться в любом случае при нажатии на текстовое поле. 
        	//вариант - поделить пополам область фокуса - для тасок и для текста. - нереализуемо.
        	
         	//при нажатии в любом случае сначала фетчится таска, потом в нее производится запись
            	//два фетча: первый для получения таски, второй для записи.
            	// 1 - fetch multiF
            	//затем - fetch uTF
            	
            	const title = card.querySelector('.card-title');
            	const textTitle = document.querySelector('.task-title');
            	const taskText = document.querySelector('.task-text');
            	//console.log(title);
            	fetch('/multiF', { //TODO: написать функцию, по вызову которой происходит fetch с переменным числом параметров
			method:'POST', 
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({id: getCardId(card)})})
		.then(
		response => response.json()).then(
		data => { title.textContent = data[0].title; textTitle.textContent = data[0].title; taskText.textContent = data[0].description; console.log("DATA: ", data[0]); //почему возвращается массив промисов вместо одного промиса?????
		})
		.catch(
		error => {console.error('Ошибка в response: ', error)}
		);
		//обновляем данные в БД
		//TODO: убрать в change
		//onchange bool = true;
		/*
		fetch('/updateTaskField',{
			method:'POST',
			headers:{'Content-Type': 'application/json'},
			body: JSON.stringify({
			id: getCardId(card),
			title: textTitle.textContent,
			description: taskText.textContent
			})
		}).then(response => response.json())
		.then(data => console.log('Response:', data))
		.catch(error => {console.error('Ошибка в response: ', error)});
		*/
		
				 
		//card.title.textContent(taskInfo.title);
		//добавить проверку на изменение таски чтобы не делать лишних fetch
		
		//как получить инфу о таске, по которой кликнули?
		//вариант 1 - передать в качестве аргумента в функцию getonetask слово "id" и сам этот параметр от функции getCardId
		//если не нужно передавать какой-то параметр, нужно его указать в виде '', однако нужно сделать проверку на пустоту параметра и если он не пустой, добавлять запятую после него в запросе к бд	
		//если аргумент отсутствует в передаче аргументов функции, т.е. underfined, то делаем замену undefined на ''
        });
        //TODO: это не будет работать, потому что текстовое поле не является частью карточки
        /*card.addEventListener('change', () => {
        fetch('/updateTaskField',{
			method:'POST',
			headers:{'Content-Type': 'application/json'},
			body: JSON.stringify({
			id: getCardId(card),
			title: textTitle.textContent,
			description: taskText.textContent
			})
		}).then(response => response.json())
		.then(data => console.log('Response:', data))
		.catch(error => {console.error('Ошибка в response: ', error)});
        });*/
        
        //TODO: переписать выбор карточек для удаления без добавления в класс "selected"
        //долгое нажатие на карточку - выбор карточек для удаления
        card.addEventListener('mousedown', event => {
        // Запоминаем начальное время нажатия
        const startTime = new Date().getTime();
        
        const timeout = setTimeout(() => {
            // Если нажатие длилось более 500 мс, выделяем или убираем выделение
            if (!selectedCards.includes(card)) {
                card.classList.add('selected');
                selectedCards.push(card);
            } else {
                card.classList.remove('selected');
                selectedCards = selectedCards.filter(selectedCard => selectedCard !== card);
            }
        }, 500);

        // При отпускании кнопки мыши или перемещении курсора, сбрасываем таймер
        const clearSelection = () => {
            clearTimeout(timeout);
            document.removeEventListener('mouseup', clearSelection);
            card.removeEventListener('mousemove', clearSelection);
        };

        document.addEventListener('mouseup', clearSelection);
        card.addEventListener('mousemove', clearSelection);
    	});
     
    });
//доработать, переместить в блок выше        
document.addEventListener('keydown', (event) => {
  if (event.key === 'Delete') {
  	if(confirm("Удалить таски?")){
  	selectedCards.forEach(selectedCard => {
	    	fetch('/rmTasks', {
			method:'DELETE', 
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
//TODO: УБРАТЬ ибо дублирование, + потом будет происходить автоматически.        
/*
const title = document.querySelector('.task-title');

title.addEventListener("keydown", (event) => {
if(document.activeElement === title){
  if (event.key === 'Enter'){
  var text = title.textContent;
  console.log(text);
  title.blur();
  //не надо делать в services мультифункцию, нужно просто обращаться по маршруту multiF с нужным набором компонентов fetch
  fetch('/updateTaskFields', {
			method: 'POST',
			headers: {
		    	'Content-Type': 'application/json'
		  		},
			body: JSON.stringify({
			user_id: "1",
			id: `${getCardId()}`,
			title: `${text}`
			//description: `${}`,
			//status: ``
				})
			}
		);
 	}
  }
});
 
*/
//TODO: при фокусировке на таске сделать выделение ее в виде смены цвета с "утапливанием вглубь"
//а вот функция focused нужна для определния таски, на которую нажали
  
/*card.addEventListener("focusin", () => {
  console.log("focused");
  //делается проверка существования в classList элемента focused
  
}); */
        //конец domContentLoaded


}); 
  





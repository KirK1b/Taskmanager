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

  function getCardId(card){
	  const classList = card.classList;
		    // Ищем класс, который начинается с "card" и содержит ID
		    const idClass = [...classList].find(className => className.startsWith('id:'));
			console.log(idClass);
		    if (idClass) {
		        // Разделяем строку класса для получения ID
		        const id = idClass.split(':')[1]; // Первый элемент после разделения это ID
		        console.log(`Нажата карточка с ID: ${id}`);
		        return id;
		    }
  }

document.addEventListener('DOMContentLoaded', async function() {

/*
  Получение тасок при загрузке страницы
*/

  try {
    let response = await fetch('/getTasks'); 
    let tasksData = await response.json();
    cardCreate(tasksData);
  } catch (error) {
    console.error('Ошибка:', error);
  }
  
/*
Тестовая функция для проверки работы buildDynamicSQLQuery
*/
 async function multiF(user_id, id, title, description, status){
	 try{ //через нее и получение данных должно работать
	 /*if(id === null){
	 id = "";
	 }
	 if(status === null){
	 status = "todo";
	 }
	 */
	 let response = await fetch('/multiF', {
						method: 'POST',
						headers: {
					    	'Content-Type': 'application/json'
					  	},
						body: JSON.stringify({
						user_id: "1",
						title: `${title}`,
						description: `${description}`,
						status: `${status}`
						})
					}
				);
		  //let Data = await response.json();
		  //console.log(Data);
		  
	 }catch(error){
	 console.error('buildDynamicSQLQuery: ', error);
	 }
 }
 
  async function getonetask(){
	  try{
	  console.log('goonetask');
	  let response = await fetch('/getOneTask', {
					method: 'POST',
					headers: {
				    	'Content-Type': 'application/json'
				  	},
					body: JSON.stringify({
					user_id: "1" 
					})
				}
			);
	  let taskData = await response.json();
	  //console.log(taskData);
	  return taskData;
	  //cardCreate(taskData);
	  } catch (error) {
	    console.error('Ошибка:', error);
	  }
  }  
  
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
	fetch('/getOneTask', {
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
  
  //Выбор карточек для удаления
 const cards = document.querySelectorAll('.card');
 let selectedCards = [];
    // Добавляем обработчик события для каждой карточки
    cards.forEach(card => {
    
    //короткое нажатие на карточку
        card.addEventListener('click', () => {
         	//при нажатии в любом случае сначала фетчится таска, потом в нее производится запись
            	//два фетча: первый для получения таски, второй для записи.
            	//затем - fetch multiF
            	const title = card.querySelector('.card-title');
            	//console.log(title);
            	fetch('/multiF', {
			method:'POST', 
			headers: {
		    	'Content-Type': 'application/json'
		  	},
			body: JSON.stringify({
			id: getCardId(card) 
			})
		}).then(response => response.json()).then(data => {title.textContent = data.title; console.log("DATA: " + data);});//Неработает
		
		//card.title.textContent(taskInfo.title);
		//добавить проверку на изменение таски чтобы не делать лишних fetch
		//multuF нельзя использовать для обновления тасок(
		
		//boolean изменений к каждой таске, чтобы не вызывать бесконечно fetch
		
		//как получить инфу о таске, по которой кликнули?
		//вариант 1 - передать в качестве аргумента в функцию getonetask слово "id" и сам этот параметр от функции getCardId
		//если не нужно передавать какой-то параметр, нужно его указать в виде '', однако нужно сделать проверку на пустоту параметра и если он не пустой, добавлять запятую после него в запросе к бд	
		//если аргумент отсутствует в передаче аргументов функции, т.е. underfined, то делаем замену undefined на ''
		//вариант 2 - написать новую функцию для этого (геморрой и бред, и так много всего)
        });
        
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
  

//а вот функция focused нужна для определния таски, на которую нажали
  
//title.addEventListener("focusin", () => {
//  console.log("focused");
  //делается проверка существования в classList элемента focused
  
//});
        //конец domContentLoaded
}); 
  





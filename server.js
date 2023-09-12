//клиентская сторона сервера, код как-бы "вставляется" в сайт при подключении этого файла 

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

  try {
    let response = await fetch('/getTasks'); 
    let tasksData = await response.json();
    cardCreate(tasksData);
  } catch (error) {
    console.error('Ошибка:', error);
  }
  
  async function getonetask(){
  try{
  console.log('goonetrask');
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
  console.log(taskData);
  cardCreate(taskData);
  } catch (error) {
    console.error('Ошибка:', error);
  }
  }  
  
  //часть для кнопки добавления записей
const addButton = document.querySelector('.add-button');
// Обработчик события для кнопки "Добавить"
addButton.addEventListener('click', () => {
	(function(){
	
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
	});
	
	}());
	
	(function(){
	getonetask();
	}());
	//.then(
	//fetch('/getOneTask', {
	//		method: 'POST',
	//		headers: {
	//	    	'Content-Type': 'application/json'
	//	  	},
	//		body: JSON.stringify({
	//		user_id: "1" 
	//		})
	//		}
	//			).then(response => response.json()).then(data => {cardCreate(data)})
	//		); 
	//let taskData = response.json(); 
	//cardCreate(taskData);
});
  
 
 const cards = document.querySelectorAll('.card');
 let selectedCards = [];
    // Добавляем обработчик события для каждой карточки
    cards.forEach(card => {
    
    //короткое нажатие на карточку
        card.addEventListener('click', () => {
         	getCardId(card);
            // Дополнительные действия, которые вы хотите выполнить
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
        

        //конец domContentLoaded
}); 
  





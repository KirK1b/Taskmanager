const addButton = document.querySelector('.add-button');
const sortButton = document.querySelector('.sort-button');
const dropdownContent = document.querySelector('.dropdown-content');

// Обработчик события для кнопки "Добавить"
addButton.addEventListener('click', () => {
  // Ваш код для добавления карточки
  console.log('Карточка добавлена!');
});

// Обработчик события для кнопки сортировки (открытие/закрытие выпадающего списка)
sortButton.addEventListener('click', () => {
  dropdownContent.classList.toggle('show');
});

// Закрываем выпадающий список, если клик был за его пределами
document.addEventListener('click', (event) => {
  if (!event.target.closest('.dropdown-container')) {
    dropdownContent.classList.remove('show');
  }
});
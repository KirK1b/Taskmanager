const mysql = require('mysql');

const dbConfig = {
    host: '0.0.0.0', // Или IP-адрес Docker-контейнера
    port: '33060',
    user: 'nuser',
	database: 'task_manager',
    password: '0' // Пароль для MySQL контейнера
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
    } else {
        console.log('Подключено к базе данных MySQL');
    }
});

module.exports = connection;

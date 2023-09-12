const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 3000;
const taskQuery = require('./routes/tasks'),
	  UsersService = require('./users.service'),
	  routes = require('./routes/routes.js'); //проблема в маршрутизаторе

app.use('/', routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'taskmanager')));
//переписать на routes(app);
//app.get('/getTasks', async (req, res) => {
 

app.get('/', function(request, response){
	response.sendFile(__dirname + '/mainpage.html');
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});



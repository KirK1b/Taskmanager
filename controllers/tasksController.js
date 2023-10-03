const express = require('express');
const router = express.Router();
const db = require('../db');
const taskQuery = require('../routes/tasks.js');
//файл нужен, чтобы взаимодействовать с базой данных через service, передавая туда данные от клиента (текст + статусы)
//пока реализовать просто добавление задач со стандартным статусом
const DatabaseHandler = require('../services/datagetter');

class UsersController {
	getTasks(req, res) {
		DatabaseHandler.getT()
		  .then(result => {
		    //console.log('Результат запроса:', result);
		    res.json(result);
		  })
		  .catch(error => {
		    console.error('Ошибка:', error);
		  });
	}
	
	addTasks(req, res){
		DatabaseHandler.addT(req.body.user_id, req.body.title, req.body.description, req.body.status);
	}
	
	rmTasks(req, res){
		DatabaseHandler.rmT(req.body.id);
	}
	
	getOneTask(req, res){
		const result = DatabaseHandler.getOneT(req.body.user_id).then(result => {
		    //console.log('Результат запроса:', result);
		    res.json(result);
		  })
		  .catch(error => {
		    console.error('Ошибка:', error);
		  });
	}
	//WIP
	multiF(req, res){
		DatabaseHandler.multiF(req.body)
		.then(result => {
		res.json(result);
		})
		.catch(error => {
		console.error('Ошибка:', error);
		});
	}
	
	uTF(req, res){
		DatabaseHandler.uTF(req.body)
		.then(result => {res.json(result);}).catch(error => {console.error('Ошибка:', error);});
	}
}

module.exports = new UsersController();


/*
	const keys = Object.keys(req.body);
	const values = Object.values(req.body);
	console.log(keys);
	console.log(values);
	*/

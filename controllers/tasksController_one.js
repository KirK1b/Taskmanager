const express = require('express');
const router = express.Router();
const db = require('../db');
const taskQuery = require('../routes/tasks.js');
const services = require('../services/datagetter');
//файл нужен, чтобы взаимодействовать с базой данных через service, передавая туда данные от клиента (текст + статусы)
//пока реализовать просто добавление задач со стандартным статусом

module.exports = {
		//callback возвращал err или result в зависимости от выполнения запроса к бд
	getTasks: function(req, res) {
		try {
	    const tasksData = taskQuery((err, result) => {
	      if (err) {
		return res.status(500).json({ error: 'Internal Server Error' });
	      }
	      res.json(result); // Отправляем данные в JSON формате
	    });
	  } catch (error) {
	    res.status(500).json({ error: 'Internal Server Error' });
	  }	
	},

//	getTasks: function(req, res){
//	let result = services.getT();
//	console.log(result);
//	res.json(result);
//	},
	
	addTasks: function(req, res){
	services.addT(req.body.user_id, req.body.title, req.body.description, req.body.status);
	},
	
	rmTasks: function(req, res){
	services.rmT(req.body.id);
	},
	
	getOneTask: function(req, res){
	const result = services.getOneT(req.body.user_id);
	res.json(result);
	},
	
	multiF: function(req, res){
	const keys = Object.keys(req.body);
	console.log(keys);
	}
	
}


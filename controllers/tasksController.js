const express = require('express');
const router = express.Router();
const db = require('../db');
const DatabaseHandler = require('../services/datagetter');

class UsersController {
	getTasks(req, res) {
		DatabaseHandler.getT()
			.then(result => {
				res.json(result);
			})
			.catch(error => {
				console.error('Ошибка:', error);
			});
	}

	addTasks(req, res) {
		DatabaseHandler.addT(req.body.user_id, req.body.title, req.body.description, req.body.status, req.body.datetime);
	}

	rmTasks(req, res) {
		DatabaseHandler.rmT(req.body.id);
	}

	getOneTask(req, res) {
		const result = DatabaseHandler.getOneT(req.body.user_id).then(result => {
			res.json(result);
		})
			.catch(error => {
				console.error('Ошибка:', error);
			});
	}

	multiF(req, res) {
		DatabaseHandler.multiF(req.body)
			.then(result => {
				res.json(result);
			})
			.catch(error => {
				console.error('Ошибка:', error);
			});
	}

	uTF(req, res) {
		DatabaseHandler.uTF(req.body)
			.then(result => { res.json(result); }).catch(error => { console.error('Ошибка:', error); });
	}
}

module.exports = new UsersController();
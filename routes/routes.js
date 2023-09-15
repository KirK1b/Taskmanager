const express = require('express'),
    path = require('path'),  // Добавлен импорт модуля path
    router = express.Router(),
    tasksController = require('../controllers/tasksController');

router.use(express.json()); 

router.route('/getTasks').get(tasksController.getTasks);
router.route('/getOneTask').post(tasksController.getOneTask);
router.route('/addTasks').post(tasksController.addTasks);
router.route('/rmTasks').delete(tasksController.rmTasks);
router.route('/ChangeTitle').post();
//WIP
router.route('/multiF').post(tasksController.multiF);

module.exports = router;


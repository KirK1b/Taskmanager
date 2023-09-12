const express = require('express');
const router = express.Router();
const db = require('../db');

console.log(`Точка запуска скрипта`);

module.exports = (callback) => {
  const sqlQuery = 'SELECT * FROM tasks';

  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Ошибка выполнения SQL-запроса:', err);
      callback(err, null);
      return;
    }

    callback(null, result);
  });
};

//module.exports = router;

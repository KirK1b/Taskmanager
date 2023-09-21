const express = require('express');
const db = require('../db');

console.log(`Точка запуска скрипта`);

class DatabaseHandler {
  constructor() {
    // Инициализация класса, если необходимо
  }

  static getT() {
    const sqlQuery = 'SELECT * FROM tasks';

    return new Promise((resolve, reject) => {
      db.query(sqlQuery, (err, result) => {
        if (err) {
          console.error('Ошибка выполнения SQL-запроса:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static addT(user_id, title, description, status) {
    const sqlQuery = `INSERT INTO tasks (user_id, title, description, status) VALUES ('${user_id}', '${title}', '${description}', '${status}');`;

    return new Promise((resolve, reject) => {
      db.query(sqlQuery, (err, result) => {
        if (err) {
          console.error('Ошибка выполнения SQL-запроса:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static rmT(id) {
    const sqlQuery = `DELETE FROM tasks WHERE id = ${id};`;

    return new Promise((resolve, reject) => {
      db.query(sqlQuery, (err, result) => {
        if (err) {
          console.error('Ошибка выполнения SQL-запроса:', err);
          reject(err);
        } else {
          resolve('OK');
        }
      });
    });
  }

  static getOneT(user_id) {
    const sqlQuery = `SELECT * FROM tasks WHERE user_id=${user_id} ORDER BY lastModified DESC LIMIT 1;`;

    return new Promise((resolve, reject) => {
      db.query(sqlQuery, (err, result) => {
        if (err) {
          console.error('Ошибка выполнения SQL-запроса:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

//WIP -  добавть такую же функцию только для перезаписи тасок
  static multiF(data) { //buildDynamicSQLQuery
    let keys = Object.keys(data);
    let values = Object.values(data);

    let sqlQuery = 'SELECT * FROM tasks WHERE ';
    let sqlValues = []; //was const

    for (let i = 0; i < keys.length; i++) {
      sqlQuery += `${keys[i]} = ?`;
      sqlValues.push(values[i]);

      if (i < keys.length - 1) {
        sqlQuery += ' AND ';
      }
    }

    return new Promise((resolve, reject) => {
      db.query(sqlQuery, sqlValues, (err, results) => {
        if (err) {
          console.error("Error executing query:", err);
          reject(err);
        } else {
          console.log("Query results:", results);
          resolve(results);
        }
      });
    });
  }
  
  static updateTaskFields(taskId, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (keys.length === 0) {
    return Promise.reject("No fields to update.");
  }

  let sqlQuery = 'UPDATE tasks SET ';
  let sqlValues = [];

  for (let i = 0; i < keys.length; i++) {
    sqlQuery += `${keys[i]} = ?`;
    sqlValues.push(values[i]);

    if (i < keys.length - 1) {
      sqlQuery += ', ';
    }
  }

  sqlQuery += ' WHERE id = ?'; 

  sqlValues.push(taskId);

  return new Promise((resolve, reject) => {
    db.query(sqlQuery, sqlValues, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        reject(err);
      } else {
        console.log("Update results:", results);
        resolve(results);
      }
    });
  });
}
  
}

module.exports = DatabaseHandler;

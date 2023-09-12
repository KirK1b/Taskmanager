const express = require('express');
const db = require('../db');

console.log(`Точка запуска скрипта`);

function database(sqlQuery){
db.query(sqlQuery, (err, result) => {
		if (err) {
		      console.error('Ошибка выполнения SQL-запроса:', err);
		      //callback(err, null);
		      return;
		    }
		    return result;
		});
}

module.exports = {

        getT: function(){
	  const sqlQuery = 'SELECT * FROM tasks'; 
	  
	  db.query(sqlQuery, (err, result) => {
	    if (err) {
	      console.error('Ошибка выполнения SQL-запроса:', err);
	      //callback(err, null); //колбэк нужен, чтобы в функцию getT передался результат выполнения стрелочной функции
	      return;
	    }
		
	    //callback(null, result);
	    return result;
	  });
 	},
  
  	addT: function(user_id, title, description, status){

  	const sqlQuery = `insert into tasks (user_id, title, description, status) VALUES ('${user_id}', '${title}', '${description}', '${status}');`; //` вместо '
	  db.query(sqlQuery, (err, result) => {
	    if (err) {
	      console.error('Ошибка выполнения SQL-запроса:', err);
	      //callback(err, null);
	      return;
	    }
	
	    //callback(null, result);
	    return result;
	  });
 	},
  
	rmT: function(id){
	const sqlQuery = `delete from tasks where id = ${id};`;
	db.query(sqlQuery, (err, result) => {
		if (err) {
		      console.error('Ошибка выполнения SQL-запроса:', err);
		      //callback(err, null);
		      return;
		    }
		    return 'OK';
		});
	},
	
	//выбор последней созданной записи для конкретного пользователя
	getOneT: function(user_id){//добвить обработку сложного id таски в совокупности с user_id
	const sqlQuery = `select * from tasks where user_id=${user_id} order by lastModified desc limit 1;`;
	//return database(sqlQuery);
	db.query(sqlQuery, (err, result) => {
		if (err) {
		      console.error('Ошибка выполнения SQL-запроса:', err);
		      //callback(err, null);
		      return;
		    }
		    return result;
		});
	//console.log('returned' + ' ');
	},
	
	
	multiF: function buildDynamicSQLQuery(data) {
	  const keys = Object.keys(data);
	  const values = Object.values(data);

	  let sqlQuery = 'SELECT * FROM table WHERE ';
	  const sqlValues = [];

	  for (let i = 0; i < keys.length; i++) {
	    sqlQuery += `${keys[i]} = ?`;
	    sqlValues.push(values[i]);
	    
	    if (i < keys.length - 1) {
	      sqlQuery += ' AND ';
	    }
	  }

	  connection.query(sqlQuery, sqlValues, (err, results) => {
	    if (err) {
	      console.error("Error executing query:", err);
	    } else {
	      console.log("Query results:", results);
	    }
	  });
	}
	

}



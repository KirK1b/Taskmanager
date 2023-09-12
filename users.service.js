const tasksQuery = require('./routes/tasks');

class UsersService {
    getUsers() {
        return new Promise((res, rej) => {
			tasksQuery((err, result) => {
			if (err) {
			  res.status(500).send('Ошибка получения данных');
			  return;
			}
			return res(result);
			});
        });
    }

}

module.exports = new UsersService();

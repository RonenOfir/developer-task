const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.all('SELECT * FROM users', [], (err, rows) => {
  if (err) {
    throw err;
  }
  console.log('User list:', rows);
  db.close();
});


db.all("UPDATE users SET status = 'Deleted' WHERE id = 3", [], function(err) {
  if (err) {
    throw err;
  }
  console.log('User with id=3 status updated to Deleted');
});




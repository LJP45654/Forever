import mysql from 'mysql2';
import dbConfig from '../config/db.js';


const connection = mysql.createConnection(dbConfig);

connection.connect(error => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
  console.log('Successfully connected to the database.');
});


export function query(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

export default connection;
const mysql = require('mysql2');

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'anpanproj',
    port: 3307,
};

console.log('Connecting to MySQL...');
console.log(`Host: ${dbConfig.host}:${dbConfig.port}`);
console.log(`Database: ${dbConfig.database}`);

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:');
        console.error('Code:', err.code);
        console.error('Message:', err.message);

        if (err.code === 'ECONNREFUSED') {
            console.error('MySQL not running or wrong port!');
            console.error('Check XAMPP and verify MySQL is on port 3307');
        }
        return;
    }

    console.log('Connected to MySQL database successfully!');

    db.query('DESCRIBE anpanusers', (err, result) => {
        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                console.error('Table "anpanusers" does not exist!');
            } else {
                console.error('Table check failed:', err.message);
            }
            return;
        }

        console.log('Table "anpanusers" found');
        console.log('Columns:', result.map(col => col.Field).join(', '));

        db.query('SELECT COUNT(*) as count FROM anpanusers', (err, result) => {
            if (!err) {
                console.log(` Users in database: ${result[0].count}`);
            }
        });
    });
});


db.on('error', (err) => {
    console.error('Database error:', err.code, err.message);
});

module.exports = db;
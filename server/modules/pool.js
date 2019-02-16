const pg = require('pg');

const pool = pg.Pool({ 
    host: 'localhost',
    port: 5432, 
    database: ' weekend-to-do-app',
    max: 10, 
    idleTimeoutMillis: 30000 
});

pool.on('connect', () => {
    console.log('Postgresql connected');
});

pool.on('error', () => {
    console.log('Error with postgres pool', error);
});

module.exports = pool;
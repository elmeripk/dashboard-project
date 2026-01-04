import http from 'http';
require('dotenv').config();

const { handleRequest } = require('./router.js');
const PORT = 5000;
const HOSTNAME = 'localhost';

const server = http.createServer(handleRequest).listen(PORT,HOSTNAME);

server.on('error', err => {
    console.error(err);
    server.close();
});



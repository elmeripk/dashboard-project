const http = require('http');
const PORT = 3000;
const HOST = "localhost";

const server = http.createServer((req, res) =>{
    res.write("jee");
    res.end();
})
.listen(PORT, HOST);

server.on('error', err => {
    console.error(err);
    server.close();
});

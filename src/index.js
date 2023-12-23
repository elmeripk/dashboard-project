const http = require('http')

const port = 5000;
const hostname = 'localhost';

server = http.createServer(function (req, res) { 
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Testing');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

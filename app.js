const http = require("http");
const PORT = 8080;

// a function which handles requests and sends response
const requestHandler = function(request, response) {
  console.log('In requestHandler');
  response.end(`Requested Path: ${request.url}\nRequest Method: ${request.method}`);
};

const server = http.createServer(requestHandler);
console.log('Server created');

server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});

console.log('Last line (after .listen call)');
var http = require('http'),
    os = require('os');

var ifaces = os.networkInterfaces();
var identity = '';
Object.keys(ifaces).forEach(function (ifname) {
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) return;
    identity = identity + '[' + (iface.address) + '] ';
  });
});

var server = http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  var message = 'I\'m Riversong, I hate you from ' + identity + '.';
    
  response.end('<html><body>' + message + '</body></html>');
});

server.listen(8888);

console.log('Riversong initialized on port 8888.');

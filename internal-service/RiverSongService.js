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
  response.writeHead(200, {'Content-Type': 'application/json'});
  var content = {
      name : 'Dr River Song',
      photo: 'https://upload.wikimedia.org/wikipedia/en/3/3f/River_Song_Doctor_Who.png',
      position: 'Archaeologist',
      message : 'I hate you.',
      identity: identity
  };
    
  response.end(JSON.stringify(content));
});

server.listen(8888);

console.log('Riversong initialized on port 8888.');

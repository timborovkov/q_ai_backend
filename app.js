var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser')
var mysql = require('mysql');
var request = require('ajax-request');
const crypto = require('crypto');
var ml = require('machine_learning');

var port = process.env.PORT || 3000;

var db = mysql.createConnection({
  host     : 'eu-cdbr-azure-north-d.cloudapp.net',
  user     : 'b2a32c755154bf',
  password : 'c0b4e78d',
  database : 'anspiritMain'
});

app.use(bodyParser.json());
app.get('/', function(req, res){
  res.send('<h1>This is server of Q AI brains.</h1>Anspirit Company Official Server<br><a href="http://anspirit.org"><h2>Go here!</h2></a>');
});

app.get('/test', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  var ip = getClientAddress(req);
  var secret = req.query.secret;
  res.send(JSON.stringify({done: true, ip: ip}));
  /*
  db.connect();
  db.query("SELECT * FROM `hub_list` WHERE `ip`='" + ip + "'", function(err, rows, fields) {
    if (err) throw err;
  });
  */
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(port, function(){
  console.log('listening on ' + port);
});

// Get client IP address from request object
function getClientAddress(req) {
  var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
  return ip;
};

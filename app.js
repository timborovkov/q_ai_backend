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
  res.send('<h1>This is server of Q AI brains.</h1>Anspirit Company Official Server');
});

//Setup new QHUB on server and database
app.get('/newHub', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  var ip = getClientAddress(req);
  var secret = req.query.secret;
  var hubName = req.query.hubName;
  var latitude = req.query.latitude;
  var longitude = req.query.longitude;
  if(secret == null || hubName == null || latitude == null || longitude == null){
    console.log("No input");
    //No input from user
    res.send(JSON.stringify({done: false, error: 'no input data from user'}));
  }else{
    db.connect();
    db.query("SELECT * FROM `hub_list` WHERE `ip`='" + ip + "'", function(err, rows, fields) {
      if (err) throw err;
      if(rows.length == 0){
        var query =
        "INSERT INTO `hub_list` (`ip`, `secret`, `name`, `latitude`, `longitude`) VALUES ('" + ip + "', " + secret + ", '" + hubName + "', " + latitude + ", " + longitude + ")";
        console.log(query);
        db.query(query, function(err, rows, fields) {
          if (err) throw err;
          //Done
          res.send(JSON.stringify({done: true}))
        });
        db.end();
      }else{
        //Already exist
        res.send(JSON.stringify({done: false, error: 'hub already exist'}));
      }
    });
  }
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

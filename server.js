const express = require ('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use('/static', express.static('public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/server', function(req, res){
  res.sendFile(__dirname + '/server.html');
});
var Htime=0;
var epN=1;
var rooms={};
var rCount=0;
var episode='';
io.on('connection', function(socket){
  socket.on('response', function(msg){
    switch(msg.type){
      case "ss":
        msg.type="sst";
        io.emit('message',msg);
        Htime=msg.data.time;
        break;
      case "getTime":
        var ext={type:"hostTime",data:{time:Htime,src:episode}};
        io.emit('message',ext);
        break;
      case "seek":
        Htime=msg.data.time;
        io.emit('message',{type:"hostTime",data:{time:Htime}});
        break;
      case "srcNext":
        episode=msg.data;
        io.emit('message',{type:"src",data:{src:episode}})
        Htime=0;
        break;
      case "this":
        
        break;
    }
  });
});
 let serverPort=8088;
// inicia o servidor na porta informada, no caso vamo iniciar na porta 3000
http.listen(serverPort, function(){
  console.log('Servidor rodando em: http://localhost:'+serverPort);
});
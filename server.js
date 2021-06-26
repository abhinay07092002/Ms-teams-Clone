var express =require ('express')
var app = express(); 
var server = require('http').Server(app); 
var io= require('socket.io')(server);
app.use(express.static('public'))
app.set('view engine','ejs');

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', function(socket){
    socket.on('chat', function(data){
        socket.broadcast.emit('chat', data)
    });

});

server.listen(3000);
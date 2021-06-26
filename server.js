var express =require ('express')
var app = express(); 
var server = require('http').Server(app); 
var io= require('socket.io')(server);
var port = process.env.PORT || 3000;
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

server.listen(port);
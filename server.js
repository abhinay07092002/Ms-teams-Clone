var express =require ('express'); //Requiring Express

var app = express(); //Initializing an express app

var server = require('http').Server(app); //the server to listen for

var io= require('socket.io')(server); //initializing socket.io

var port = process.env.PORT || 3000; //The port on which our app will be listening upon

app.use(express.static('public')); //Directory to look for while checking images/styling css files

app.set('view engine','ejs'); //Look for ejs files when asked to render a file and these will be in views directory

//hitting on / route our application calls various functionalities of this application
app.get('/', function(req, res){

    res.render('index');
});


//Server getting a message from client side and emitting it in such a way that it reaches to all except the sender

io.on('connection', function(socket){
    
    // call for sending chat to all client except sender

    socket.on('chat', function(data){

        socket.broadcast.emit('chat', data);
    });
    
    // one another such call for handling chat functionality
    
    socket.on('temp',function(){

        socket.broadcast.emit('temp');
    })
    
    // call for drawing on other clients from the sending client

    socket.on('draw',function(data){

        socket.broadcast.emit('draw',data);
    })
    
    // call from client to server to update mouse pointer

    socket.on('avoidDiscrepancy',function(data){

        socket.broadcast.emit('avoidDiscrepancy',data);
    })
});

//listening to initialized port number
server.listen(port);
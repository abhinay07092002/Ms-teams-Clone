var express=require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
app.set('view engine','ejs')
app.use(express.static('public'));

app.get('/',function(req,res){

    res.render('index');
})
io.on('connection',function(socket){
    
    socket.on('deliveringTheMessage',function(data){

        io.sockets.emit('ReceivingTheMessage',data)

    });
});
server.listen(3000);

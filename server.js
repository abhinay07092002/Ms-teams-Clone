var express=require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
app.set('view engine','ejs')
app.use(express.static('public'));

app.get('/',(req,res)=>{

    res.render('index');
})
io.on('connection',(socket)=>{
    
    socket.on('deliveringTheMessage',(data)=>{

        io.sockets.emit('ReceivingTheMessage',data)

    });
});
server.listen(3000);

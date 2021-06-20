var socket=io();
var sender=document.getElementById('sender');
var chat=document.getElementById('message');
var output=document.getElementById('keepRight');
var button=document.getElementById('ok');
button.addEventListener('click',()=>{
    socket.emit('deliveringTheMessage',{
        sender: sender.value,
        chat: chat.value
    })
});
socket.on('ReceivingTheMessage',(data)=>{
    
    output.innerHTML += '<p>' + '<strong>'+data.sender+": "+'</strong>' +data.chat+ " "+'</p> ';

});



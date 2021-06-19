var socket=io();
var sender=document.getElementById('sender');
var chat=document.getElementById('message');
var output=document.getElementById('keepRight');
var button=document.getElementById('ok');
button.addEventListener('click',function(){
    socket.emit('deliveringTheMessage',{
        giver: sender.value,
        given: chat.value
    })
});
socket.on('ReceivingTheMessage',function(data){
    
    output.innerHTML += '<p>' + '<strong>'+data.giver+" "+'</strong>' +data.given+ " "+'</p>';

});



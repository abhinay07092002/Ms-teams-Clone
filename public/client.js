var socket = io(); 
var message = document.getElementById('message');
var button =  document.getElementById('send');
var output = document.getElementById('receivedMessages');
var conn;
var peer_id=-1;
var peer = new Peer();

button.addEventListener('click', function(){
    if(peer_id!=-1) output.innerHTML += '<p> <strong>' + "You :" +  '</strong>' + message.value + '</p>';

    socket.emit('chat', {
        message: message.value,
    })
}) 
socket.on('chat', function(data){
    if(peer_id!=-1) output.innerHTML += '<p> <strong>' + "Person 2" + ': </strong>' + data.message + '</p>';
})

function getmymedia(callbacks){
    navigator.mediaDevices.getUserMedia=navigator.getUserMedia||navigator.webKitGetUserMedia||navigator.mozGetUserMedia;

    var constraints={
        audio:true,
        video:true
    }

    navigator.mediaDevices.getUserMedia(constraints,callbacks.success)
}

function receiveStream(stream,elemid){

    var video=document.getElementById(elemid);

    video.srcObject=stream;

    window.peer_stream=stream;

}
getmymedia({
    success:function(stream){

        window.localstream=stream;

        receiveStream(stream,'myvideo');
    },
    error: function(err){

         console.log("Error is " +err);

    }
})
peer.on('open',function(){

    alert("Your id is "+peer.id+" .Use it to get connected");

})

document.getElementById('connect').addEventListener('click',function(){

    peer_id=document.getElementById('connid').value;

    conn=peer.connect(peer_id);

})

document.getElementById('call').addEventListener('click',function(){

    var call=peer.call(peer_id,window.localstream);

    call.on('stream',function(stream){

        window.peer_stream=stream;

        receiveStream(stream,'hisvideo');
    })

    call.on('close',function(stream){

        window.okToSend=false;

    })
})



peer.on('connection',function(connection){

    conn=connection;

    peer_id=connection.peer;

    document.getElementById('connid').value=peer_id;

})

peer.on('call',function(call){

    call.answer(window.localstream);

    call.on('stream',function(stream){

        window.peer_stream=stream;

        receiveStream(stream,'hisvideo')
    })
})
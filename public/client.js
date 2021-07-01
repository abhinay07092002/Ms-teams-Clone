var socket = io(); 
var message = document.getElementById('message');
var button =  document.getElementById('send');
var output = document.getElementById('receivedMessages');
var videoOnOff=document.getElementById('videoOnOff');
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

var constraints={
    audio:true,
    video:true
}
let myVideoStream
navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {

    myVideoStream=stream;

    window.localstream=stream;

    receiveStream(stream,'myvideo');

})
.catch(function(err) {

     console.log(err);
     
});
function receiveStream(stream,elemid){

    var video=document.getElementById(elemid);

    video.srcObject=stream;

    window.peer_stream=stream;

}
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

videoOnOff.addEventListener('click',function(){

    let videoEnabled = myVideoStream.getVideoTracks()[0].enabled;
    if (videoEnabled) 
    {
       videoOnOff.innerHTML='<img src="vidoff.jpg" width="40px" height="40px">';

       myVideoStream.getVideoTracks()[0].enabled = false;

    } 
    else
    {
      videoOnOff.innerHTML='<img src="vid.png" width="40px" height="40px">';

      myVideoStream.getVideoTracks()[0].enabled = true;

    }
})

audioOnOff.addEventListener('click',function(){

    let audioEnabled = myVideoStream.getAudioTracks()[0].enabled;

    if (audioEnabled)
    {
      audioOnOff.innerHTML='<img src="audoff.jpg" width="40px" height="40px">';

      myVideoStream.getAudioTracks()[0].enabled = false;
 
    } 
    else 
    {
     audioOnOff.innerHTML='<img src="aud.jpg" width="40px" height="40px">';

      myVideoStream.getAudioTracks()[0].enabled = true;
    }
})
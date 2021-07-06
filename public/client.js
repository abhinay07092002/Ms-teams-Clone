var socket = io(); //socket.io got intact here

var message = document.getElementById('message');//place of message accessed through DOM

var button =  document.getElementById('send');//send button accessed through DOM

var output = document.getElementById('receivedMessages');//div to store messages accessed through DOM

var videoOnOff=document.getElementById('videoOnOff'); //handling switching on and switching off the audio

var conn;//variable for peer connection

var peer_id=-1;//our peer_id initialized to -1 so that we cannot send message until we are connected to a peer

var peer = new Peer();//dynamic initialization of peer

//when send button is pressed this below segment of code gets activated and perform sending of message to server side from client side 
button.addEventListener('click', function(){
    if(message.value!="") output.innerHTML += '<p style="color:white"> <strong>' + "You :" +  '</strong>' + message.value + '</p>';

    socket.emit('chat', {

        message: message.value,
    })

    message.value="";
}) 

//when receiving a message from server side ,perform the followong action
socket.on('chat', function(data){

    if(data.message!="") {

        output.innerHTML += '<p style="color:white"> <strong>' + "Person 2" + ': </strong>' + data.message + '</p>';
    }
})

document.getElementById('leave').addEventListener('click',function(){ 
    if(peer_id!=-1){  

       socket.emit('temp');

       window.location.reload();  
    }
})
socket.on('temp',function(){

    window.location.reload();  
})

//Taking our video and audio permissions 
var constraints={

    audio:true,

    video:true
}

let myVideoStream //a global variable to keep our stream

//accessing our media and diaplaying it on the screen
navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {

    myVideoStream=stream;

    window.localstream=stream;

    receiveStream(stream,'myvideo');

})
.catch(function(err) {

     console.log(err);
     
});


//our screen sharing permissions
var displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio:true
};

//displaying our screen and so on and so forth
document.getElementById('screenShare').addEventListener('click',function(){
    navigator.mediaDevices.getDisplayMedia(displayMediaOptions)

    .then(function (stream) {
    
      window.localstream=stream;

      receiveStream(stream,'myvideo');

      var call=peer.call(peer_id,window.localstream);

      call.on('stream',function(stream){

         window.peer_stream=stream;

         receiveStream(stream,'hisvideo');
      })

      stream.getVideoTracks()[0].onended=function()
      {

        stream=myVideoStream;
            
        window.localstream=stream;

        receiveStream(stream,'myvideo');

        call=peer.call(peer_id,window.localstream);

        call.on('stream',function(stream){

           window.peer_stream=stream;

           receiveStream(stream,'hisvideo');
        })
      }
})
});

//this keeps our video/stream in a particular element id i.e in our video place or peers video place
function receiveStream(stream,elemid){

    var video=document.getElementById(elemid);

    video.srcObject=stream;

    window.peer_stream=stream;

}

//whenever a client reaches to the application just give him a random id so that he can get connected
peer.on('open',function(){

    alert("Your id is "+peer.id+" Use it to get connected");

})

//once a call is made one can video-chat/screen share/messages etc
document.getElementById('call').addEventListener('click',function(){

    peer_id=document.getElementById('connid').value;

    if(peer_id!=""){

    document.getElementById('leave').disabled=false;

    conn=peer.connect(peer_id);

    var call=peer.call(peer_id,window.localstream);

    call.on('stream',function(stream){

        window.peer_stream=stream;

        receiveStream(stream,'hisvideo');
    })

    call.on('close',function(stream){

        window.okToSend=false;
        
        video.remove();
    })
    }

})


//Procedures to be followed in client side after getting a request for connection from other client
peer.on('connection',function(connection){

    conn=connection;

    peer_id=connection.peer;

    document.getElementById('connid').value=peer_id;

})

//Procedures to be followed in client side after getting a request for call from other client
peer.on('call',function(call){

    call.answer(window.localstream);

    document.getElementById('leave').disabled=false;

    call.on('stream',function(stream){

        window.peer_stream=stream;

        receiveStream(stream,'hisvideo')
    })

})

//video on/off procedure
videoOnOff.addEventListener('click',function(){

    let videoEnabled = myVideoStream.getVideoTracks()[0].enabled;
    if (videoEnabled) {
       videoOnOff.innerHTML='<img src="vidoff.png" width="35px" height="35px">';

       myVideoStream.getVideoTracks()[0].enabled=false;

    } 
    else{
      videoOnOff.innerHTML='<img src="vid.jpg" width="35px" height="35px">';

      myVideoStream.getVideoTracks()[0].enabled=true;
      
    }
})

//audio on/off procedure
audioOnOff.addEventListener('click',function(){

    let audioEnabled = myVideoStream.getAudioTracks()[0].enabled;

    if (audioEnabled){
      audioOnOff.innerHTML='<img src="audoff.jpg" width="35px" height="35px">';

      myVideoStream.getAudioTracks()[0].enabled = false;
    
    } 
    else {
     audioOnOff.innerHTML='<img src="aud.jpg" width="35px" height="35px">';

      myVideoStream.getAudioTracks()[0].enabled = true;

    }
})

// canvas element
let canvas=document.getElementById('canvas');

//width as of windows size
canvas.width=1366;

canvas.height=625;

//basically a kind of pointer to draw the lines
let pointer=canvas.getContext("2d");

let x,y;

let mouseDown=false;

//handling situation when mouse lifted up and person don't want to wo=rite anything
window.onmouseup=function(e){

    mouseDown=false;
}

//for writing or drawing through mouse 
window.onmousedown=function(e){
   
     pointer.moveTo(x, y);

     mouseDown=true;

     if(peer_id!=-1){

        socket.emit('avoidDiscrepancy',{x,y});
     }
}

//some discrepency on receiver side regarding when the sender writes something then pointerof mouse updated
socket.on('avoidDiscrepancy',function(data){

    pointer.moveTo(data.x, data.y);

})

//main function for drawing through the mouse
window.onmousemove=function(event){

   x=event.clientX;

   y=event.clientY;

   if(mouseDown){

    if(peer_id!=-1){ 

        socket.emit('draw',{x,y});

    }

       pointer.lineTo(x, y);

       pointer.stroke();
  }
}

//receiving senders data of what he/she has written on the canvas
socket.on('draw',function(data){

    if(peer_id!=-1){

       pointer.lineTo(data.x, data.y);

       pointer.stroke();

    }
})

let inFullScreen=false;

//DOUBLE CLICKING ON MY VIDEO TOGGLES TO FULL SCREEN AND VICE VERSA
document.getElementById('myvideo').addEventListener("dblclick",()=>{

    toggle(document.getElementById('myvideo'));

});

//DOUBLE CLICKING ON PEER'S VIDEO TOGGLES TO FULL SCREEN AND VICE VERSA
document.getElementById('hisvideo').addEventListener("dblclick",()=>{

    toggle(document.getElementById('hisvideo'));

});

//THE MAIN TOGGLING FUNCTION
function toggle(elemid){
   
    if(inFullScreen){

        inFullScreen=false;

        elemid.exitFullscreen();
    }
    else{
       
        inFullScreen=true;

        elemid.requestFullscreen();
    }
}
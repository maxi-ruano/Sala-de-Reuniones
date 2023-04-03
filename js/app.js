/* global API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL OT */
/* eslint-disable no-alert */

var apiKey;
var session;
var sessionId;
var token;
var SAMPLE_SERVER_BASE_URL = 'https://servidor-api-video.herokuapp.com';

$(document).ready(function ready() {
  $('#stop').hide();
  archiveID = null;

  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  $.get(SAMPLE_SERVER_BASE_URL + '/room/:001', function get(res) {
    apiKey = res.apiKey;
    sessionId = res.sessionId;
    token = res.token;
console.log(apiKey);
    // initializeSession();
  });
});

 function initializeSession() {

//   const response = await fetch('https://servidor-api-video.herokuapp.com/room/session')
//   const data = await response.json();
//   console.log(data);
 
//   const apiKey= data.apiKey 
//   const sessionId= data.sessionId
//  const token = data.token


var params  = localStorage.getItem('params')

  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function streamCreated(event) {
    var subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      name : params,
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, function callback(error) {
      if (error) {
        console.error('There was an error publishing: ', error.name, error.message);
      }
    });
  });
 
  session.on('archiveStarted', function archiveStarted(event) {
    archiveID = event.id;
    console.log('Archive started ' + archiveID);
    $('#stop').show();
    $('#start').hide();
  });

  session.on('archiveStopped', function archiveStopped(event) {
    archiveID = event.id;
    console.log('Archive stopped ' + archiveID);
    $('#start').hide();
    $('#stop').hide();
    $('#view').show();
  });

  

  // (function closure() {
  //   const video = document.querySelector('#video');
  //   if (!video.captureStream) {
  //     alert('This browser does not support VideoElement.captureStream(). You must use Google Chrome.');
  //     return;
  //   }
  //   const stream = video.captureStream();
  //   let publisher;
  //   const publish = () => {
  //     const videoTracks = stream.getVideoTracks();
  //     const audioTracks = stream.getAudioTracks();
  //     if (!publisher && videoTracks.length > 0 && audioTracks.length > 0) {
  //       stream.removeEventListener('addtrack', publish);
  //       var publisherOptions = {
  //         insertMode: 'append',
  //         width: '100%',
  //         height: '100%'
  //       };
  //       publisher = OT.initPublisher('publisher', publisherOptions, {
  //         videoSource: videoTracks[0],
  //         audioSource: audioTracks[0],
  //         // fitMode: 'contain',
  //         // width: 320,
  //         // height: 240
  //       }, (err) => {
  //         if (err) {
  //           video.pause();
  //           alert(err.message);
  //         } else {
  //           video.play();
  //         }
  //       });
  //       publisher.on('destroyed', () => {
  //         video.pause();
  //       });
  //     }
  //   };
  //   stream.addEventListener('addtrack', publish);
  //   publish();
  //   // publisher.publishVideo(false);
  // })();
  var audioInputDevices;
var videoInputDevices;
OT.getDevices(function(error, devices) {
  audioInputDevices = devices.filter(function(element) {
    return element.kind == "audioInput";
  });
  videoInputDevices = devices.filter(function(element) {
    return element.kind == "videoInput";
  });
  for (var i = 0; i < audioInputDevices.length; i++) {
    console.log("audio input device: ", audioInputDevices[i].deviceId);
  }
  for (i = 0; i < videoInputDevices.length; i++) {
    console.log("video input device: ", videoInputDevices[i].deviceId);
  }
});


  // Initialize the publisher
  var pubOptions = {
      mirror : true,   
      publishAudio:true ,
      publishVideo:true ,
      name:"Publisher" , 
      style: { nameDisplayMode: "on" },
      width: '100%',
      height: '100%', 
      insertMode: 'append',
      backgroundImageURI : "https://www.tooltyp.com/wp-content/uploads/2014/10/1900x920-8-beneficios-de-usar-imagenes-en-nuestros-sitios-web.jpg",
      videoSource:false ,
       resolution: '1280x720',
       publishAudio: false,
       insertDefaultUI : true ,
       showControls : true ,
       style :{audioLevelDisplayMode : "on"} , 
       style :{backgroundImageURI: "https://i.pinimg.com/originals/68/b3/14/68b31495702d4b1947882ae602d4d2f1.gif"} , 
      //  audioSource: audioInputDevices[1].deviceId,
      //  videoSource: videoInputDevices[1].deviceId,
      usePreviousDeviceSelection: true,
      //  audioSource : true, 
       frameRate: 7 };
       

  var publisher = OT.initPublisher('publisher',pubOptions, function initCallback(initErr) {
    
    if (initErr) {
      console.error('There was an error initializing the publisher: ', initErr.name, initErr.message);
      return;
    }
  });

  

  
  publisher.on({
    accessAllowed: function (event) {
      // The user has granted access to the camera and mic.
      console.log("The user has granted access to the camera and mic.")
    },
    accessDenied: function accessDeniedHandler(event) {
      // console.log("The user has denied access to the camera and mic.")
    },
    

  
  });
  publisher.on('streamCreated', function (event) {
    console.log("The publisher stopped streaming. Reason: "
    + event.reason),
    console.log('The publisher started streaming.'),
    console.log('Stream resolution: ' +
    event.stream.videoDimensions.width +
    'x' + event.stream.videoDimensions.height),
    console.log('Frame rate: ' + event.stream.frameRate);
});

let prevStats = {};
window.setInterval(() => {
  publisher.getStats((error, statsArray) => {
    if (error) {
      return console.log(error);
    }
    statsArray.forEach(statsObj => {
      if (statsObj.connectionId) {
        let prevStatsObj = prevStats[connectionId];
        console.log('stats for connection', statsObj.connectionId);
      } else {
        prevStatsObj = prevStats;
      }
      const stats = statsObj.stats;
      if (prevStatsObj.video) {
        var videoBitRate = 8 * (stats.video.bytesSent - prevStatsObj.video.bytesSent);
        console.log('video bit rate: ', videoBitRate, 'bps');
        var audioBitRate = 8 * (stats.audio.bytesSent - prevStatsObj.audio.bytesSent);
        console.log('audio bit rate: ', audioBitRate, 'bps');
      }
      if (stats.connectionId) {
        prevStats[connectionId] = stats;
      } else {
        prevStats = stats;
      }
    });
})}, 1000);

// publisher.getRtcStatsReport()
//   .then(statArrays => statsArray.forEach(console.log))
//   .catch(console.log);



  var camaraout = document.getElementById("boton")
camaraout.addEventListener('click' ,apagarCamara )


function apagarCamara() {

  // console.log("hola");
  publisher.publishVideo(false);
}

var camaraonline = document.getElementById("boton2")
  camaraonline.addEventListener('click' , prenderCamara )
  



 function prenderCamara() {
  
     publisher.publishVideo(true);
   }

   var ScreenShare = document.getElementById("boton3")
   ScreenShare.addEventListener('click' , Screen )
   
   
   function Screen() {
  if (boton3.type == "button"){
 
    OT.checkScreenSharingCapability(function(response) {
      if(!response.supported || response.extensionRegistered === false) {
        // This browser does not support screen sharing.
      } else if (response.extensionInstalled === false) {
        // Prompt to install the extension.
      } else {

        
        // Screen sharing is available. Publish the screen.
        var publisher = OT.initPublisher('screen-preview',
          {videoSource: 'screen'},
          function(error) {
            if (error) {
              // Look at error.message to see what went wrong.
            } else {
              session.publish(publisher, function(error) {
                if (error) {
                  // Look error.message to see what went wrong.
                }
              });
            }
          }
        );
      }
    });

   
  }
     
    
   }
   



var connectionCount;
session.on({
  connectionCreated: function (event) {
    connectionCount++;
    if (event.connection.connectionId != session.connection.connectionId) {
      cartel() ;
      // console.log('Another client connected. ' + connectionCount + ' total.');
      // swal('Another client connected. ' );
    }
  },
  connectionDestroyed: function connectionDestroyedHandler(event) {
    connectionCount--;
    desconectado();
    // alert('A client disconnected. ');
  }

  
});


 

  // Connect to the session
  session.connect(token, function callback(error) {
    
    // If the connection is successful, initialize a publisher and publish to the session
    if (!error) {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, function publishCallback(publishErr) {
        if (publishErr) {
          console.error('There was an error publishing: ', publishErr.name, publishErr.message);
        }
      });
    } else {
      console.error('There was an error connecting to the session: ', error.name, error.message);
    }
    
  });

  // Receive a message and append it to the history
  var msgHistory = document.querySelector('#history');
  session.on('signal:msg', function signalCallback(event) {
    var msg = document.createElement('p');
    msg.textContent = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
    msgHistory.appendChild(msg);
    msg.scrollIntoView();
  });
  
var salir = document.getElementById("salir-sesion")
salir.addEventListener('click' , disconnect )


function disconnect() {
  //  alert("Hola mundo") ;
    session.disconnect();
}


}

// Text chat
var form = document.querySelector('form');
var msgTxt = document.querySelector('#msgTxt');

// // Send a signal once the user enters data in the form
form.addEventListener('submit', function submit(event) {
  event.preventDefault();

  // session.signal({
  //   type: 'msg',
  //   data: msgTxt.value
  // }, function signalCallback(error) {
  //   if (error) {
  //     console.error('Error sending signal:', error.name, error.message);
  //   } else {
  //     msgTxt.value = '';
  //   }
  // });
});

// See the config.js file.
// if ( API_KEY && TOKEN &&  SESSION_ID ) {
//   apiKey =  API_KEY;
//   sessionId =  SESSION_ID ;
//   token = TOKEN;
//   initializeSession();
  if (SAMPLE_SERVER_BASE_URL) {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/room/:152').then(function fetch(res) {
    return res.json();
  }).then(function fetchJson(json) {
    apiKey =  json.apiKey;
    sessionId = json.sessionId;
    token = json.token;
    console.log(apiKey);
    console.log(sessionId);
    console.log( token);

    initializeSession();
  }).catch(function catchErr(error) {
    console.error('There was an error fetching the session information', error.name, error.message);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}


function startArchive() { // eslint-disable-line no-unused-vars
  $.ajax({
    url: SAMPLE_SERVER_BASE_URL + '/archive/start',
    type: 'POST',
    contentType: 'application/json', // send as JSON
    data: JSON.stringify({'sessionId': sessionId}),

    complete: function complete() {
      // called when complete
      console.log('startArchive() complete');
    },

    success: function success() {
      // called when successful
      console.log('successfully called startArchive()');
    },

    error: function error() {
      // called when there is an error
      console.log('error calling startArchive()');
    }
  });

  $('#start').hide();
  $('#stop').show();
}

// Stop recording
function stopArchive() { // eslint-disable-line no-unused-vars
  $.post(SAMPLE_SERVER_BASE_URL + '/archive/' + archiveID + '/stop');
  $('#stop').hide();
  $('#view').prop('disabled', false);
  $('#stop').show();
}

// Get the archive status. If it is  "available", download it. Otherwise, keep checking
// every 5 secs until it is "available"
function viewArchive() { // eslint-disable-line no-unused-vars
  $('#view').prop('disabled', true);
  window.location = SAMPLE_SERVER_BASE_URL + /archive/ + archiveID + '/view';
}

$('#start').show();
$('#view').hide();



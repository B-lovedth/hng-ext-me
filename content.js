console.log('Hi, I have been injected whoopie!!!');

let container = document.createElement('div');
const imageContainer = document.createElement('div');
const navigationContainer = document.createElement('div');


container.className ="px-14 fixed bottom-10 z-50 flex gap-10"


navigationContainer.className="flex"

// image

// naviga

// Create the main container div
const panel_container = document.createElement("div");
panel_container.className = "panel-container";

// Create the time div and its child elements
const timeDiv = document.createElement("div");
timeDiv.className = "time";

const timeTextDiv = document.createElement("div");
timeTextDiv.className = "time__text";

const timeTextP = document.createElement("p");
timeTextP.textContent = "12:00";

// Append child elements to the time div
timeTextDiv.appendChild(timeTextP);
timeDiv.appendChild(timeTextDiv);

// Create the options div and its child elements
const optionsDiv = document.createElement("div");
optionsDiv.className = "options";

const option1Div = document.createElement("div");
option1Div.className = "option";
option1Div.addEventListener("click", function() {
  alert('working');
});
const option1I = document.createElement("i");
option1I.className = "fa-solid fa-pause";
const option1P = document.createElement("p");
option1P.textContent = "Pause";
option1Div.appendChild(option1I);
option1Div.appendChild(option1P);

const option2Button = document.createElement("button");
option2Button.id = "stop";
option2Button.className = "option";
const option2I = document.createElement("i");
option2I.className = "fa-solid fa-stop";
const option2P = document.createElement("p");
option2P.textContent = "Stop";
option2Button.appendChild(option2I);
option2Button.appendChild(option2P);

const option3Div = document.createElement("div");
option3Div.className = "option";
const option3I = document.createElement("i");
option3I.className = "fa-solid fa-video";
const option3P = document.createElement("p");
option3P.textContent = "Video";
option3Div.appendChild(option3I);
option3Div.appendChild(option3P);

const option4Div = document.createElement("div");
option4Div.className = "option";
const option4I = document.createElement("i");
option4I.className = "fa-solid fa-microphone";
const option4P = document.createElement("p");
option4P.textContent = "Audio";
option4Div.appendChild(option4I);
option4Div.appendChild(option4P);

const option5Div = document.createElement("div");
option5Div.className = "option";
const option5I = document.createElement("i");
option5I.className = "fa-solid fa-trash";
option5Div.appendChild(option5I);

// Append child elements to the options div
optionsDiv.appendChild(option1Div);
optionsDiv.appendChild(option2Button);
optionsDiv.appendChild(option3Div);
optionsDiv.appendChild(option4Div);
optionsDiv.appendChild(option5Div);

// Append everything to the main container div
panel_container.appendChild(timeDiv);
panel_container.appendChild(document.createElement("span")); // Adding a span element
panel_container.appendChild(optionsDiv);

// Finally, append the main container div to the document body
navigationContainer.appendChild(panel_container)

// Add your script tag at the end
document.body.appendChild(navigationContainer);



// navigationContainer.innerHTML = 
// `
// <div class="panel-container">
//     <div class="time">       
//         <div class="time__text">
//             <p>12:00</p>
//         </div>
//     </div>
//     <span>|</span>
//     <div class="options">
//         <div class="option" onclick="alert('working')">
//             <i class="fa-solid fa-pause"></i>
//             <p>Pause</p>
//         </div>
//         <button id="stop" class="option">
//             <i class="fa-solid fa-stop"></i>
//             <p>Stop</p>
//         </button>
//         <div class="option">
//             <i class="fa-solid fa-video"></i>
//             <p>Video</p>
//         </div>      
//         <div class="option">
//             <i class="fa-solid fa-microphone"></i>
//             <p>Audio</p>
//         </div>
//         <div class="option">
//             <i class="fa-solid fa-trash"></i>            
//         </div>
//     </div>
//     <script src="./js/popup.js"></script>
// </div>
// `

let stream = null
let recorder = null
let recordedChunks = []

option1Div.addEventListener("click", async () => {
  await startRecording()
})

function startRecording() {
 
  if (recorder && recorder.state === 'recording') {
    recorder.pause();
    console.log('recording paused');
  } else {
    stream = navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    console.log('recording started');

    stream
      .then((mediaStream) => {
        recorder = new MediaRecorder(mediaStream, {
          mimeType: 'video/webm;codecs=vp9,opus',
        });
        const audioTrack = mediaStream?.getAudioTracks();
        console.log(audioTrack, 'audio track');


        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        recorder.start();
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  }
}

  

// container.appendChild(imageContainer);
container.appendChild(navigationContainer);

document.body.appendChild(container);

function onAccessApproved(stream) {
    recorder = new MediaRecorder();

  recorder.start();

  recorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };

  recorder.ondataavailable = function (event) {
    let recordedBlob = event.data;
    let url = URL.createObjectURL(recordedBlob);

    chrome.tabs.create({ url: url });
  };
}
let mediaRecorder
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "request_dialog_box") {
        console.log("requesting recording");

        sendResponse(`processed: ${message.action}`);

        navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then(function (stream) {
         mediaRecorder = new MediaRecorder(stream);
        let chunks = [];

        mediaRecorder.ondataavailable = function (e) {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = function () {
          let blob = new Blob(chunks, { type: "video/webm" });
          var url = URL.createObjectURL(blob);

          let a = document.createElement("a");
            a.href = url;
            a.download = "test.webm";
            document.body.appendChild(a);
        a.click()
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
          //   localStorage.setItem('recordedVideo', url);
          //   video.src = localStorage.getItem("recordedVideo");
          console.log(blob);

          //   document.getElementById('view-recordings').style.display = 'block';
        };

        mediaRecorder.start();
        function getTabId() {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              return tabs[0].id;
            }
          );
        }

        setTimeout(function () {
          mediaRecorder.stop();
        }, 5000); // Stop recording after 5 seconds
    });

}else
if (message.action === "stop_recording") {
    // if (!recorder) return console.log("no recorder");
    mediaRecorder.stop()
    console.log("stopping video");
    sendResponse(`processed: ${message.action}`);
    chrome.tabs.create({ url: url });
//   recorder.stop();
}
});

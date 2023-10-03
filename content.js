console.log("Hi, I have been injected whoopie!!!");

var recorder = null;
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

        // chrome.scripting.executeScript({
        //     target: { tabId: getTabId() },
        //     files: ["panel.js"],
        //   })
        //   .then(() => console.log("script injected"));
        // chrome.scrpipting.insertCSS({
        //   target: { tabId: getTabId() },
        //   files: ["panel.css"],
        // });

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

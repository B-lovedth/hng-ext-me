  document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.querySelector('button#start');
    const stopButton = document.querySelector('button#stop');

    startButton.onclick = function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'request_dialog_box'},(response)=>{
            if(!chrome.runtime.lastError){
                console.log(response)
            }else{
                console.log(chrome.runtime.lastError.message,"error in popup.js line 11")
            }
        });
      });
    };
    stopButton.onclick = function(){
        chrome.tabs.query({active:true , currentWindow:true},(tabs)=>{
            chrome.tabs.sendMessage(tabs[0].id, {action: 'stop_recording'});
        })
    }
  })
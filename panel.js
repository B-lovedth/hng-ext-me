document.body.appendChild( 
<div class="panel-container">
    <div class="time">       
        <div class="time__text">
            <p>12:00</p>
        </div>
    </div>
    <span>|</span>
    <div class="options">
        <div class="option">
            <i class="fa-solid fa-pause"></i>
            <p>Pause</p>
        </div>
        <button id="stop" class="option">
            <i class="fa-solid fa-stop"></i>
            <p>Stop</p>
        </button>
        <div class="option">
            <i class="fa-solid fa-video"></i>
            <p>Video</p>
        </div>      
        <div class="option">
            <i class="fa-solid fa-microphone"></i>
            <p>Audio</p>
        </div>
        <div class="option">
            <i class="fa-solid fa-trash"></i>            
        </div>
    </div>
    <script src="./js/popup.js"></script>
</div>

)
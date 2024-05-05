const audio = document.getElementById('audio');
const musicLink = document.querySelectorAll('.music-link');
var time_past = document.getElementById("time-past");
var time_left = document.getElementById("time-left");
var fill = document.getElementById("fill");
var fill_btn = document.getElementById("fill-btn");
var played = false;


function slider(action, id, mousedown=function(){}, mouseup=function(){}){
    var parent = document.getElementById(id);
    var fill = parent.getElementsByClassName("fill")[0];
    var fill_btn = parent.getElementsByClassName("fill-btn")[0];
    var can_drag = false, value = 0;

    function update(){
        var pos_x = window.event.clientX;
        var left = document.getElementById("left-width-" + id).getBoundingClientRect().left;
        var right = document.getElementById("right-width-" + id).getBoundingClientRect().right;
        var width = right - left;

        value = (pos_x - left) / width;

        if (value < 0) value = 0;
        else if (value > 1) value = 1;

        fill.style.width = (value * 100) + "%";
        fill_btn.style.left = (value * 100) + "%";

        if (action === "time-line"){
            audio.currentTime = audio.duration * value;
        }
        else if (action === "volume"){
            audio.volume = value;
            document.getElementById("volume-value").innerText = parseInt(value * 100);
        }
    }

    parent.addEventListener("mousedown", function(e){
        if (e.button === 0){
            can_drag = true;
            mousedown();
        }
    });

    document.body.addEventListener("mousemove", function(e){
        if (e.button === 0 && can_drag)
            update();
    });

    document.body.addEventListener("mouseup", function(e){
        if (e.button === 0 && can_drag){
            can_drag = false;
            mouseup();
        }
    });

    parent.addEventListener("click", function(e){
        if (e.button === 0){
            update();
        }
    });
}

function play_and_pause(){
    if (played){
        audio.pause();
        document.getElementById("play-pause-btn").className = 'bi bi-play-circle-fill'
        document.getElementById("play-pause-path").setAttribute('d',"M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z");
        played = false;
    }
    else{
        audio.play();
        document.getElementById("play-pause-btn").className = 'bi bi-pause-circle-fill'
        document.getElementById("play-pause-path").setAttribute('d',"M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z");
        played = true;
    }
}

function change_format(time){
    var minute = parseInt(time / 60);
    var seconds = parseInt(time - (minute * 60));
    if (seconds > 9){
        return minute.toString() + ":" + seconds.toString();
    }
    else{
        return minute.toString() + ":0" + seconds.toString();
    }
}

function next_5(){
    if (audio.currentTime + 5 > audio.duration) audio.currentTime = audio.duration;
    else audio.currentTime += 5;
}

function back_5(){
    if (audio.currentTime - 5 < 0) audio.currentTime = 0;
    else audio.currentTime -= 5;
}

slider("volume", "volume");
slider("time-line", "time-line", function(){audio.pause()}, function(){if (played) audio.play();});

audio.addEventListener("timeupdate", function(){
    fill.style.width = (audio.currentTime * 100 / audio.duration) + "%";
    fill_btn.style.left = (audio.currentTime * 100 / audio.duration) + "%";
    time_past.innerText = change_format(audio.currentTime);
    time_left.innerText = change_format(audio.duration - audio.currentTime);
    if (isNaN(audio.duration - audio.currentTime)){
        fill.style.width = 0;
        fill_btn.style.left = 0;
        time_left.innerText = '';
        time_left.innerHTML = '<div id="loading-music"></div>';
    }
});

audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
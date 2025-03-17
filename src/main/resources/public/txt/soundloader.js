//this file creates provides a function to "load" a sound, which creates an invisible audio element on the page.
//it has functions to play and stop a sound, and also loop it if you want
//there's a loop function somewhere in there too

function soundloaderLoad(path) {
    let audio = document.createElement("audio");
    audio.src = path;
    audio.type = "audio/mpeg";
    audio.preload = "auto"; // Add preload attribute
    audio.style.display = "none";
    document.body.appendChild(audio);
    console.log("created audio element for sound: " + path);
    console.log(audio);
    return {
        play: function() {
            if (!audio.paused) {
                console.log("audio already playing");
                return;
            }
            audio.play();
        },
        stop: function() {
            audio.pause();
            audio.currentTime = 0;
        },
        loop: function() {
            audio.loop = true;
        },
        duration: function() {
            return audio.duration;
        }
    };
}

async function getSongs() {
    
    let songs = await fetch("http://127.0.0.1:5500/src/songs/");
    let response = await songs.text();
    // console.log(response)
    let element = document.createElement("div");
    element.innerHTML = response;
    let music = element.getElementsByTagName("a");

    let songList = [];
    for (let i = 0; i < music.length; i++) {
        if (music[i].href.endsWith(".mp3")) {
            songList.push(music[i].href.split("/songs/")[1])
        }
    }
    console.log(songList)

    // play the first song :
    var audio = new Audio(songList[0]);
    audio.play();

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(duration);
    })

    let songJS = document.querySelector(".songList").getElementsByTagName("ol")[0];
    for (const song of songList) {
        songJS.innerHTML += `<li 
    class="flex gap-3 py-3 border-white border rounded-sm my-3 justify-between">
    <img class="invert" src="/src/images/music.svg" alt="">
    <div class="songInfo flex-1 text-sm shrink min-w-1">
    <div class="songName"> ${song.replaceAll("%20", "")}</div>
    </div> 
    <div class="playNow flex gap-3 pr-3">
    <span class="w-10 text-sm mt-3">PlayNow</span>
    <img class="invert" src="/src/images/play.svg" alt="">
    </div>
    </li>`

    }

}

getSongs() // show all the songs in the playlist section 




let currentSong = new Audio() 

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

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
    return songList ; 
}

const playMusic = (track , pause = false)=> 
{
currentSong.src = ("songs/" + track)
if(!pause) 
{
currentSong.play() ; 
playbtn.src = "/src/images/pause.svg"
}

// document.querySelector(".songInfo").innerHTML = track
document.querySelector(".sName").innerHTML = track
document.querySelector(".songTime").innerHTML = "00 : 00"
}

    async function main(){

    const songList = await getSongs() ; 
    playMusic(songList[0] , true) ; 

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

 // event listener to each song : 

Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e)=> {e.addEventListener("click" , element => {console.log(e.querySelector(".songInfo").firstElementChild.innerHTML)
playMusic(e.querySelector(".songInfo").firstElementChild.innerHTML.trim())
})})
    }

// attach event listener to play buttons :

playbtn.addEventListener("click" , ()=>{
    if(currentSong.paused)
    {
        currentSong.play()
        playbtn.src = "/src/images/pause.svg"
    }
    else
    {
        currentSong.pause()
        playbtn.src = "/src/images/play.svg"
    }
} 

)

 // add event listener to seekbar : 

 document.querySelector(".seekbar").addEventListener("click" , (e)=> {
    let percent = (e.offsetX / e.currentTarget.getBoundingClientRect().width)
    document.querySelector(".circle").style.left = percent * 100 + "%" ;

  // here what wehave done is we have added an event listener on seekbar which is on clicking we extracted offset which is coordinates in x of that click and boundingClientRect se bhi yahiii with ,ight , coordinates vagera milte hain , use se humne width le li aur left ko us percentage pe set kr diya .   

  // changing song current time using this : 

currentSong.currentTime = ((currentSong.duration)* percent)/100 })

 //  listen for time Update : 

 currentSong.addEventListener("timeupdate" , ()=> {document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} : ${secondsToMinutesSeconds(currentSong.duration)}` ; 
 document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%" ;  
 })


main() // show all the songs in the playlist section 





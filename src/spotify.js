let currentSong = new Audio() 
let songList ; 
let currFolder ; 
let saved_vol ;

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

async function getSongs(folder) {

    currFolder = folder ;
    let songs = await fetch(`/src/${currFolder}/`);
    let response = await songs.text();
    // console.log(response)
    let element = document.createElement("div");
    element.innerHTML = response;
    let music = element.getElementsByTagName("a");

    songList = [];
    for (let i = 0; i < music.length; i++) {
        if (music[i].href.endsWith(".mp3")) {
            songList.push(music[i].href.split(`/${currFolder}/`)[1].trim().replaceAll("%20" , " "))
        }
    } 

    let songJS = document.querySelector(".songList").getElementsByTagName("ol")[0];
    songJS.innerHTML = "" ; 
    for (const song of songList) {
        songJS.innerHTML += `<li 
    class="flex gap-3 py-3 border-white border rounded-sm my-3 justify-between">
    <img class="invert" src="/src/images/music.svg" alt="">
    <div class="songInfo flex-1 text-sm shrink min-w-1">
    <div class="songName break-all"> ${decodeURIComponent(song)}</div>
    </div> 
    <div class="playNow flex gap-3 pr-3">
    <span class="w-10 text-sm mt-3">PlayNow</span>
    <img class="invert" src="/src/images/play.svg" alt="">
    </div>
    </li>`

    }

    // event listener to each song : 

Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e)=> {e.addEventListener("click" , () => {console.log(e.querySelector(".songInfo").firstElementChild.innerHTML)
playMusic(e.querySelector(".songInfo").firstElementChild.innerHTML.trim())
})})

return songList ; 
}

const playMusic = (track , pause = false)=> 
{
currentSong.src = encodeURI((`${currFolder}/` + track))
if(!pause) 
{
currentSong.play() ; 
playbtn.src = "/src/images/pause.svg"
}

// document.querySelector(".songInfo").innerHTML = track
document.querySelector(".sName").innerHTML = track
document.querySelector(".songTime").innerHTML = "00 : 00"
}

async function displayAlbums() {
    let a = await fetch("/src/songs/") ; 
    let response = await a.text() ; 
    let element = document.createElement("div") ; 
    element.innerHTML = response ; 
    let anchors = element.getElementsByTagName("a") ;
    let array = Array.from(anchors) 

    for(let i = 0 ; i<array.length ; i ++)
    {
        const e = array[i] ; 
        if(e.href.includes("/songs/"))
        {
            let card_container = document.querySelector(".card_container")
            let folder = (e.href.split("/").splice(-1)[0]) ; 
            // get he meta data of the folder 
            let a = await fetch(`/src/songs/${folder}/info.json`)
            let response = await a.json() ; 
            
            card_container.innerHTML += `<div data-folder="${folder}" class="card w-60.5 p-2.5 bg-[#252525] relative group max-[520px]:w-[96vw] hover:bg-[rgb(54,50,50)] hover:cursor-pointer transition-all duration-600">

                            <div class="play w-7 h-7 bg-[#1fdf64] p-1 flex rounded-[50%] justify-center top-50 right-4 absolute opacity-0 transition-all ease-out duration-500 group-hover:opacity-100 group-hover:top-46 ">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 4V21L19 12L5 4Z"
                                stroke="#141B34" fill="#000" stroke-width="1.5"
                                stroke-linejoin="round" />
                                </svg>
                            </div>

                            <img class="object-contain w-full" src="/src/songs/${folder}/cover.jpeg" alt="">
                            <h2 class="font-bold">${response.title}</h2>
                            <p>${response.description}</p>
                        </div>`
    }    
}

// load the playlist whenever card is clicked

// one important distinction between target and currentTarget ; target : agar kahi click kr rhe ho to jaha click kiya vaha ki info , curratasrget me if you click somewhere and that s inside your target where you have applied event listener then currenttarget me vahi element ki info milegi 

Array.from(document.getElementsByClassName("card")).forEach((e)=>{e.addEventListener("click", async (item)=>{
    console.log("fetching songs") ; 
    songList = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    playMusic(songList[0])
}) })
}

    async function main(){

    await getSongs("songs/punjabi") ; 
    playMusic(songList[0] , true) ; 

    // display all the albums on the page :
     await displayAlbums() ; 


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

  // here what wehave done is we have added an event listener on seekbar which is on clicking we extracted offset which is coordinates in x of that click and boundingClientRect se bhi yahiii with ,ight , coordinates vagera milte hain , use se humne width le li aur left ko us percentage pe set kr diya .   

  // changing song current time using this : 

 //  listen for time Update : 

 currentSong.addEventListener("timeupdate" , ()=> {document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} : ${secondsToMinutesSeconds(currentSong.duration)}` ; 
 document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%" ;  
 })

  // add event listener to seekbar : 

 document.querySelector(".seekbar").addEventListener("click" , (e)=> {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left = percent + "%" ;
    currentSong.currentTime = ((currentSong.duration)* percent)/100 
    })

    // adding event listener to hamburger : 

document.querySelector(".hamburger").addEventListener("click" , ()=>{const left = document.querySelector(".left") ; 
    left.style.backgroundColor = "black" ; left.style.left = "0" ; left.style.width = "36%"
    // document.querySelector(".left").style.bg = black ; document.querySelector(".left").style.width = full ;
 })

document.querySelector(".close").addEventListener("click" , ()=>{
    document.querySelector(".left").style.left = "-100%" 
})

// adding event listeners to previous and next butons : 

previous.addEventListener("click" , ()=> {let index = songList.indexOf(decodeURIComponent((currentSong.src.split("/").slice(-1)[0]))) ; 
    if(index > 0)
    {
        playMusic(songList[(index-1)%(songList.length)]) ; 
    }
    
})
nextbtn.addEventListener("click" , ()=> {let index = songList.indexOf(decodeURIComponent((currentSong.src.split("/").slice(-1)[0]))) ;  
    playMusic(songList[(index+1)%(songList.length)]) ; 
})

// adding event listener to volume range  : 

range.addEventListener("input" , (e)=>{currentSong.volume = parseInt((e.target.value))/100 ;
    saved_vol = currentSong.volume 
})

// add event listener to mute button ;

document.querySelector(".volume > img").addEventListener("click" , (e)=>{
    if(e.target.src.includes("volume.svg"))
    {
        e.target.src = e.target.src.replace("volume.svg" , "mute.svg") ; 
        range.value = 0 
        currentSong.volume = 0 ;
    }

    else
    {
        e.target.src = e.target.src.replace("mute.svg" , "volume.svg") ; 
        if(!saved_vol)
        {
            currentSong.volume = 0.36 ; 
            range.value = 36 ; 
        }

        else
        {
            currentSong.volume = saved_vol ;
            range.value = saved_vol*100
        }
        
    }
})

}

main() // show all the songs in the playlist section 





async function main()
{
let songs = await fetch("http://127.0.0.1:5500/src/songs/") ; 
let response = await songs.text() ; 
console.log(response)
}

main() 


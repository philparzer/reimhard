const googleTTS = require('node-google-tts-api');
const fs = require('fs');
const TTS = new googleTTS();



const generate = () => { //TODO: get completed entry foreach user, write files to respective folder filename = user.id?
    // TTS.get({
    //     text: "Der Mond scheint auf des Hundes Schnauze, deine Mutter isst ne Jause", 
    //     lang: "de"
    //   }).then(data => {
    //     // returns mp3 audio src buffer
    //     fs.writeFileSync("assets/audio/tts.mp3", data);
    //   });
}


module.exports = {generate}
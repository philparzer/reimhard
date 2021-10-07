const googleTTS = require('node-google-tts-api');
const fs = require('fs');
const TTS = new googleTTS();
const INDEX = require("../index.js")

const generate = (user) => { //TODO: get completed entry foreach user, write files to respective folder filename = user.id?

    var ttsText = "";

    INDEX.gameData.userRoundData.forEach(dataBlock => {

        if (dataBlock.player === user) {

            //TODO: do something if reimhard

            ttsText = dataBlock.prompt1 + ", " + dataBlock.prompt2 + ", " + dataBlock.entry1 + ", " + dataBlock.entry2 + ", ";
        }

    })


    //TODO: do something if reimhard

    //less than 200chars
    if (ttsText.length < 200){

        TTS.get({
            text: ttsText, 
            lang: INDEX.config.language
          }).then(data => {
            // returns mp3 audio src buffer
            fs.writeFileSync(`assets/audio/tts/${user.tag}.mp3`, data);
        });
    }

    //bypass Google's 200char limit by concatenating audio files
    else {
        TTS.get({
            text: ttsText,
            lang: INDEX.config.language,
            limit_bypass: true
          }).then(arr => {
            let data = TTS.concat(arr);
            fs.writeFileSync(`assets/audio/tts/${user.tag}.mp3`, data);
          });
    }    
}


//TODO: generate user intro e.g "ur turn ${user.username}!"
/*
    const generateIntro = () => {
        generate user intro e.g "ur turn ${user.username}!"
    }
*/

module.exports = {generate}
const googleTTS = require('node-google-tts-api');
const fs = require('fs');
const TTS = new googleTTS();
const INDEX = require("../index.js");
const AUDIO = require("./audio.js");
var ttsIterator = 0;

const checkForEmpty = (entry) => {
    
    if (entry === "___") {return ""}
    
    return entry;
}


const generate = (user) => { //TODO: think about async recursion

    var ttsText = "";

    INDEX.gameData.userRoundData.forEach(dataBlock => {

        if (dataBlock.player === user) {

            ttsText = dataBlock.prompt1 + ", " + dataBlock.prompt2 + ", " + checkForEmpty(dataBlock.entry1) + ", " + checkForEmpty(dataBlock.entry2) + ", ";
        }

    })

    //less than 200chars
    if (ttsText.length < 200){

        TTS.get({
            text: ttsText, 
            lang: INDEX.config.language
          }).then(data => {
           
            fs.writeFileSync(`assets/audio/tts/${user.tag}.mp3`, data);
            console.log(`${user.tag}'s tts saved.`)

            if (ttsIterator < INDEX.gameData.userRoundData.length -1)
            {
                ttsIterator++;
                generate(INDEX.gameData.userRoundData[ttsIterator].player)
            }

            else {
                ttsIterator = 0;
                console.log("\n-----------------ffmpeg-----------------")
                AUDIO.mixEntryAndBG(INDEX.gameData.userRoundData[0].player.tag); //mix audio after tts is done
            }

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
            console.log(`${user.tag}'s tts saved.`)

            if (ttsIterator < INDEX.gameData.userRoundData.length -1)
            {
                ttsIterator++;
                generate(INDEX.gameData.userRoundData[ttsIterator].player)
            }

            else {
                ttsIterator = 0;
                console.log("\n-----------------ffmpeg-----------------")
                AUDIO.mixEntryAndBG(INDEX.gameData.userRoundData[0].player.tag); //mix audio after tts is done
            }

          });
    }    
}


//TODO: maybe generate user intro e.g "ur turn ${user.username}!"
/*
    const generateIntro = () => {
        generate user intro e.g "ur turn ${user.username}!"
    }
*/

module.exports = {generate}
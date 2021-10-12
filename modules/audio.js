const { createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel } = require('@discordjs/voice');
const { join } = require('path');
const { createAudioResource, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const INDEX = require('../index.js');
var ffmpeg = require('fluent-ffmpeg');
const path = require('path/posix');

var command = ffmpeg();
let pathToAudio = "assets/audio/tts/";
var connection;
var player;
var mixIterator = 0;
var currentUser;



function initializeAudioPlayer(channel) {

    connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });


    connection.subscribe(player);

}

const mixEntryAndBG = (userTag) => {
    const END_ROUND = require('./endRound.js')

    let pathToBG = "assets/audio/bg/bg.mp3";
    let pathToUserTTS = pathToAudio + userTag + ".mp3";
    
    let mixedAudioPath = pathToAudio + userTag + "MIXED.mp3";


    ffmpeg()
      .input(pathToUserTTS)
      .input(pathToBG)
      .complexFilter([
        {
           filter : 'amix', options: { inputs : 2, duration : 'shortest' }
        }
      ])
      .saveToFile(mixedAudioPath)
      .on('end', async function (output) { 
        console.log(output, `${userTag}'s entry mixed and saved.`)
        

        ffmpeg("assets/audio/transition/backspin.mp3") //TODO: use var, lower volume of transition sound?
            .input(mixedAudioPath)
            .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
            })
            .on('end', function() {
            console.log('Merging finished !');

                //recursive call that mixes all remaining users' audio files
                if (mixIterator < INDEX.gameData.userRoundData.length-1)
                {
                    mixIterator++;
                    mixEntryAndBG(INDEX.gameData.userRoundData[mixIterator].player.tag);
                }

                else {
                    mixIterator = 0;
                    END_ROUND.initRapBattle();
                }

            })
            .mergeToFile(`assets/audio/tts/${userTag}Final.mp3`, 'assets/audio');

      })
      
}

//TODO: test and implement

const playUserEntry = (user) => {

    const END_ROUND = require('./endRound.js')
    const resource = createAudioResource(pathToAudio + user.tag + "Final.mp3", {});

    
    player.play(resource);

    player.on(AudioPlayerStatus.Playing , () =>{
        currentUser = user;
    })

    player.on(AudioPlayerStatus.Idle, () => {
        console.log("idle triggered")
        END_ROUND.voting(currentUser);
    })
}



// const playPlayerIntro = (user) => {
    //TODO: think about if needed if yes -> use mergeToFile above
//}


module.exports = {initializeAudioPlayer, playUserEntry, mixEntryAndBG}
const { createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel } = require('@discordjs/voice');
const { createAudioResource, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const INDEX = require('../index.js');
var ffmpeg = require('fluent-ffmpeg');

let pathToAudio = "assets/audio/tts/";
var connection;
var player; 
var mixIterator = 0;
var currentUser;
var idleTriggered;
var playedAudio;

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


const destroyAudioPlayer = () => {
    connection.destroy();
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
        

        ffmpeg("assets/audio/transition/backspin.mp3")
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

const playUserEntry = (userToPlay) => {
    playedAudio = false;
    idleTriggered = false;
    var END_ROUND = require('./endRound.js')
    var resource = createAudioResource(pathToAudio + userToPlay.tag + "Final.mp3", {})
    player.play(resource);
    currentUser = userToPlay;
    console.log("playing:::::" + currentUser.tag)



    player.on(AudioPlayerStatus.Playing, () => {
        playedAudio = true;
    })


    player.on(AudioPlayerStatus.Idle, () => {

            if (!idleTriggered & playedAudio)
            {
                idleTriggered = true;
                console.log("::::done " + currentUser.tag)
                END_ROUND.voting(currentUser);
            }
    })

    player.on('error', error => {
        console.error('Error:', error.message, 'with track', error.resource.metadata.title);
    });
    
}



// const playPlayerIntro = (user) => {
    //TODO: think about if needed if yes -> use mergeToFile above
//}


module.exports = {initializeAudioPlayer, playUserEntry, mixEntryAndBG, destroyAudioPlayer}
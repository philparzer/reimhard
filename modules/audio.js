const { createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel } = require('@discordjs/voice');
const { join } = require('path');
const { createAudioResource, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const INDEX = require('../index.js');

var ffmpeg = require('fluent-ffmpeg');
const path = require('path/posix'); //TODO: 
var command = ffmpeg();
let pathToAudio = "assets/audio/tts/";
var connection;
var player;
var mixIterator = 0;

//TODO: const SCRATCH_SOUND = createAudioResource(TODO, {});



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
      .on('end', async function (output) { 
        console.log(output, `${userTag}'s entry mixed and saved.`)
        
        //recursive call that mixes all remaining users' audio files
        if (mixIterator < INDEX.gameData.userRoundData.length-1)
        {
            mixIterator++;
            mixEntryAndBG(INDEX.gameData.userRoundData[mixIterator].player.tag);
        }

        else {mixIterator = 0}

      })
      .saveToFile(mixedAudioPath)
}

//TODO: test and implement

const playUserEntry = (user) => {
    console.log("\nplaying::::")
    const END_ROUND = require('./endRound.js')
    
    const resource = createAudioResource(pathToAudio + user.tag + "MIXED.mp3", {});
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {
        console.log("\n::::done")
        END_ROUND.voting(user);
    })
}

// const playTransition = (user) => {
//     //player.play(SCRATCH_SOUND);
// }


module.exports = {initializeAudioPlayer, playUserEntry, mixEntryAndBG}  //playTransition,
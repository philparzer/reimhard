const { createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel } = require('@discordjs/voice');
const { join } = require('path');
const { createAudioResource, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const INDEX = require('../index.js');
var ffmpeg = require('fluent-ffmpeg');
const path = require('path/posix');
var command = ffmpeg();

var connection;
var player;
//TODO: const SCRATCH_SOUND = createAudioResource(TODO, {});


const initializeAudioPlayer = (channel) => {

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
    
    let pathToAudio = "assets/audio/tts/";
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
        console.log(output, 'files mixed and saved.')
      })
      .saveToFile(mixedAudioPath)
}

//TODO: implement these
// const playUserEntry = (user) => {
//     const resource = createAudioResource(pathToAudio + user.tag + "MIXED.mp3", {});
//     player.play(resource);

//     player.on(AudioPlayerStatus.Idle, () => {
//         END_ROUND.nextPlayer();
//     })
// }

// const playTransition = (user) => {
//     //player.play(SCRATCH_SOUND);
// }




module.exports = {initializeAudioPlayer, mixEntryAndBG}  //playTransition, playUserEntry
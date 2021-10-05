const { createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel } = require('@discordjs/voice');
const { join } = require('path');
const { createAudioResource, StreamType } = require('@discordjs/voice');
const INDEX = require('../index.js');
var ffmpeg = require('fluent-ffmpeg');
const path = require('path/posix');
var command = ffmpeg();

var connection;
var player;

const initializeAudioPlayer = (channel) => {

    console.log("channel to join: " + JSON.stringify(channel))

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


//TODO: TEST + think about bg volume
const mixEntryAndBG = (userTag) => { //async?
    
    let pathToBG = "assets/audio/bg.mp3";
    let pathToAudio = "assets/audio/tts/";
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

    //TODO: Remove this audio test
    
    const resource = createAudioResource(mixedAudioPath, {});
    player.play(resource);
}

/*TODO: 

implement something like this call from end round?

const playUserEntry = (user) => {
    const resource = createAudioResource(mixedAudioPath, {});
    player.play(resource);
}


implement scratch sound 

const playScratch = (user) => {
    const resource = createAudioResource(TODO, {});
    player.play(resource);
}

*/


module.exports = {initializeAudioPlayer, mixEntryAndBG}
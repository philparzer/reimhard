const { createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel } = require('@discordjs/voice');
const { join } = require('path');
const { createAudioResource, StreamType } = require('@discordjs/voice');
const INDEX = require('../index.js')


//TODO: cut bg file using ffmpeg

const initializeAudioPlayer = (channel) => {

    console.log("channel to join: " + JSON.stringify(channel))

    // FIXME: clean this up?
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
	    adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    //const resource = createAudioResource('./assets/audio/tts/TODO:.mp3', {});

    // player.play(resource);
    connection.subscribe(player);

}


module.exports = {initializeAudioPlayer}
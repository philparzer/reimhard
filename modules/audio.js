const { createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel } = require('@discordjs/voice');
const INDEX = require('../index.js')




const startAudio = (channel) => {// FIXME: channel

    console.log("channel to join: " + JSON.stringify(channel))

    // FIXME:
    // const connection = joinVoiceChannel({
    //     channelId: INDEX.gameData.usersPlaying[0].id,
    //     guildId: INDEX.GUILD_DATA.serverID,
    //     adapterCreator: channel.guild.voiceAdapterCreator,
    // });

    // const player = createAudioPlayer({
    //     behaviors: {
    //         noSubscriber: NoSubscriberBehavior.Pause,
    //     },
    // });

    // var resource = createAudioResource('../assets/audio/bg.mp3');

    // player.play(resource);
    // connection.subscribe(player);

}


module.exports = {startAudio}
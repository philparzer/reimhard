const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const INDEX = require("../index.js");
const AUDIO = require("./audio.js")

//disconnect from voice, clean everything up
const terminate = () => {
    INDEX.gameData.gameRunning = false;

    INDEX.gameData = {
        usersPlaying: [],
        userRoundData: [],
        userStats: [],
        timerRunning: false,
        currentRound: 1,
        voiceChannel: "",
        textChannel: "",
        oddPlayerCount: false,
        voters: [],
        musicPlaying: false,
        gameRunning: false
    }
    
    AUDIO.destroyAudioPlayer();
}

//sends final scoreboard
const sendFinalScore = () => {

    console.log("sending score...")

    let scoreBoardFields = INDEX.gameData.userStats.map(user => { 
    
        return {name: `${user.score}`, value: `${user.player}`}
    
    })

    console.log("unsorted scoreBoard")
    console.log(scoreBoardFields)

    //TODO: does this work?
    scoreBoardFields.sort((a,b) => {return b.name - a.name}) 



    const SCOREBOARD = new MessageEmbed()
                .setColor("#58BFEB")
                .setTitle(`SCOREBOARD`)
                .setDescription('winners, losers and everything in between')
                .addFields({name: `\u200B`, value: `\u200B`}, scoreBoardFields, {name: `\u200B`, value: `\u200B`},)
                .setFooter(`use 'reimhard.start' to play another round`)
                .setThumbnail("https://raw.githubusercontent.com/philparzer/reimhard/main/assets/img/thumbnail_scoreboard.jpg")

    INDEX.gameData.textChannel.send({ embeds: [SCOREBOARD]}).then(msg => {
        terminate();
    })


} 





module.exports = {sendFinalScore, terminate};
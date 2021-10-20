const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const INDEX = require("../index.js");


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
                .setFooter(`use 'signmeup' to play another round`)
                .setThumbnail("https://raw.githubusercontent.com/philparzer/reimhard/main/assets/img/thumbnail_scoreboard.jpg")

    INDEX.gameData.textChannel.send({ embeds: [SCOREBOARD]}).then(msg => {})


} //TODO: disconnect from voice, clean everything up

module.exports = {sendFinalScore};
const INDEX = require("../index.js")
const AUDIO = require("./audio.js")

const START_TIMER = () => {

    console.log("//////////////////////////////////// current round: " + INDEX.gameData.currentRound + " ///////////////////////////////////////////////////////")

    INDEX.gameData.timerRunning = true;

    //FIXME:
    console.log("DEBUG CHANNEL AUDIO")
    console.log(INDEX.gameData.usersPlaying[0].id)
    let member = INDEX.GUILD_DATA.serverID.members.cache.get(INDEX.gameData.usersPlaying[0].id);
    console.log(member)
    //FIXME:

    setTimeout(function(){ 
        
        INDEX.gameData.timerRunning = false;
        console.log("-----------------round data-----------------")
        console.log(INDEX.gameData.userRoundData)
        
        //AUDIO.startAudio(member.guild.channels) //FIXME:

    }, INDEX.config.countdown * 1000);
}


module.exports = {START_TIMER}
const INDEX = require("../index.js")
const AUDIO = require("./audio.js")

const START_TIMER = () => { //FIXME: what does timer even do?

    INDEX.gameData.timerRunning = true;

    setTimeout(function(){ 
        
        INDEX.gameData.timerRunning = false;
        console.log("\n\n\n\n//////////////////////////////////////////\n-----------------ROUND " + (INDEX.gameData.currentRound -1) + "-----------------\n//////////////////////////////////////////")
        console.log("usersPlaying:")
        console.log(INDEX.gameData.userStats)
        console.log("userRoundData:")
        console.log(INDEX.gameData.userRoundData)
        console.log("\n//////////////////////////////////////////\n//////////////////////////////////////////")

    }, INDEX.config.countdown * 1000);
}


module.exports = {START_TIMER}
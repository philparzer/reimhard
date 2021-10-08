const INDEX = require("../index.js")
const AUDIO = require("./audio.js")

const START_TIMER = () => {

    INDEX.gameData.timerRunning = true;

    setTimeout(function(){ 
        
        INDEX.gameData.timerRunning = false;
        console.log("\n-----------------ROUND " + (INDEX.gameData.currentRound -1) + "-----------------")
        console.log(INDEX.gameData.userRoundData)
    

    }, INDEX.config.countdown * 1000);
}


module.exports = {START_TIMER}
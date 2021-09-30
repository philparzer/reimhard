const INDEX = require("../index.js")

const START_TIMER = () => {

    console.log("//////////////////////////////////// current round: " + INDEX.gameData.currentRound + " ///////////////////////////////////////////////////////")

    INDEX.gameData.timerRunning = true;
    
    setTimeout(function(){ 
        
        INDEX.gameData.timerRunning = false;
        console.log("-----------------round data-----------------")
        console.log(INDEX.gameData.userRoundData)
    
    }, INDEX.config.countdown * 1000);
}


module.exports = {START_TIMER}
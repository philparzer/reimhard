const INDEX = require("../index.js")


const initStats = (usernamesPlaying) => {
    
    let i = 0;

    usernamesPlaying.forEach(user => {
        i++
        INDEX.gameData.userStats.push({
            player: user,
            score: 0,
        });
    })

    //if usersPlaying is odd => add reimhard as player for odd one out
    if (i % 2 !== 0) {

        INDEX.gameData.oddPlayerCount = true;

        INDEX.gameData.userStats.push({ //TODO: clean this up? like  player: {"BOT": "Reimhard", tag: "Reimhard#BOT"} + random id is needed for deploy
            player: "Reimhard", tag: "Reimhard#BOT",
            
            score: 0
        })

        INDEX.gameData.usersPlaying.push({
            player: "Reimhard", tag: "Reimhard#BOT",
        })
    }
    
    console.log("\n-----------------users playing-----------------")
    console.log(INDEX.gameData.userStats)
}


module.exports = {initStats}
const INDEX = require("../index.js")


const initStats = (usernamesPlaying) => {
    usernamesPlaying.forEach(user => {
        INDEX.gameData.userStats.push({
            player: user,
            score: 0
        });
    })

    
}


module.exports = {initStats}
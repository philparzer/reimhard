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
        INDEX.gameData.userStats.push({
            player: "Reimhard",
            score: 0
        })

        INDEX.gameData.usersPlaying.push({
            player: "Reimhard", tag: "Reimhard#BOT",
        })
    }
    
    console.log("users:")
    console.log(INDEX.gameData.userStats)

}


module.exports = {initStats}
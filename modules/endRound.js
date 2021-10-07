const { PlayerSubscription } = require("@discordjs/voice")
const INDEX = require("../index.js")
const AUDIO = require("./audio.js")

//split contestants into groups of two and start first 1v1 rap battle
const initRapBattle = () => {
    
    let contestants = INDEX.gameData.usersPlaying.map( (user) => {return {contestant: user, rng: Math.random()}});
    contestants.sort((a, b) => a.rng - b.rng);

    //updates roundData user objects' 1v1 opponent props
    for (let i = 0; i < contestants.length; i++)
    {

        INDEX.gameData.userRoundData.forEach(dataBlock => {

            if (dataBlock.player === contestants[i].contestant) {
                
                if (i % 2 === 0){dataBlock.opponent = contestants[i+1].contestant;}
                else {dataBlock.opponent = contestants[i-1].contestant;}
                
            }
        })

    }

    console.log("-----------------1v1s-----------------")
    INDEX.gameData.userRoundData.forEach(user => console.log(user.player.tag + " is up against " + user.opponent.tag))

    startOneVOne();

}


const voting = () => {
    //TODO:
    //set voting timeout
    //set userRoundData.votingComplete = true 
    //get votes
    //set userRoundData.votes = votes
    //if player1 voting => call nextPlayer()
    //if player2 voting => nextOneVOne()
}

const nextOneVOne = () => {
    //TODO: 
    //check if there is a nextOneVOne coming up => 
    //if => play some interlude mp3 wait a bit then call startOneVOne()
    //else => call cleanUp
}


const startOneVOne = () => {
    //TODO:
    //get 2 next players from userRoundData
    //call nextPlayer() with player1
}

const nextPlayer = (user) => {
    //TODO:
    //call AUDIO.playUserEntry(user)
}

const cleanUp = () => {
    //TODO: 
    //delete all mp3 in /tts
    //reset userRoundData Object
    //call nextRound
}

const nextRound = () => {
    //TODO: 
    //check if end of game
    //initiate next Round
}

module.exports = {initRapBattle, voting}
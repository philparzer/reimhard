const { DiscordAPIError } = require("discord.js")
const INDEX = require("../index.js")
const GENERATE_TTS = require("./generateTTS.js")
const END_GAME = require("./endGame.js");
const INITIALIZE_GAME = require("./initializeGame.js");

const ROUNDS = INDEX.config.rounds;
var currentRound = 0;

const send = (usernamesPlaying, channel) => {
    
    //initialize players if first round
    if (currentRound === 0) {
        INITIALIZE_GAME.initStats(usernamesPlaying)
    }

    //sends prompts to players and sets round data
    if (currentRound < ROUNDS) {
        currentRound++;
        usernamesPlaying.forEach(user => {

            let prompt = "Der Mond scheint auf des Hundes Schnauze,..." //TODO: pick randomly from data structure
            user.send(`here is your prompt: ***${prompt}***`);
            
            INDEX.gameData.userRoundData.push({
                player: user,
                prompt: prompt,
                entry: "",
                votes: 0
            });
            
            // // setTimeout(() => { //TODO: set timeout until TTS should be generated
            // //     // GENERATE_TTS.generate();
            // // }, 5000)
            
        })

        console.log("INDEX DATA STORAGE")
        console.log("----------------------------------")
        console.log("GAME DATA")
        console.log("----------------------------------")
        console.log(JSON.stringify(INDEX.gameData.userStats));
        console.log("ROUND DATA")
        console.log("----------------------------------")
        console.log(INDEX.gameData.userRoundData);

    }

    else {END_GAME.init()};
}

module.exports = {send}
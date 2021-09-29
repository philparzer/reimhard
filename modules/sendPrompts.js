const { DiscordAPIError, MessageEmbed } = require("discord.js")
const INDEX = require("../index.js")
const GENERATE_TTS = require("./generateTTS.js")
const END_GAME = require("./endGame.js");
const INITIALIZE_GAME = require("./initializeGame.js");
const { start } = require("repl");
const ROUNDS = INDEX.config.rounds;

var currentRound = 0; //TODO: refactor into some other script?
var startSeconds; //TODO: refactor into timer.js?

var prompt = "Der Mond scheint auf des Hundes Schnauze" //TODO: pick randomly from data structure
var prompt2 = "Hinten unten bei mir in der Küche"//TODO: pick randomly from data structure
var entry1 = "___";
var entry2 = "___";

//send round prompts to all players///////////////////////////////////////////////////////////////////////////////////////////////////////
const send = (usersPlaying, channel) => {
    
    //initialize players if first round
    if (currentRound === 0) {
        INITIALIZE_GAME.initStats(usersPlaying)
        startSeconds = new Date().getTime() / 1000;
    }

    //sends prompts to players and sets round data
    if (currentRound < ROUNDS) {
        currentRound++;
        startSeconds = new Date().getTime() / 1000;

        usersPlaying.forEach(user => {

            const PROMPT_EMBED = new MessageEmbed()
                .setColor("#EBE340")
                .setAuthor(`ROUND ${currentRound}`, "https://raw.githubusercontent.com/philparzer/reimhard/main/assets/img/reimhard_md.png")
                .addFields(
                    {name: `\u200B`, value: `\`\`\`- ${prompt}\n- ${prompt2}\n- ___\n- ___\`\`\``},
                    {name: `\u200B`, value: `\u200B`}
                )
                .setFooter(`time left: ${INDEX.config.countdown}s`)
                    
            user.send({ embeds: [PROMPT_EMBED]});
            
            
            INDEX.gameData.userRoundData.push({
                player: user,
                prompt: prompt + ", " + prompt2 + ", ",
                entry: "",
                promptCompleted: false,
                votes: 0
            });
            
            // // setTimeout(() => { //TODO: refactor, maybe timer.js?
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

//send preview of user's entries after they sent a DM///////////////////////////////////////////////////////////////////////////////////////////////////////
const updateDM = (entry, user) => {

    var updatedTime = new Date().getTime() / 1000;
    var timeLeft = Math.floor((startSeconds + INDEX.config.countdown) - updatedTime); //TODO: make this global somehow

    //check if call was first or second line and set variables accordingly
    if (entry1 === "___") {entry1 = entry} 
    else if (entry2 === "___") {
        
        entry2 = entry

        INDEX.gameData.userRoundData.forEach(dataBlock => {

            if (dataBlock.player === user) {dataBlock.promptCompleted = true;}
        })
        
    }

    let updatedDM = new MessageEmbed()
                .setColor("#F2C12B")
                .setAuthor(`ROUND ${currentRound}`, "https://raw.githubusercontent.com/philparzer/reimhard/main/assets/img/reimhard_md.png")
                .addFields(
                    {name: `\u200B`, value: `\`\`\`- ${prompt}\n- ${prompt2}\n- ${entry1}\n- ${entry2}\`\`\``},
                    {name: `\u200B`, value: `\u200B`}
                )
                .setFooter(`time left: ${timeLeft}s`)
                    
    user.send({ embeds: [updatedDM]});
    

    //if this was final prompt to complete send done message
    if (entry1 !== "___" && entry2 !== "___")
    {
        doneDM(user)



        //TODO: move somewhere else
        GENERATE_TTS.generate(user);
    }

}


//send done message on completion and on successive DMS when done but round still running ///////////////////////////////////////////////////////////////////////////////////////////////////////
const doneDM = (user) => {
    const DONE_DM_EMBED = new MessageEmbed()
                .setColor("#EB7E28")
                .setAuthor(`ROUND ${currentRound} COMPLETED`) 
            user.send({ embeds: [DONE_DM_EMBED]});
}


module.exports = {send, updateDM, doneDM}
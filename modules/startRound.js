const { DiscordAPIError, MessageEmbed } = require("discord.js")
const INDEX = require("../index.js")
const GENERATE_TTS = require("./generateTTS.js")
const END_GAME = require("./endGame.js");
const END_ROUND = require("./endRound.js")
const INITIALIZE_GAME = require("./initializeGame.js");
const TIMER = require("./timer.js")
const ROUNDS = INDEX.config.rounds;
const AUDIO = require("./audio.js")

var startSeconds;

var prompt1 = "Ich saß auf einem Steine und deckte Bein mit Beine," //TODO: remove global and pick randomly from data structure
var prompt2 = "Hinten unten bei mir in der Küche"//TODO: remove global pick randomly from data structure

//send round prompts to all players///////////////////////////////////////////////////////////////////////////////////////////////////////
const send = (usersPlaying) => {
    
    //initialize players if first round
    if (INDEX.gameData.currentRound === 1) {
        INITIALIZE_GAME.initStats(usersPlaying);
        TIMER.START_TIMER();
        startSeconds = new Date().getTime() / 1000;
    }

    //sends prompts to players and sets round data & set round timer
    if (INDEX.gameData.currentRound < ROUNDS) {
        INDEX.gameData.currentRound++;
        startSeconds = new Date().getTime() / 1000;

        //ROUND HAS ENDED
        setTimeout(function(){
            
            usersPlaying.forEach(user => {
                INDEX.gameData.userRoundData.forEach(dataBlock => {

                    if (dataBlock.player === user && dataBlock.promptCompleted === false) {notCompletedDM(user);} 
                    AUDIO.mixEntryAndBG(dataBlock.player.tag); //TODO: async? maybe mixEntryAndBG recursive call
                })
            })

            //Time until battle starts
            setTimeout(function(){
                END_ROUND.initRapBattle();
            }, 3000)
            
       
        }, INDEX.config.countdown * 1000);


        //sends prompts to players
        usersPlaying.forEach(user => {

            
            //TODO: pick prompts here randomly from data structure
            //TODO: set reimhards prompts and entry1 if he's playing - remove placeholders below


            INDEX.gameData.userRoundData.push({
                player: user,
                prompt1: prompt1,
                prompt2: prompt2,
                entry1: "___",
                entry2: "___",
                promptCompleted: false,
                votes: 0,
                votingCompleted: false,
                opponent: ""
            });

            const PROMPT_EMBED = new MessageEmbed()
                .setColor("#EBE340")
                .setAuthor(`ROUND ${INDEX.gameData.currentRound -1}`, "https://raw.githubusercontent.com/philparzer/reimhard/main/assets/img/reimhard_md.png")
                .addFields(
                    {name: `\u200B`, value: `\`\`\`- ${prompt1}\n- ${prompt2}\n- ___\n- ___\`\`\``},
                    {name: `\u200B`, value: `\u200B`}
                )
                .setFooter(`time left: ${INDEX.config.countdown}s`)
            
            if (user.player !== "Reimhard") { user.send({ embeds: [PROMPT_EMBED]});}
            
            // this generates reimhard's message instantly
            else {
                INDEX.gameData.userRoundData.forEach(userData => {

                    if (userData.player === user) {userData.entry1 = "TODO get randomly1"} 
                })
                updateDM("TODO get randomly2", user);
            }
           
            
        })
    }

    else {END_GAME.init()};
}

//send preview of user's entries after they sent a DM///////////////////////////////////////////////////////////////////////////////////////////////////////
const updateDM = (entry, user) => {

    let updatedTime = new Date().getTime() / 1000;
    let timeLeft = Math.floor((startSeconds + INDEX.config.countdown) - updatedTime);
    let shouldSendDoneDM = false;

    INDEX.gameData.userRoundData.forEach(dataBlock => {

            if (dataBlock.player === user) {

                    shouldSendDoneDM = false;

                    if (dataBlock.entry1 === "___") {dataBlock.entry1 = entry}    //TODO: maybe guard this === undefined and change in output to stop players from using ___ and breaking game
                    
                    else if (dataBlock.entry2 === "___"){
                        dataBlock.entry2 = entry;
                        dataBlock.promptCompleted = true;
                        shouldSendDoneDM = true;
                        GENERATE_TTS.generate(user);
                    }

                    else {console.log("updateDM_ERR")}
                    

                    let updatedDM = new MessageEmbed()
                    .setColor("#F2C12B")
                    .setAuthor(`ROUND ${INDEX.gameData.currentRound -1}`, "https://raw.githubusercontent.com/philparzer/reimhard/main/assets/img/reimhard_md.png")
                    .addFields(
                        {name: `\u200B`, value: `\`\`\`- ${dataBlock.prompt1}\n- ${dataBlock.prompt2}\n- ${dataBlock.entry1}\n- ${dataBlock.entry2}\`\`\``},
                        {name: `\u200B`, value: `\u200B`}
                    )
                    .setFooter(`time left: ${timeLeft}s`)
   
                    if (user.player !== "Reimhard") {dataBlock.player.send({ embeds: [updatedDM]});}

                    if (shouldSendDoneDM) {doneDM(dataBlock.player);}


                }    
    })


}


//send done message on completion and on successive DMS when done but round still running ///////////////////////////////////////////////////////////////////////////////////////////////////////
const doneDM = (user) => {
    const DONE_DM_EMBED = new MessageEmbed()
                .setColor("#EB7E28")
                .setAuthor(`ROUND ${INDEX.gameData.currentRound -1} COMPLETED`) 
                if (user.player !== "Reimhard") { user.send({ embeds: [DONE_DM_EMBED]}); }
}


const notCompletedDM = (user) => {
    const NOT_COMPLETED_DM_EMBED = new MessageEmbed()
                .setColor("#ED4245")
                .setAuthor(`TIME'S UP FOR ROUND ${INDEX.gameData.currentRound -1}`)
                .setFooter('hurry up next time')
                if (user.player !== "Reimhard") { user.send({ embeds: [NOT_COMPLETED_DM_EMBED]}); }
                
}

const roundEndDM = (user) => {
    const ROUND_END_DM_EMBED = new MessageEmbed()
                .setColor("#EB7E28")
                .setAuthor(`ROUND ${INDEX.gameData.currentRound -1} HAS ENDED`)
                if (user.player !== "Reimhard") { user.send({ embeds: [ROUND_END_DM_EMBED]}); }
}


module.exports = {send, updateDM, doneDM, roundEndDM}
const { DiscordAPIError, MessageEmbed } = require("discord.js")
const INDEX = require("../index.js")
const GENERATE_TTS = require("./generateTTS.js")
const END_GAME = require("./endGame.js");
const INITIALIZE_GAME = require("./initializeGame.js");

const ROUNDS = INDEX.config.rounds;
var currentRound = 0;

const send = (usersPlaying, channel) => {
    
    //initialize players if first round
    if (currentRound === 0) {
        INITIALIZE_GAME.initStats(usersPlaying)
    }

    //sends prompts to players and sets round data
    if (currentRound < ROUNDS) {
        currentRound++;
        usersPlaying.forEach(user => {

            let prompt = "Der Mond scheint auf des Hundes Schnauze" //TODO: pick randomly from data structure
            let prompt2 = "Hinten unten bei mir in der Küche"

            const PROMPT_EMBED = new MessageEmbed()
                .setColor("#EBE340")
                .setAuthor(`ROUND ${currentRound}`, "https://raw.githubusercontent.com/philparzer/reimhard/main/assets/img/reimhard_md.png")
                .addFields(
                    {name: `\u200B`, value: `\`\`\`-${prompt}\n-${prompt2}\n- ...\n- ... \`\`\``},
                    {name: `\u200B`, value: `\u200B`}
                )
                .setFooter(`waiting for your DMs — ${INDEX.config.countdown}s to go`)
                    
            user.send({ embeds: [PROMPT_EMBED]});
            
            
            INDEX.gameData.userRoundData.push({
                player: user,
                prompt: prompt + prompt2,
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
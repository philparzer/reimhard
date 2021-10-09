const { PlayerSubscription } = require("@discordjs/voice")
const { match } = require("assert")
const { MessageEmbed } = require("discord.js")
const INDEX = require("../index.js")
const AUDIO = require("./audio.js")
const GENERATE_TTS = require("./generateTTS")

var votingUsers = [];
var contestants = [];
var contestantsIterator = 0;

const createEntryAudio = () => {
    console.log("\n-----------------tts-----------------")
    GENERATE_TTS.generate(INDEX.gameData.userRoundData[0]); //TODO: try this recursive in tts
}


//split contestants into groups of two and start first 1v1 rap battle
const initRapBattle = () => {
    
    contestants = INDEX.gameData.usersPlaying.map( (user) => {return {contestant: user, rng: Math.random()}});
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

    console.log("\n-----------------1v1s-----------------")
    let matchUps = [];
    for (let j = 0; j < INDEX.gameData.userRoundData.length; j++)
    {
        if (j % 2 === 0) {matchUps.push({name: `\u200B`, value: `**${INDEX.gameData.userRoundData[j].player.tag}** VS **${INDEX.gameData.userRoundData[j+1].player.tag}**`})}
    }


    INDEX.gameData.userRoundData.forEach(user => console.log(user.player.tag + " is up against " + user.opponent.tag))


    const START_BATTLE_EMBED = new MessageEmbed()
        .setTitle(`ROUND ${INDEX.gameData.currentRound-1}`)
        .setColor("#F1C02D")
        .setDescription("coming up")
        .addFields(matchUps)
        .setFooter("\u200B")

    INDEX.gameData.textChannel.send({ embeds: [START_BATTLE_EMBED]})

    battleIterator = 0;
    handleOneVOne();

}


const voting = (user) => {
    //FIXME:clean this up
    //TODO:
    //set userRoundData.votingComplete = true 

    //send vote message

    if (votingUsers.length < 2)
        {
            votingUsers.push(user);
            console.log("played entry, pushing " + user.tag)
            console.log("contestant iterator = " + contestantsIterator)
            console.log("votingUsers = " + JSON.stringify(votingUsers))
            handleOneVOne();
        }

    else {

        let user1Prompt1 = ""; let user2Prompt1 = "";
        let user1Prompt2 = ""; let user2Prompt2 = "";
        let user1Entry1 = ""; let user2Entry1 = "";
        let user1Entry2 = ""; let user2Entry2 = "";

        INDEX.gameData.userRoundData.forEach((dataBlock) => {
            if (dataBlock.player === votingUsers[0])
            {
                user1Prompt1 = dataBlock.prompt1;
                user1Prompt2 = dataBlock.prompt2;
                user1Entry1 = dataBlock.entry1;
                user1Entry2 = dataBlock.entry2;
            }

            else if (dataBlock.player === votingUsers[1])
            {
                user2Prompt1 = dataBlock.prompt1;
                user2Prompt2 = dataBlock.prompt2;
                user2Entry1 = dataBlock.entry1;
                user2Entry2 = dataBlock.entry2;
            }
        })

        const VOTE_EMBED = new MessageEmbed()
                .setColor("#F2C12B")
                .setAuthor(`VOTE NOW`, "https://raw.githubusercontent.com/philparzer/reimhard/main/assets/img/reimhard_md.png") //TODO: use author's profile?
                .addFields(
                    {name: `\u200B`, value: `:one:\n\`\`\`- ${user1Prompt1}\n- ${user1Prompt2}\n- ${user1Entry1}\n- ${user1Entry2}\`\`\``},
                    {name: `\u200B`, value: `:two:\n\`\`\`- ${user2Prompt1}\n- ${user2Prompt2}\n- ${user2Entry1}\n- ${user2Entry2}\`\`\``},
                    {name: `\u200B`, value: `\u200B`}
                )
                .setFooter(`TODO SHOW VOTE TIME`)

        INDEX.gameData.textChannel.send({ embeds: [VOTE_EMBED]})
        
        setTimeout(() => {
        
        //TODO: get votes here
    
        //calls next player or initiates next one v one
        

        votingUsers = [];

        }, 15000) //TODO: set in config
    }
    

}

const nextOneVOne = () => {
    //TODO: 
    //check if there is a nextOneVOne coming up => 
    //if => play some interlude mp3 wait a bit then call startOneVOne()
    //else => call cleanUp



}


const handleOneVOne = () => {
    //FIXME:clean this up

    if (contestantsIterator < 2) {
        console.log("playing audio by: " + contestants[contestantsIterator].contestant.tag)
        AUDIO.playUserEntry(contestants[contestantsIterator].contestant);
        contestantsIterator++;
    }

    else {contestantsIterator = 0}
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

module.exports = {initRapBattle, voting, createEntryAudio}
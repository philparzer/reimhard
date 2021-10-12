const { PlayerSubscription } = require("@discordjs/voice")
const { match } = require("assert")
const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js")
const INDEX = require("../index.js")
const AUDIO = require("./audio.js")
const GENERATE_TTS = require("./generateTTS")

var votingUsers = [];
var contestants = [];
var contestantsIterator = 0;

let user1Prompt1 = ""; let user2Prompt1 = "";
let user1Prompt2 = ""; let user2Prompt2 = "";
let user1Entry1 = ""; let user2Entry1 = "";
let user1Entry2 = ""; let user2Entry2 = "";




const createEntryAudio = () => {
    console.log("\n-----------------tts-----------------")
    GENERATE_TTS.generate(INDEX.gameData.userRoundData[0].player);
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

    console.log("\n-----------------AUDIO-----------------")
    handleOneVOne();

}


const voting = (user) => {
    //TODO:
    //set userRoundData.votingComplete = true or remove?

    //send vote message

    

    if (votingUsers.length < 2)
        {
            console.log("::::done")
            votingUsers.push(user);
            handleOneVOne(); 
        }

    else {

        console.log("\n-----------------VOTING-----------------")
        console.log("voting users")
        console.log(votingUsers)

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

        var row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(`${votingUsers[0].tag}`)
					.setLabel("1")
					.setStyle('PRIMARY'),
                new MessageButton()
					.setCustomId(`${votingUsers[1].tag}`)
					.setLabel("2")
					.setStyle('DANGER')
			);

        const VOTE_EMBED = new MessageEmbed()
                .setColor("#EB7C28")
                .setTitle(`VOTE NOW`)
                .addFields(
                    {name: `\u200B`, value: `🔵 **1** \n\`\`\`- ${user1Prompt1}\n- ${user1Prompt2}\n- ${user1Entry1}\n- ${user1Entry2}\`\`\``},
                    {name: `\u200B`, value: `🔴 **2**\n\`\`\`- ${user2Prompt1}\n- ${user2Prompt2}\n- ${user2Entry1}\n- ${user2Entry2}\`\`\``},
                    {name: `\u200B`, value: `\u200B`}
                )
                .setFooter(`${INDEX.config.voteTime}s left to vote`)

        const VOTING_END_EMBED = new MessageEmbed()
                .setColor("#EB7C28")
                .setTitle(`VOTE NOW`)
                .addFields(
                    {name: `\u200B`, value: `🔵 **1** \n\`\`\`- ${user1Prompt1}\n- ${user1Prompt2}\n- ${user1Entry1}\n- ${user1Entry2}\`\`\``},
                    {name: `\u200B`, value: `🔴 **2**\n\`\`\`- ${user2Prompt1}\n- ${user2Prompt2}\n- ${user2Entry1}\n- ${user2Entry2}\`\`\``},
                    {name: `\u200B`, value: `\u200B`}
                )
                .setFooter(`all votes are in`)
        
        INDEX.gameData.textChannel.send({ embeds: [VOTE_EMBED], components: [row]}).then(msg => {
            setTimeout(() => {
                
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                msg.edit({embeds: [VOTING_END_EMBED], components: [row]})

                //TODO: start next rap battle here
                //TODO: reset INDEX.gameData.voted + important think about users not in userRoundData



            }, INDEX.config.voteTime * 1000)
        })


        

    }
}

const nextOneVOne = () => {
    //TODO: 
    //check if there is a nextOneVOne coming up => 
    //if => play some interlude mp3 wait a bit then call startOneVOne()
    //else => call cleanUp



}


const handleOneVOne = () => {

    if (contestantsIterator < 2) {
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
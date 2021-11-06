const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const INDEX = require("../index.js");
const AUDIO = require("./audio.js");
const GENERATE_TTS = require("./generateTTS.js");
const END_GAME = require("./endGame.js");
const fs = require('fs');
var path = require('path')

var battleIterator = 1;
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
        .setTitle(`ROUND ${INDEX.gameData.currentRound}`)
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

    votingUsers.push(user);

    if (votingUsers.length < 2)
        {
            handleOneVOne();
        }

    if (votingUsers.length === 2) {

        console.log("\n-----------------VOTING-----------------")

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
                    {name: `\u200B`, value: `🔵 **1**\n\`\`\`- ${user1Prompt1}\n- ${user1Prompt2}\n- ${user1Entry1}\n- ${user1Entry2}\`\`\``},
                    {name: `\u200B`, value: `🔴 **2**\n\`\`\`- ${user2Prompt1}\n- ${user2Prompt2}\n- ${user2Entry1}\n- ${user2Entry2}\`\`\``},
                    {name: `\u200B`, value: `\u200B`}
                )
                .setFooter(`${INDEX.config.voteTime}s left to vote`)

        const VOTING_END_EMBED = new MessageEmbed()
                .setColor("#EB7C28")
                .setTitle(`BATTLE ${INDEX.gameData.currentRound}.${battleIterator+1}`)
                .addFields(
                    {name: `\u200B`, value: `🔵 ${votingUsers[0].tag}\n\`\`\`- ${user1Prompt1}\n- ${user1Prompt2}\n- ${user1Entry1}\n- ${user1Entry2}\`\`\``},
                    {name: `\u200B`, value: `🔴 ${votingUsers[1].tag}\n\`\`\`- ${user2Prompt1}\n- ${user2Prompt2}\n- ${user2Entry1}\n- ${user2Entry2}\`\`\``},
                    {name: `\u200B`, value: `\u200B`}
                )
                .setFooter(`all votes are in`)
        
        INDEX.gameData.textChannel.send({ embeds: [VOTE_EMBED], components: [row]}).then(msg => {
            setTimeout(() => {
                
                let votes1;
                let votes2;

                INDEX.gameData.userRoundData.forEach(dataBlock => {
                    if (dataBlock.player === votingUsers[0]){
                        votes1 = dataBlock.votes;
                    }

                    else if (dataBlock.player === votingUsers[1]){
                        votes2 = dataBlock.votes;
                    }
                })

                row.components[0].setDisabled(true);
                row.components[0].setLabel(`${votes1}`);
                row.components[1].setDisabled(true);
                row.components[1].setLabel(`${votes2}`);
                msg.edit({embeds: [VOTING_END_EMBED], components: [row]})


                nextOneVOne();


            }, INDEX.config.voteTime * 1000)
        })
    }
}

const nextOneVOne = () => {

    console.log("contestants before")
    console.log(contestants)

    //remove two contestants that just completed rap battle
    contestants.shift();
    contestants.shift();

    console.log("contestants after")
    console.log(contestants)

    contestantsIterator = 0;
    INDEX.gameData.voters = []; //FIXME: maybe better .voters.length=0

    if (contestants.length > 0) { battleIterator++; handleOneVOne();} //TODO: test with more than one user
    else {cleanUp();}

}


const handleOneVOne = () => { //FIXME: this didnt work after first battle

    if (contestantsIterator < 2) {
        console.log("...queueing entry of " + contestants[contestantsIterator].contestant.tag)
        AUDIO.playUserEntry(contestants[contestantsIterator].contestant);
        contestantsIterator++;
    }

    //else {contestantsIterator = 0}
}

const cleanUp = () => {

    console.log("\n-----------------CLEANUP-----------------")

    console.log("\nresetting round data")
    INDEX.gameData.userRoundData.length = 0;

    console.log("\nremoving mp3s")
    let mp3Dir = path.join(__dirname, '..', 'assets', 'audio', 'tts');
    let mp3s = fs.readdirSync(mp3Dir)

    for (let y = 0; y < mp3s.length; y++)
    {
        if (mp3s[y] === ".gitkeep")
        {
            mp3s.splice(y, 1)
        }

        //TODO: make this work for deploy (delete only playing users' mp3)
    }

    console.log("\nresetting vars")
    
    contestants.length = 0;
    contestantsIterator = 0;
    votingUsers.length = 0;
    user1Prompt1 = ""; user2Prompt1 = "";
    user1Prompt2 = ""; user2Prompt2 = "";
    user1Entry1 = "";  user2Entry1 = "";
    user1Entry2 = "";  user2Entry2 = "";

    let mp3Index = 0;

    mp3s.forEach(mp3 => {
        fs.unlink(path.join(mp3Dir, mp3), err => {
            if (err){console.log(err)}
            else {
                
                mp3Index++
                console.log("deleted " + mp3)
                if (mp3Index === mp3s.length)
                {
                    console.log("\n\n\n...waiting for next round to start")
                    setTimeout(() => { nextRound();}, 5000)
                }
            
            }
        })
    })              
}

const nextRound = () => {

    if (INDEX.gameData.currentRound < INDEX.config.rounds)
    {      
        const START_ROUND = require("./startRound.js");
        INDEX.gameData.currentRound++;
        START_ROUND.send(INDEX.gameData.usersPlaying);
    }

    else {END_GAME.sendFinalScore()}

}

module.exports = {initRapBattle, voting, createEntryAudio}
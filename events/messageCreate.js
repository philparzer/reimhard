const { Message, DMChannel, MessageEmbed } = require("discord.js");
var gameRunning = false; //TODO: export?


//TODO: refactoring

module.exports = {
	name: 'messageCreate',

	execute(msg) {
        
        const INDEX = require("../index.js")
        const SENDPROMPTS = require("../modules/sendPrompts")
        var usersPlaying = INDEX.gameData.usersPlaying;
        var playerCount = INDEX.config.playerCount;

//DM///////////////////////////////////////////////////////////////////////////////////////////////////////
        if (msg.channel.type === "DM" && usersPlaying.includes(msg.author)) {

            console.log(msg.content);
            INDEX.gameData.userRoundData.forEach(dataBlock => {

                    if (dataBlock.player === msg.author) {
                        
                        if (dataBlock.promptCompleted === false) {
                            
                            dataBlock.entry += `${msg.content} `;
                            SENDPROMPTS.updateDM(msg.content, msg.author) //TODO: pass in time
                            console.log("userData-----------------")
                            console.log(INDEX.gameData.userRoundData)
                        }
                        
                        else {SENDPROMPTS.doneDM(msg.author)}
                    
                    }
                })
            
            

            return;
        }

//SERVER///////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //adds a player to game queue if empty seat
        const addPlayer = () => {

            if (usersPlaying.includes(msg.author)){ //TODO: uncomment
                msg.channel.send(`come on ${msg.author}... you're already on my list`)
                return;
            }

            if (gameRunning) {msg.channel.send(`game has already started, sign up later`); return;};

                usersPlaying.push(msg.author)
                console.log(usersPlaying)
                console.log(playerCount)
            
            if (usersPlaying.length < playerCount) {
                msg.channel.send(`${msg.author} is playing, ${playerCount - usersPlaying.length} more players needed`)
                
            }

            else if (usersPlaying.length === playerCount) {

                let userFields = usersPlaying.map(user => {return {name: user.tag, value: `\u200B`}})

                const START_MSG_EMBED = new MessageEmbed()
                    .setTitle("LET'S GO")
                    .setColor("#EBE340")
                    .setDescription("give it up for our contestants")
                    .addFields({name: `\u200B`, value: `\u200B`}, userFields)
                    .setFooter("\u200B")
                    .setThumbnail("https://raw.githubusercontent.com/philparzer/reimhard/main/assets/img/thumbnail.jpeg") //TODO: look into this

                msg.channel.send({ embeds: [START_MSG_EMBED]})
                SENDPROMPTS.send(usersPlaying, msg.channel);
                gameRunning = true;
            }

            else {console.log("err")}
        }
        

        switch (msg.content) {
            case "signmeup":
                addPlayer();
                break;
            
            case "test123":
                console.log("test")
                break;
        }
        
	}
};
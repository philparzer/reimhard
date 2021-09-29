const { Message, DMChannel, MessageEmbed } = require("discord.js");
var gameRunning = false; //TODO: export?


//TODO: refactoring

module.exports = {
	name: 'messageCreate',

	execute(msg) {
        
        if (msg.channel.type === "DM" && msg.author.bot === false) {console.log(msg.content); return}

        const INDEX = require("../index.js")
        const SENDPROMPTS = require("../modules/sendPrompts")
        var usersPlaying = INDEX.gameData.usersPlaying;
        var playerCount = INDEX.config.playerCount;

        const addPlayer = () => {

            // if (usersPlaying.includes(msg.author)){ //TODO: uncomment
            //     msg.channel.send(`come on ${msg.author}... you're already on my list`)
            //     return;
            // }

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
                    .setThumbnail("https://raw.githubusercontent.com/philparzer/reimhard/main/assets/img/thumbnail.png"")

                msg.channel.send({ embeds: [START_MSG_EMBED]})
                SENDPROMPTS.send(usersPlaying, msg.channel);
                gameRunning = true;
            }
        
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
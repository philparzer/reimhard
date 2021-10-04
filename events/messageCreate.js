const { Message, DMChannel, MessageEmbed } = require("discord.js");
var gameRunning = false; //TODO: export?


//TODO: refactoring

module.exports = {
	name: 'messageCreate',

	execute(msg) {
        
        const INDEX = require("../index.js")
        const SENDPROMPTS = require("../modules/sendPrompts")
        const TIMER = require("../modules/timer.js")
        var usersPlaying = INDEX.gameData.usersPlaying;
        var playerCount = INDEX.config.playerCount;

//IGNORE BOTS////////////////////////////////////////////////////////////////////////////////////////////////
        if (msg.author.bot) return;

//DM//////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (msg.channel.type === "DM" && usersPlaying.includes(msg.author)) {

            INDEX.gameData.userRoundData.forEach(dataBlock => {

                    if (dataBlock.player === msg.author) {
                        
                        if (dataBlock.promptCompleted === false && INDEX.gameData.timerRunning === true) {
                            
                            SENDPROMPTS.updateDM(msg.content, msg.author) //TODO: pass in time
                            
                        }
                        else {SENDPROMPTS.roundEndDM(msg.author)}
                    
                    }
                })

            return;
        }

//SERVER///////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //adds a player to game queue if empty seat
        const addPlayer = () => {

            if (usersPlaying.includes(msg.author)){ //TODO: uncomment / uncomment for testing
                msg.channel.send(`come on ${msg.author}... you're already on my list`)
                return;
            }

            if (gameRunning) {msg.channel.send(`game has already started, sign up later`); return;};

            usersPlaying.push(msg.author)

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
                    .setThumbnail("https://raw.githubusercontent.com/philparzer/reimhard/main/assets/img/thumbnail.jpeg")

                msg.channel.send({ embeds: [START_MSG_EMBED]})
                SENDPROMPTS.send(usersPlaying);
                gameRunning = true;
            }

            else {console.log("err")}
        }
        
        //FIXME:
        if (INDEX.GUILD_DATA.serverID === "") {INDEX.GUILD_DATA.serverID = msg.guild; console.log("GUILD ID: " + INDEX.GUILD_DATA.serverID);}
        

        switch (msg.content) {
            case "signmeup":
                addPlayer();
                break;
            
            case "reimhard.commands":

                const COMMANDS_EMBED = new MessageEmbed()
                    .setTitle("COMMANDS")
                    .setColor("#58BEEB")
                    
                    .addFields(
                        {name: "\u200B", value: "GAME"},
                        {name: "```signmeup```", value: "start playing / join the queue"},
                        {name: "\u200B", value: "META"},
                        {name: "```reimhard.settings```", value: "set game rules"},
                        {name: "```reimhard.commands```", value: "get all available commands"})
                    .setFooter("\u200B")

                msg.channel.send({embeds: [COMMANDS_EMBED]})
                break;

            case "reimhard.settings": //TODO: EMBED, IMPLEMENT
                msg.channel.send("```TODO```")

        }
        
	}
};
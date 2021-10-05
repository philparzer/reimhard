const { Message, DMChannel, MessageEmbed } = require("discord.js");
var gameRunning = false; //TODO: export?


//TODO: refactoring

module.exports = {
	name: 'messageCreate',

	execute(msg) {
        
        const INDEX = require("../index.js")
        const START_ROUND = require("../modules/startRound")
        const TIMER = require("../modules/timer.js")
        const AUDIO = require("../modules/audio.js")
        var usersPlaying = INDEX.gameData.usersPlaying;
        var playerCount = INDEX.config.playerCount;
    

//IGNORE BOTS////////////////////////////////////////////////////////////////////////////////////////////////
        if (msg.author.bot) return;

//DM//////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (msg.channel.type === "DM" && usersPlaying.includes(msg.author)) {

            INDEX.gameData.userRoundData.forEach(dataBlock => {

                    if (dataBlock.player === msg.author) {
                        
                        if (dataBlock.promptCompleted === false && INDEX.gameData.timerRunning === true) {
                            
                            START_ROUND.updateDM(msg.content, msg.author) //TODO: pass in time
                            
                        }
                        else {START_ROUND.roundEndDM(msg.author)}
                    
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
                let onePlayerNeeded = playerCount - usersPlaying.length === 1
                let playerStr = "players";      
                if (onePlayerNeeded) {playerStr = "player"}          
                msg.channel.send(`${msg.author} is playing in ${INDEX.gameData.voiceChannel}, I need **${playerCount - usersPlaying.length}** more ${playerStr}`)                
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
                START_ROUND.send(usersPlaying);
                gameRunning = true;
            }

            else {console.log("err")}
        }


        const errorVoice = () => {
            const ERROR_EMBED = new MessageEmbed()
                    .setTitle("ERROR")
                    .setColor("#ED4245")
                    .setDescription(`${msg.author} please join a voice channel`)
                    .setFooter("\u200B")

                msg.channel.send({embeds: [ERROR_EMBED]})
        }


        //set server
        if (INDEX.GUILD_DATA.serverID === "") {INDEX.GUILD_DATA.serverID = msg.guild; console.log("GUILD ID: " + INDEX.GUILD_DATA.serverID);}
        

        switch (msg.content) {
            
            case "signmeup":

                if (gameRunning) {return;}

                console.log(INDEX.gameData.voiceChannel)

                if (!msg.member.voice.channel) {errorVoice()} //TODO: check if this works w more than one voice channel
                
                else if (INDEX.gameData.voiceChannel === "") {
                    AUDIO.initializeAudioPlayer(msg.member.voice.channel);
                    INDEX.gameData.voiceChannel = msg.member.voice.channel;
                    console.log(INDEX.gameData)
                    addPlayer();
                }

                else {
                    addPlayer();

                }
                
                break;
            
            case "reimhard.commands": //TODO: add more e.g. stop game

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
                if (gameRunning) {return;}
                msg.channel.send("```TODO```")

        }
        
	}
};
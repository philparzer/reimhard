const { Message, DMChannel, MessageEmbed} = require("discord.js");

module.exports = {
	name: 'messageCreate',

	execute(msg) {
        
        const INDEX = require("../index.js");
        const START_ROUND = require("../modules/startRound");
        const END_GAME = require("../modules/endGame.js")
        const AUDIO = require("../modules/audio.js");
        var usersPlaying = INDEX.gameData.usersPlaying;
        var playerCount = INDEX.config.playerCount;
    

//IGNORE BOTS////////////////////////////////////////////////////////////////////////////////////////////////
        if (msg.author.bot) return;

//DM//////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (msg.channel.type === "DM" && usersPlaying.includes(msg.author)) {

            INDEX.gameData.userRoundData.forEach(dataBlock => {

                    if (dataBlock.player === msg.author) {
                        
                        if (dataBlock.promptCompleted === false && INDEX.gameData.timerRunning === true) {
                            
                            START_ROUND.updateDM(msg.content, msg.author)
                            
                        }
                        else {START_ROUND.roundEndDM(msg.author)}
                    
                    }
                })

            return;
        }

//SERVER///////////////////////////////////////////////////////////////////////////////////////////////////////
        

        const settingsError = () => {
            const ERROR_SETTINGS_EMBED = new MessageEmbed()
                    .setTitle("ERROR")
                    .setColor("#ED4245")
                    .setDescription(`check 'reimhard.settings' for correct input values`)

            msg.channel.send({embeds: [ERROR_SETTINGS_EMBED], ephemeral: true})
        }

        const settingsUpdated = () => {
            const SETTINGS_UPDATE_EMBED = new MessageEmbed()
                    .setTitle("UPDATED SETTINGS")
                    .setColor("#58BEEB")
                    .addFields(
                        {name: "\u200B", value: `\`\`\`language: ${INDEX.config.language}\nplayers: ${INDEX.config.playerCount}\nrounds: ${INDEX.config.rounds}\npromptTime: ${INDEX.config.countdown}\nvoteTime: ${INDEX.config.voteTime}\`\`\``})

            msg.channel.send({embeds: [SETTINGS_UPDATE_EMBED], ephemeral: true})
        }

        //adds a player to game queue if empty seat
        const addPlayer = () => {

            if (usersPlaying.includes(msg.author)){
                msg.channel.send(`come on ${msg.author}... you're already on my list`)
                return;
            }

            if (INDEX.gameData.gameRunning) {msg.channel.send(`game has already started, sign up later`); return;};

            usersPlaying.push(msg.author)

            if (usersPlaying.length < playerCount) {
                let onePlayerNeeded = playerCount - usersPlaying.length === 1
                let playerStr = "players";      
                if (onePlayerNeeded) {playerStr = "player"}          
                msg.channel.send(`${msg.author} is playing in ${INDEX.gameData.voiceChannel}, I need **${playerCount - usersPlaying.length}** more ${playerStr}`)                
            }

            else if (usersPlaying.length === playerCount) {

                
                let userFields = usersPlaying.map(user => {return {name: `\u200B`, value: `${user}`}})
                START_ROUND.send(usersPlaying);
                INDEX.gameData.textChannel = msg.channel;

                let oddFooter = `\u200B`
                if (INDEX.gameData.oddPlayerCount === true) {oddFooter = "Reimhard joins the battle due to odd player count"}

                const START_MSG_EMBED = new MessageEmbed()
                    .setTitle("LET'S GO")
                    .setColor("#EBE340")
                    .setDescription("give it up for our contestants")
                    .addFields(userFields, {name: `\u200B`, value: `\u200B`})
                    .setFooter(oddFooter)
                    .setThumbnail("https://raw.githubusercontent.com/philparzer/reimhard/main/assets/img/thumbnail.jpeg")

                msg.channel.send({ embeds: [START_MSG_EMBED]})
                
                
                INDEX.gameData.gameRunning = true;
            }

            else {console.log("err")}
        }


        const errorVoice = () => {
            const ERROR_EMBED = new MessageEmbed()
                    .setTitle("ERROR")
                    .setColor("#ED4245")
                    .setDescription(`${msg.author} please join a voice channel`)

                msg.channel.send({embeds: [ERROR_EMBED]})
        }


        //set server
        if (INDEX.GUILD_DATA.serverID === "") {INDEX.GUILD_DATA.serverID = msg.guild; console.log("GUILD ID: " + INDEX.GUILD_DATA.serverID);}

        let reg = /\d+/

        switch (msg.content) {
            
            case "reimhard.start":

                if (INDEX.gameData.gameRunning) {return;}

                if (!msg.member.voice.channel) {errorVoice()}
                
                else if (INDEX.gameData.voiceChannel === "") {
                    AUDIO.initializeAudioPlayer(msg.member.voice.channel);
                    INDEX.gameData.voiceChannel = msg.member.voice.channel;
                    addPlayer();
                }

                else {
                    addPlayer();

                }
                
                break;

            case "reimhard.stop": //this crashes the bot FIXME: use a lot of try catch blocks?
                
                if (!INDEX.gameData.gameRunning) {
                        const ERROR_NOT_RUNNING_EMBED = new MessageEmbed()
                        .setTitle("ERROR")
                        .setColor("#ED4245")
                        .setDescription(`there is no game currently running`)

                        msg.channel.send({embeds: [ERROR_NOT_RUNNING_EMBED]})
                    ;}
                
                else {

                    END_GAME.terminate();

                    const BYE = new MessageEmbed()
                        .setTitle("BYE")
                        .setDescription("I'm out")
                        .setColor("#EBE240")
                    msg.channel.send({embeds: [BYE]})
                    
                }

                break;
            
            
            case "reimhard.commands": 

                const COMMANDS_EMBED = new MessageEmbed()
                    .setTitle("COMMANDS")
                    .setColor("#58BEEB")
                    
                    .addFields(
                        {name: "\u200B", value: "GAME"},
                        {name: "```reimhard.start```", value: "start playing / join the queue"},
                        {name: "```reimhard.stop```", value: "start playing / join the queue"},
                        {name: "\u200B", value: "META"},
                        {name: "```reimhard.settings```", value: "set game rules"},
                        {name: "```reimhard.commands```", value: "get all available commands"})
                    .setFooter("\u200B")

                msg.channel.send({embeds: [COMMANDS_EMBED]})
                break;

            case "reimhard.settings":
                if (INDEX.gameData.gameRunning) {return;}
                
                const SETTINGS_EMBED = new MessageEmbed()
                    .setTitle("SETTINGS")
                    .setColor("#58BEEB")
                    .setDescription("set values like this: \n```reimhard.settings.language=en\nreimhard.rounds=5```")
                    .addFields(
                        {name: "language", value: "```reimhard.settings.language=```", inline:true}, {name: "\u200B", value: `\`\`\`${INDEX.CONTENT_DATA.includedLanguages}\`\`\``, inline:true},
                        {name: "\u200B", value: "\u200B"},
                        {name: "player count", value: "```reimhard.settings.players=```", inline:true}, {name: "\u200B", value: "```a number not smaller than 1```", inline:true},
                        {name: "\u200B", value: "\u200B"},
                        {name: "number of rounds", value: "```reimhard.settings.rounds=```", inline:true}, {name: "\u200B", value: "```a number not smaller than 1```", inline:true},
                        {name: "\u200B", value: "\u200B"},
                        {name: "time to create lines (in seconds)", value: "```reimhard.settings.promptTime=```", inline:true}, {name: "\u200B", value: "```a number bigger than 10```", inline:true},
                        {name: "\u200B", value: "\u200B"},
                        {name: "time to vote (in seconds)", value: "```reimhard.settings.voteTime=```", inline:true}, {name: "\u200B", value: "```a number bigger than 15```", inline:true})

                msg.channel.send({embeds: [SETTINGS_EMBED]})

                break;
            
            
        }

        if (msg.content.startsWith("reimhard.settings.language=")){
                
            let langInput = [];
            let inputArr = msg.content.split("");
            langInput.unshift(inputArr.pop());
            langInput.unshift(inputArr.pop());

            let parsedLangInput = langInput.join("");
            console.log("language: " + parsedLangInput);
            
            if (INDEX.CONTENT_DATA.includedLanguages.includes(parsedLangInput))
            {
                INDEX.config.language = parsedLangInput;
                settingsUpdated();
            }

            else {
                settingsError();
            }
         }

        if (msg.content.startsWith("reimhard.settings.players=") || msg.content.startsWith("reimhard.settings.rounds=") || msg.content.startsWith("reimhard.settings.voteTime=")|| msg.content.startsWith("reimhard.settings.promptTime=")){
            
            let num = msg.content.replace(/^\D+/g, '')
            

            if (num === "") {settingsError(); return;}

            
            if (msg.content.includes("players")){
                if (num < 2){settingsError();  return;}
                console.log("players: " + num)
                //TODO: implement changes
                settingsUpdated();
            }
            if (msg.content.includes("rounds")){
                if (num < 1){settingsError();  return;}
                console.log("rounds: " + num)
                //TODO: implement changes
                settingsUpdated();
            }
            if (msg.content.includes("voteTime")){
                if (num < 16){settingsError();  return;}
                console.log("voteTime: " + num)
                //TODO: implement changes
                settingsUpdated();
            }
            if (msg.content.includes("promptTime")){
                if (num < 10){settingsError();  return;}
                console.log("promptTime: " + num)
                //TODO: implement changes
                settingsUpdated();
            }
                

        }

        
	}
};
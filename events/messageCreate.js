const { Message, DMChannel } = require("discord.js");
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
                let usernamesPlaying = usersPlaying.map(user => user)
                let lastUser = usernamesPlaying.pop();
                msg.channel.send(`give it up for our contestants: \n${usernamesPlaying.join(", ")} and ${lastUser} \n \n**let's go!**`)
                SENDPROMPTS.send(usernamesPlaying, msg.channel);
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
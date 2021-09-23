require('dotenv').config()
const { Client, Intents } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(process.env.BOT_TOKEN)

//globals///////////////////////////////////////////////////////////////////////////////////////////////////////
var NUM_OF_PLAYERS;

//config///////////////////////////////////////////////////////////////////////////////////////////////////////
fs.readFile("./config.json", "utf8", (err, configData) => {
    if (err) {console.log("error reading from file")}
    
    try {
        NUM_OF_PLAYERS = JSON.parse(configData).PLAYER_NUM
        console.log(NUM_OF_PLAYERS)
    }
    catch (err) {console.log("error parsing JSON")}
})
var usersPlaying = [];

//functions/////////////////////////////////////////////////////////////////////////////////////////////////////

const startGame = () => {}

const addPlayer = (msg) => {

    // if (usersPlaying.includes(msg.author)){ TODO: uncomment
    //     msg.channel.send(`come on ${msg.author}... you're already on my list`)
    //     return;
    // }

    usersPlaying.push(msg.author)

    if (usersPlaying.length < NUM_OF_PLAYERS) {
        msg.channel.send(`${msg.author} is playing, ${NUM_OF_PLAYERS - usersPlaying.length} more players needed`)
    }
    else {
        let usernamesPlaying = usersPlaying.map(user => user.username)
        let lastUser = usernamesPlaying.pop();
        msg.channel.send(`give it up for our contestants: \n${usernamesPlaying.join(", ")} and ${lastUser} \n \n**let's go!**`)
        startGame();
    }
} 

//events////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on("ready", () => {
    console.log("bot-ready")
    })

client.on("messageCreate", msg => {
    switch (msg.content) {
        case "signmeup":
            addPlayer(msg);
            break;
    }
})
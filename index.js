require('dotenv').config()
const { Client, Intents } = require('discord.js');
const config = require('./config.json');
const googleTTS = require('node-google-tts-api');
const fs = require('fs');

const discordTTS = require('discord-tts'); //TODO: try
const tts = new googleTTS();
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
        
        case "test123":
            // const broadcast = client.voice.createBroadcast();
            // const channelId = msg.member.voice.channelID;
            // const channel = client.channels.cache.get(channelId);
            // channel.join().then(connection => {
            //     broadcast.play(discordTTS.getVoiceStream('test 123'));
            //     const dispatcher = connection.play(broadcast);
            // });
            // break; FIXME: DEPRECATED? TODO: join voice and play mp3
    }
})

//TODO: autogenerate + send prompt + get completed prompt from player's DM channel
tts.get({
  text: "Der Mond scheint auf des Hundes Schnauze, deine Mutter ist ne Jause",
  lang: "de"
}).then(data => {
  // returns mp3 audio src buffer
  fs.writeFileSync("./audio.mp3", data);
});
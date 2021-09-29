require('dotenv').config()
const { Client, Intents} = require('discord.js');
const fs = require('fs');
const CLIENT = new Client({ intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES] });

CLIENT.login(process.env.BOT_TOKEN)

//config///////////////////////////////////////////////////////////////////////////////////////////////////////

var config = {
    language: 'de', //ISO language code
    playerCount: 1, //players needed until reimhard starts the game
	countdown: 30, //in seconds
	rounds: 5 //how many prompts are send to each user
}

var gameData = {
    usersPlaying: [], //arr of all Discord user Objects that are playing
	userRoundData: [], //arr of round-specific data [{ {player:discord.user,}, prompt:string, entry:string, promptCompleted:bool, votes:int}
	userStats: [] //arr of game specific data [{player:discord.user, score:int}]
}
//events///////////////////////////////////////////////////////////////////////////////////////////////////////
// Set the bot's "Playing: " status (must be in an event!)

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		CLIENT.once(event.name, (...args) => event.execute(...args));
	} else {
		CLIENT.on(event.name, (...args) => event.execute(...args));
	}
}




module.exports = {config, gameData, CLIENT}
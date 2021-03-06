//FIXME: odd player count off-by-one + voting for players

require('dotenv').config()
const { Client, Intents} = require('discord.js');
const fs = require('fs');
const CLIENT = new Client({ intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, 'GUILD_VOICE_STATES'] });

CLIENT.login(process.env.BOT_TOKEN)

//data///////////////////////////////////////////////////////////////////////////////////////////////////////

const CONTENT_DATA = {
	includedLanguages: ["en", "de", "ru"]
}

const GUILD_DATA = {
	serverID: ""
}

var config = {
    language: 'de', //ISO language code
    playerCount: 2, //players needed until reimhard starts the game 
	countdown: 60, //in seconds
	rounds: 1, //how many prompts are send to each user
	voteTime: 30 //in seconds
}

var gameData = {
    usersPlaying: [], //arr of all Discord user Objects that are playing
	userRoundData: [], //arr of round-specific data [player:{discord.user}, prompt1:string, prompt2:string, entry1:string, entry2:string, promptCompleted:bool, votes:int, votingCompleted: bool, opponent{discord.user/reimhard}}]
	userStats: [], //arr of game specific data [{player:discord.user, score:int}]
	timerRunning: false,
	currentRound: 1,
	voiceChannel: "",
	textChannel: "",
	oddPlayerCount: false,
	voters: [],
	musicPlaying: false,
	gameRunning: false
}

//events///////////////////////////////////////////////////////////////////////////////////////////////////////

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		CLIENT.once(event.name, (...args) => event.execute(...args));
	} else {
		CLIENT.on(event.name, (...args) => event.execute(...args));
	}
}

module.exports = {config, gameData, CLIENT, GUILD_DATA, CLIENT, CONTENT_DATA}
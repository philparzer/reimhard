module.exports = { //TODO: remove or change to something more useful
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`\n\n\n\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity("🔥 rhymes", { type: "LISTENING"})
	},
};
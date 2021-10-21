module.exports = {
	name: 'interactionCreate',

	execute(inter) {

        const {MessageEmbed} = require("discord.js")
        const INDEX = require("../index.js")

        //vote interactions via vote embed buttons, adds vote to receiver's score
        if (inter.isButton){

            let btnPresser = inter.user;
            let voteReceiver = inter.customId;
            let presserData = "";


            INDEX.gameData.userRoundData.forEach(dataBlock2 => {
                if (dataBlock2.player === btnPresser){
                    presserData = dataBlock2;
                }
            })
            
            const ERROR_VOTE_SELF = new MessageEmbed()
                .setTitle(`**ERROR**`)
                .setColor("#ED4245")
                .setDescription("you can't vote for yourself")

            const ERROR_VOTE_NUM = new MessageEmbed()
                .setTitle(`**ERROR**`)
                .setColor("#ED4245")
                .setDescription("you've already cast your vote")

            const SUCCESS_VOTE = new MessageEmbed()
                .setTitle(`**SUCCESS**`)
                .setColor("#58BFEB")
                .setDescription(`you voted for ${voteReceiver}`)

            if (btnPresser.tag === voteReceiver) {inter.reply({embeds: [ERROR_VOTE_SELF], ephemeral: true}); return}
            if (INDEX.gameData.voters.includes(presserData)) {inter.reply({embeds: [ERROR_VOTE_NUM], ephemeral: true}); return}

            INDEX.gameData.voters.push(presserData);

            INDEX.gameData.userRoundData.forEach(dataBlock => {
                if (dataBlock.player.tag === voteReceiver) {
                    dataBlock.votes++;
                    presserData.voted = true;
                    inter.reply({embeds: [SUCCESS_VOTE], ephemeral: true});
                }
            })

            console.log("executing interaction")
            console.log(INDEX.gameData.userStats)

            INDEX.gameData.userStats.forEach(statData => {

                try { // receiver is Bot TODO: remove as soon as bot object is changed
                    if (statData.tag === voteReceiver) {
                    console.log(btnPresser.tag + " voted for " + voteReceiver)
                    statData.score += 1;
                    }
                } 
                catch {
                    if (statData.player.tag === voteReceiver) {
                        console.log(btnPresser.tag + " voted for " + voteReceiver)
                        statData.score += 1;
                    }
                }                

            })

        }
    }
}
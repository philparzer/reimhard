//button voting


module.exports = {
	name: 'interactionCreate',




	execute(inter) { //TODO: testing


        const INDEX = require("../index.js")

        if (inter.isButton){

            let btnPresser = inter.user;
            let voteReceiver = inter.customId;
            let presserData = "";


            INDEX.gameData.userRoundData.forEach(dataBlock2 => {
                if (dataBlock2.player === btnPresser){
                    presserData = dataBlock2;
                }
            })


            if (btnPresser.tag === voteReceiver || presserData.voted) {console.log(`${btnPresser} not eligible to vote`); return}

            INDEX.gameData.userRoundData.forEach(dataBlock => {
                if (dataBlock.player.tag === voteReceiver) {
                    dataBlock.votes++;
                    presserData.voted = true;
                    inter.reply({content: `you voted for ${voteReceiver}`, ephemeral: true});
                }
            })


            console.log(INDEX.gameData.userRoundData);

        }
    }
}
const Discord = require('discord.js');
const awaitMessagesOptions = require("../config.json").awaitMessagesOptions
const errorMessage = require("../config.json").errorMessage

module.exports = (message,args) => {
	
	if (args.length >= 1) {
		createLink(args.join('+'));
	} else if (args.length == 0) {
		message.reply('tu veux quoi ?').then(() => {
			message.channel.awaitMessages(response => response.content.length > 0 ,awaitMessagesOptions)
			.then(collected => {
				createLink(collected.first().content);
			}).catch(() => {
				message.reply(errorMessage.waitingToMuch);
			});
		});
	}
	
	function createLink(search) {
		let url = "https://www.amazon.fr/s/ref=nb_sb_noss?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&url=search-alias%3Daps&field-keywords="+search;
		message.reply(new Discord.RichEmbed()
			.setTitle("Recherche amazon pour: "+search)
			.setColor(0xF3A847)
			.setDescription(url)
			.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/b/b4/Amazon-icon.png")
			.setTimestamp()
			.setURL(url)
		);
	}
	
}


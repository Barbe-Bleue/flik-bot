const errorMessage = require("../config.json").errorMessage;

module.exports = (message,bot) => {
	
	const isAdmin = !message.author.kickable;
	if(isAdmin) {
		message.channel.send("@everyone Ah ok on me bute comme ça :tired_face: :gun:");
		setTimeout(() => {
			bot.destroy();
		}, 2000);
	} else {
		message.reply(errorMessage.notAdmin);
	}
}

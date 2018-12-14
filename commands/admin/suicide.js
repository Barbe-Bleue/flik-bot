const errorMessage = require("../../config.json").errorMessage;

module.exports = (message,/*bot*/) => {
	const isAdmin = !message.author.kickable;
	if(isAdmin) {
		message.channel.send("@everyone Ah ok on me bute comme ça :tired_face: :gun:");
		//bot.destroy();
	} else {
		message.reply(errorMessage.notAdmin);
	}
}

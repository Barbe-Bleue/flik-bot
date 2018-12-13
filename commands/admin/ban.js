const errorMessage = require("../../config.json").errorMessage

module.exports = message => {
	const isAdmin = !message.author.kickable;
	if (isAdmin) {
		if (message.mentions.members.first()) {
			message.mentions.members.first().kick().then(victime => {
				message.channel.send("@everyone :wave: **" + victime.displayName + "** a été kické :point_right: ");
			}).catch(() => {
				message.reply("On ne peut pas bannir Dieu :cross:");
			});
		} else {
			message.reply("Je peux pas bannir tout le monde ca ne se fait pas !");
		}
	} else {
		message.reply(errorMessage.notAdmin);
	}
}

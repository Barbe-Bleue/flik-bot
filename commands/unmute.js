const errorMessage = require("../config.json").errorMessage;

module.exports = message => {
	const isAdmin = !message.author.kickable;
	
	if (isAdmin){
		message.channel.overwritePermissions(message.mentions.members.first(), {
 		 SEND_MESSAGES: true
 	 }).then(() => message.channel.send("On libère "+message.mentions.members.first()+", tu peux reparler maintenant :ok_hand: :slight_smile:"));
	} else {
		message.reply(errorMessage.notAdmin);
	}
}

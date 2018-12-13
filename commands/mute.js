const errorMessage = require("../config.json").errorMessage;
const muteTime =  require("../config.json").muteTime;

module.exports = (message,args) => {
	const isAdmin = !message.author.kickable;
	
	if (isAdmin){
		let time = args[1] ? args[1] * 1000 : muteTime
		message.channel.overwritePermissions(message.mentions.members.first(), {
      SEND_MESSAGES: false
    }).then(() => {
      message.channel.send(message.mentions.members.first()+" a été mute pour "+time / 1000+" secondes. Fallait pas faire chier :kissing_heart:")
    });
		
    setTimeout(() => {
			message.channel.overwritePermissions(message.mentions.members.first(), {
	      SEND_MESSAGES: true
	    }).then(() => message.channel.send("On libère "+message.mentions.members.first()+", tu peux reparler maintenant :ok_hand: :slight_smile:"));
    },time);
	} else {
		message.reply(errorMessage.notAdmin);
	}
}

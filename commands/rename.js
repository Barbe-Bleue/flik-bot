const errorMessage = require("../config.json").errorMessage

module.exports = (message,args) => {
	const isAdmin = !message.author.kickable;
	
	if (args[1] && isAdmin) {
		message.mentions.members.first().setNickname(args[1]);
		message.channel.send("Hey @everyone ! "+message.author+" a changé le nom de "+message.mentions.members.first()+" en ***"+args[1]+"***");
	} else if (args[1] && !isAdmin) {
		message.reply(errorMessage.notAdmin);
	} else if(args[0]) {
		message.member.setNickname(args[0]);
		message.channel.send("Hey @everyone ! "+message.author+" a changé son nom en ***"+args+"***");
	} else {
		message.channel.send('Pseudo invalide')
	}
}

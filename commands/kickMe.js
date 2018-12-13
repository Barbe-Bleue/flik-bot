module.exports = message => {
	if (!message.author.kickable) {
		message.reply("Je peux pas te kick t'es admin.");
	} else {
		message.reply("ok.").then(() => message.member.kick());
	}
}

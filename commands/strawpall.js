module.exports = (message,args) => {
	if (args.length > 1) {
		message.channel.send(":apple:***SONDAGE :apple:\n"+args.join(" ")+"***")
		.then(message => {
			message.react("👍")
			message.react("👎")
		})
	} else {
		message.reply("Indique la raison du sondage")
	}
}

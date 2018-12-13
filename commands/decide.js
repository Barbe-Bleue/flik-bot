module.exports = (args,message) => {
	message.reply("Le choix est : " + args[Math.floor(Math.random() * args.length)]);
}

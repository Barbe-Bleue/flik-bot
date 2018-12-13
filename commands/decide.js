module.exports = (message,args) => {
	message.reply("Le choix est : " + args[Math.floor(Math.random() * args.length)]);
}

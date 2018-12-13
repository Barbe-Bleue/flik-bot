const Discord = require('discord.js');
const awaitMessagesOptions = require("../config.json").awaitMessagesOptions
const errorMessage = require("../config.json").errorMessage
const google = require("google");
const googleResults =  require("../config.json").googleResults

module.exports = (message,args) => {
	google.l
	google.resultsPerPage = googleResults+1;
	google.lang = 'fr';
	google.tld = 'fr';
	google.nextText='Plus';
	google.protocol = 'https';
	
	if (args.length >= 1) {
		getGoogleResults(args.join('-'))
	} else if (args.length == 0) {
		message.reply('tu veux quoi ?').then(() => {
			message.channel.awaitMessages(response => response.content.length > 0 ,awaitMessagesOptions)
			.then(collected => {
				console.log();
				getGoogleResults(collected.first().content)
			}).catch(() => {
				message.reply(errorMessage.waitingToMuch);
			});
		});
	}
	
 	 async function getGoogleResults(search) {
		 await google(search, (err,data ) => {
		 data.links.forEach(link => {
			 console.log(link);
			 if(link.href) {
				 message.reply(new Discord.RichEmbed()
				 .setTitle(link.title)
				 .setColor(0x4285F4)
				 .setDescription(link.description)
				 .setThumbnail("http://diylogodesigns.com/blog/wp-content/uploads/2016/04/google-logo-icon-PNG-Transparent-Background.png")
				 .setURL(link.href))
			 }		 
		 });
	 })	
	}
}

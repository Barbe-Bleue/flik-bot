const axios = require("axios");
const Discord = require('discord.js');
const google = require("google");
const googleResults =  require("../config.json").googleResults

module.exports = async (message,args) => {
	let search = args.join(' ');
	google.l
	google.resultsPerPage = googleResults;
	google.lang = 'fr';
	google.tld = 'fr';
	google.nextText='Plus';
	google.protocol = 'https';

 	await google(search, (err,data ) => {
		data.links.forEach(link => {
			if(link.title != "") {
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

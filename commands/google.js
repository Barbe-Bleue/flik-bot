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
				getGoogleResults(collected.first().content)
			}).catch(() => {
				message.reply(errorMessage.waitingToMuch);
			});
		});
	}
	
	async function getGoogleResults(search) {
		await google(search, (err,data ) => {
			data.links.forEach(link => {
			 	if(link.href) {
					message.reply({embed : {
	  				title: link.title,
	  				color: 4359668,
						url: link.href,
	          fields: [
	            {name: "Description", value: link.description},
	          ],
	  				thumbnail: {
	  					url: "https://www.supinfo.com/articles/resources/143087/5849/0.png"
	  				}
  				}});
				}
	 		})	
 		})
	}
}
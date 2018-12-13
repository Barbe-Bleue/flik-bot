const axios = require("axios");
const awaitMessagesOptions = require("../config.json").awaitMessagesOptions

module.exports = (args,message) => {	
	if (args.length >= 1) {
		getLink(args.join('-'))
	} else if (args.length == 0) {
		message.reply('tu veux quoi ?').then(() => {
			message.channel.awaitMessages(response => response.content.length > 0 ,awaitMessagesOptions)
			.then(collected => {
				getLink(collected.first().content)
			}).catch(() => {
				message.reply(errorMessage.waitingToMuch);
			});
		});
	}
	
	async function getLink(recherche) {
		let search = "Recherche wikipedia pour: "+recherche+"\n";
		let res = await axios.get("https://fr.wikipedia.org/w/api.php?action=opensearch&search="+recherche+"&limit=1&namespace=0&format=json")

		if(res.data[1].length === 0) {
			message.reply(search +="Aucun résultats")
		} else {
			message.reply(search += "Nom: "+res.data[1]+"\n"+res.data[3]+"\n\n")
		}
	}
}


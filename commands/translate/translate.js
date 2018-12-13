const Discord = require('discord.js');
const flagList = require("./flag.json");
const yandexApiKey = require("../../config.json").yandexApiKey
const awaitMessagesOptions = require("../../config.json").awaitMessagesOptions
const axios = require("axios");
const errorMessage = require("../../config.json").errorMessage

module.exports = (message,args) => {
	if (args != "") {
		let text = message.content.split(' ').slice(1, -1).join(' ');
		let lang = message.content.split(" ").splice(-1);
		trad(text,lang);
	} else {
		message.reply('Que veux tu me faire traduire ?').then(() => {
			message.channel.awaitMessages(responseText => responseText.content.length > 0, awaitMessagesOptions)
			.then(collected => {
					let text = collected.first().content;
					message.reply('en quelle langue ?')
					.then(() => {
						message.channel.awaitMessages(responseLang => responseLang.content.length > 0,awaitMessagesOptions)
						.then(collectedLang => {
							let lang = collectedLang.first().content;
								if(text && lang){
									trad(text,lang);
								}else {
									message.reply("Il me faut un text et une langue")
								}
							}).catch(() => {
								message.reply(errorMessage.waitingToMuch);
							});
					});
				}).catch(() => {
					message.reply(errorMessage.waitingToMuch);
				});
		});
	}
	
	
	
	async function trad(text,lang) {
		let country = lang.toString();
		let flag = flagList["default"].flag;
		let tradLang = country;

		if(flagList[country]){
			tradLang = flagList[country].code;
			flag = flagList[country].flag;
		}
		let res = await axios.get("https://translate.yandex.net/api/v1.5/tr.json/translate?key="+yandexApiKey+"&text="+text+"&lang="+tradLang+"&format=plain")

		message.reply(new Discord.RichEmbed()
			.setTitle("Traduction")
			.setColor(0xFF0000)
			.setDescription(res.data.text)
			.setThumbnail(flag)
			.setTimestamp()
		);
	}
}

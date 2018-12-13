const fs = require("fs");
const path = require('path');
const beauf = path.join(__dirname, './beauf.txt');
const Discord = require('discord.js');

module.exports = message => {
	try {
		let data = fs.readFileSync(beauf, 'utf8');
		let beaufFact = data.toString().split('\n');

		if(beaufFact !='') {
			message.channel.send(new Discord.RichEmbed()
				.setTitle("Le beauf")
				.setColor(0x00AE86)
				.setDescription(  beaufFact[Math.floor(Math.random() * beaufFact.length)])
				.setThumbnail("http://image.noelshack.com/fichiers/2017/34/2/1503406665-beaufdefrance.png")
			);
		}
		else {
			return "Hey, flemme me casse pas les couilles";
		}
	} catch (e) {
		console.log(e);
	}
}

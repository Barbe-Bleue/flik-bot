const axios = require("axios");
const Discord = require('discord.js');

module.exports = async message => {
	let res = await axios.get("http://www.chucknorrisfacts.fr/api/get?data=tri:alea;nb:01");
	message.reply(new Discord.RichEmbed()
	.setTitle("Chuck Norris fact !")
	.setColor(0xB87753)
	.setDescription(res.data[0].fact)
	.setThumbnail("http://pngimg.com/uploads/chuck_norris/chuck_norris_PNG1.png")
	.setFooter("Chuck Norris")
	.setTimestamp());
}

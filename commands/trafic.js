const axios = require("axios");
const Discord = require('discord.js');

module.exports = async args => {	
	let infoTrafic = "";
	let statusMessage;
	if(args.length === 1) {
		let res = await axios.get("https://api-ratp.pierre-grimaud.fr/v3/traffic/"+args[0]);
		if(args[0] === "metros" || args[0] === "metro" ) {
			res.data.result.metros.forEach(item => {
				if(item.title === "Trafic normal") statusMessage = (":white_check_mark: : "+item.message);
				else if(item.title === "Travaux") statusMessage = (":warning: : "+item.message);
				else if(item.title === "Trafic perturbé") statusMessage = (":octagonal_sign: : "+item.message);
				else if (item.title === "Trafic très perturbé") statusMessage = (":poop: : " +item.message);
				infoTrafic += "Ligne **"+item.line+"**: "+statusMessage+"\n";
			})
		} else if(args[0] === "rers" || args[0] === "rer") {
			res.data.result.rers.forEach(item => {
				if(item.title === "Trafic normal") statusMessage = (":white_check_mark: : "+item.message);
				else if(item.title === "Travaux") statusMessage = (":warning: : "+item.message);
				else if(item.title === "Trafic perturbé") statusMessage = (":octagonal_sign: : "+item.message);
				else if (item.title === "Trafic très perturbé") statusMessage = (":poop: : " +item.message);
				infoTrafic += "Ligne **"+item.line+"**: "+statusMessage+"\n";
			})
		}	
	} else if(args.length == 2) {
		let res = await axios.get("https://api-ratp.pierre-grimaud.fr/v3/traffic/"+args[0]+"/"+args[1]);
		let statusMessage;
		if(res.data.result.title === "Trafic normal") statusMessage = (":white_check_mark: : "+	res.data.result.message);
		else if(res.data.result.title === "Travaux") statusMessage = (":warning: : "+	res.data.result.message);
		else if(res.data.result.title === "Trafic perturbé") statusMessage = (":octagonal_sign: : "+item.message);
		else if (res.data.result.title === "Trafic très perturbé") statusMessage = (":poop: : " +	res.data.result.message);
		infoTrafic += "Ligne **"+	res.data.result.line+"**: "+statusMessage+"\n";
	}
	return (new Discord.RichEmbed()
		.setTitle("Info traffic")
		.setColor(0x4AC1AE)
		.setDescription(infoTrafic)
		.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/RATP.svg/637px-RATP.svg.png")
		.setTimestamp());
}


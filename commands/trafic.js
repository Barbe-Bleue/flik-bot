const axios = require("axios");
const Discord = require('discord.js');

module.exports = async args => {	
	let infoTrafic = "";
	let statusMessage;
	let type;
	
	if(args[0] === "metros" || args[0] === "metro") {
		type = "metros"
	} else if (args[0] === "rers" || args[0] === "rer") {
		type = "rers"
	}
	
	let res = await axios.get("https://api-ratp.pierre-grimaud.fr/v3/traffic/"+type);
	
	if(args.length === 1) {
		if(type === "metros") {
			res.data.result.metros.forEach(item => {
				statusMessage = getStatusMessage(item.title,item.message);
				infoTrafic += "Ligne **"+item.line+"**: "+statusMessage+"\n";
			})
		} else if(type === "rers") {
			res.data.result.rers.forEach(item => {
				statusMessage = getStatusMessage(item.title,item.message);
				infoTrafic += "Ligne **"+item.line+"**: "+statusMessage+"\n";
			})
		}	
	} else if(args.length == 2) {
		let res = await axios.get("https://api-ratp.pierre-grimaud.fr/v3/traffic/"+type+"/"+args[1]);
		statusMessage = getStatusMessage(res.data.result.title,res.data.result.message);
		infoTrafic += "Ligne **"+	res.data.result.line+"**: "+statusMessage+"\n";
	}
	
	function getStatusMessage(title, message) {
		let statusMessage;
		if(title === "Trafic normal") statusMessage = (":white_check_mark: : "+message);
		else if(title === "Travaux") statusMessage = (":warning: : "+message);
		else if(title === "Trafic perturbé") statusMessage = (":octagonal_sign: : "+message);
		else if (title === "Trafic très perturbé") statusMessage = (":poop: : " +message);
		return statusMessage
	}
	
	return (new Discord.RichEmbed()
		.setTitle("Info traffic")
		.setColor(0x4AC1AE)
		.setDescription(infoTrafic)
		.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/RATP.svg/637px-RATP.svg.png")
		.setTimestamp());
}


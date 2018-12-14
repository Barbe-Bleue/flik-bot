const axios = require("axios");
const awaitMessagesOptions = require("../config.json").awaitMessagesOptions
const errorMessage = require("../config.json").errorMessage

module.exports = async (message,args) => {	
	let infoTrafic = [];
	let statusMessage;
	let type;
	let code;
	
	if(args[0] === "metros" || args[0] === "metro" ) {
		type = "metros"
	} else if (args[0] === "rers" || args[0] === "rer") {
		type = "rers"
	} else {
		if(!isNaN(args[0])) {
			code = args[0];
			type = "metros"
		} else if(args[0].length === 1) {
			code = args[0];
			type = "rers"
		}
	}
	
	let res = await axios.get("https://api-ratp.pierre-grimaud.fr/v3/traffic/"+type);
	
	if(args.length === 1) {
		if(code) {
			let res = await axios.get("https://api-ratp.pierre-grimaud.fr/v3/traffic/"+type+"/"+code);
			infoTrafic.push(getCodeTrafic(res,type,code));
		} else if(type === "metros") {
			res.data.result.metros.forEach(item => {
				statusMessage = getStatusMessage(item.title,item.message);
				infoTrafic.push({ name: "Ligne **"+item.line+"**: ", value: statusMessage})
			})
		} else if(type === "rers") {
			res.data.result.rers.forEach(item => {
				statusMessage = getStatusMessage(item.title,item.message);
				infoTrafic.push({ name: "Ligne **"+item.line+"**: ", value: statusMessage})
			})
		}
	} else if(args.length == 2) {
		let res = await axios.get("https://api-ratp.pierre-grimaud.fr/v3/traffic/"+type+"/"+args[1]);
		infoTrafic.push(getCodeTrafic(res,type,code));
	}
	
	function getCodeTrafic(res,type,code) {
		let status = getStatusMessage(res.data.result.title,res.data.result.message);
		return { name: "Ligne **"+res.data.result.line+"**: ", value: status}
	}
	
	function getStatusMessage(title, message) {
		switch(title) {
			case "Trafic normal":
				return ":white_check_mark: : "+message;
				break;
			case "Travaux":
				return ":warning: : "+message;
				break;
			case "Trafic perturbé":
				return ":octagonal_sign: : "+message;
				break;
			case "Trafic très perturbé":
				return ":poop: : " +message;
			default:
				return;
 		}
	}
	
	message.reply({embed : {
		title: "Info traffic",
		color: 4899246,
		fields: infoTrafic,
		thumbnail: {
			url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/RATP.svg/637px-RATP.svg.png"
		}
	}});
}
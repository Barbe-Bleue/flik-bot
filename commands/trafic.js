const axios = require("axios");

module.exports = async args => {	
	
	if(args.length === 1) {
		console.log(args[0]);
		let res = await axios.get("https://api-ratp.pierre-grimaud.fr/v3/traffic/type/"+args[0]);
		
		var infoTrafic = "";

		console.log(res.data);
		res.data.result.metros.forEach(item => {
			if(item.title === "Trafic normal") var statusMessage = (":white_check_mark: : "+item.message);
			else if(item.title === "Travaux") var statusMessage = (":warning: : "+item.message);
			else if(item.title === "Trafic perturbé") var statusMessage = (":octagonal_sign: : "+item.message);
			else if (item.title === "Trafic très perturbé") var statusMessage = (":poop: : " +item.message);
			infoTrafic += "Ligne **"+item.line+"**: "+statusMessage+"\n";
		})
		return infoTrafic;
	}
	
		// 	url = 
		// 	request(url, function(err, response, body){
		// 		try{
		// 			var jsonBulletin = JSON.parse(body);
		// 			var result = jsonBulletin.result.rers
		// 			var bulletin = [];
		// 			for(ligne in result){
		// 				if(ligne !== null){
		// 					bulletin[result[ligne].line] = result[ligne].message;
		// 					bulletin[result[ligne].line["status"]] = result[ligne].title;
		// 				}
		// 			}callback(null,bulletin);
		// 		}catch(e){
		// 			callback(e);
		// 		}
		// 	});
		// };
		//var info = res.data.result;
		
		
	// 	info(function(err, bulletin){
	// 		if(err) return console.log(err);
	// 
	// 		var infoTrafic = "";
	// 
	// 		for(ligne in bulletin){
	// 			var status = bulletin[ligne["status"]];
	// 			var statusMessage = "";
	// 			if(typeof ligne !== undefined){
	// 				if(status === "Trafic normal") statusMessage = (":white_check_mark: : "+bulletin[ligne]);
	// 				else if(status === "Travaux") statusMessage = (":warning: : "+bulletin[ligne]);
	// 				else if(status === "Trafic perturbé") statusMessage = (":octagonal_sign: : "+bulletin[ligne]);
	// 				else if (status === "Trafic très perturbé") statusMessage = (":poop: : " +bulletin[ligne]);
	// 			}infoTrafic += "Ligne **"+ligne+"**: "+statusMessage+"\n";
	// 		}
	// 		const embed = new Discord.RichEmbed()
	// 		.setTitle("Info traffic")
	// 		.setColor(0x4AC1AE)
	// 		.setDescription(infoTrafic)
	// 		.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/RATP.svg/637px-RATP.svg.png")
	// 		.setTimestamp()
	// 		message.channel.send({embed});
	// 	});
	// }else{
	// 	if(isNaN(code)) type = "rers";
	// 	else type = "metros";
	// 
	// 	var transports = leTrafic(type, code);
	// 
	// 	transports(function(err, previsions){
	// 		var infoTrafic = "";
	// 		if(err) return console.log(err);
	// 		if(previsions.status != null){
	// 			if(previsions.status === "Trafic normal") infoTrafic = ":white_check_mark: : "+previsions.message;
	// 			else if(previsions.status === "Travaux") infoTrafic = ":warning: : "+previsions.message;
	// 			else if(previsions.status === "Trafic perturbé") infoTrafic = ":octagonal_sign: : "+previsions.message;
	// 			else if (previsions.status === "Trafic très perturbé") infoTrafic = ":poop: : " +previsions.message;
	// 		}
	// 		const embed = new Discord.RichEmbed()
	// 		.setTitle("Info traffic ligne "+code)
	// 		.setColor(0x4AC1AE)
	// 		.setDescription(infoTrafic)
	// 		.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/RATP.svg/637px-RATP.svg.png")
	// 		.setTimestamp()
	// 		message.channel.send({embed});
	// 	});
	
}


const Discord = require('discord.js');
const flagList = require("./flag.json");
const axios = require("axios");

module.exports = async (text,lang,key) => {	
	let country = lang.toString();
	let flag = flagList["default"].flag;
	let tradLang = country;
	
	if(flagList[country]){
		tradLang = flagList[country].code;
		flag = flagList[country].flag;
	}
	let res = await axios.get("https://translate.yandex.net/api/v1.5/tr.json/translate?key="+key+"&text="+text+"&lang="+tradLang+"&format=plain")
	
	return(new Discord.RichEmbed()
		.setTitle("Traduction")
		.setColor(0xFF0000)
		.setDescription(res.data.text)
		.setThumbnail(flag)
		.setTimestamp()
	);
}


const axios = require('axios');
const meteo = require("./meteo.json");
const Discord = require('discord.js');

module.exports = async (args) => {
	const ville = args[0];
	const demain = args[1];

	if(demain != null && demain.toUpperCase() === "DEMAIN"){
		var jour = 1;
		var annonce = "demain la température sera de ";
	} else {
		var jour = 0;
		var annonce = "aujourd'hui la température est de ";
	}

	if (/^[a-zA-Z]/.test(ville)) {
		var url = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+ville+"&mode=json&units=metric&cnt=2&lang=fr&appid=50d1f0d31cd8814419a3d8a06d208d4d";
	}else{
		var url = "http://api.openweathermap.org/data/2.5/forecast/daily?zip="+ville+"&mode=json&units=metric&cnt=2&lang=fr&appid=50d1f0d31cd8814419a3d8a06d208d4d";
	}

	const res = await axios.get(url)
	console.log(res);
	return (new Discord.RichEmbed()
	.setTitle("Meteo à "+res.data.city.name)
	.setColor(0x10B8FE)
	.setDescription(annonce + " "+res.data.list[jour].temp.day + "°C, " + res.data.list[jour].weather[0].description + " "+ meteo[res.data.list[jour].weather[0].description])
	.setThumbnail("https://cdn.pixabay.com/photo/2016/05/20/20/20/weather-1405870_960_720.png")
	.setTimestamp())
}

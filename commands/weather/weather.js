const axios = require('axios');
const weather = require("./weather.json");

module.exports = async (message,args) => {
	const ville = args[0];
	let jour = 0;
	let annonce = "aujourd'hui la température est de ";
	let url = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+ville+"&mode=json&units=metric&cnt=2&lang=fr&appid=50d1f0d31cd8814419a3d8a06d208d4d";

	if(args[1] && args[1].toUpperCase() === "DEMAIN"){
		jour = 1;
		annonce = "demain la température sera de ";
	}

	const res = await axios.get(url);
	message.reply({embed : {
		title: "Meteo à "+res.data.city.name,
		color: 1095934,
		description: annonce + " "+res.data.list[jour].temp.day + "°C, " + res.data.list[jour].weather[0].description + " "+ weather[res.data.list[jour].weather[0].description],
		thumbnail: {
			url: "https://cdn.pixabay.com/photo/2016/05/20/20/20/weather-1405870_960_720.png"
		}
	}});
}
const axios = require('axios');
const meteoJSON = require("./meteo.json");

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
	
	return {
		annonce: annonce,
		temperature : res.data.list[jour].temp.day,
		city : res.data.city.name,
		description : res.data.list[jour].weather[0].description,
		emoji: meteoJSON[res.data.list[jour].weather[0].description]
	};
}


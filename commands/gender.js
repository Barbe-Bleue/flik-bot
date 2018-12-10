const axios = require('axios');

module.exports = async args => {
	let res = await axios.get("https://gender-api.com/get?name="+args[0]+"&country=FR&key=kXRfKPCeGsNKcUwseW")
	
	let emoji = res.data.gender === "male" ? ":man:" : ":woman:"
	
	return res.data.name_sanitized+': '+res.data.gender + emoji +" sûr à " + res.data.accuracy + "%"
}
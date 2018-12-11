const axios = require('axios');

module.exports = async args => {
	let res = await axios.get("https://gender-api.com/get?name="+args[0]+"&country=FR&key=kXRfKPCeGsNKcUwseW")
	let emoji = res.data.gender === "male" ? ":man:" : ":woman:"
	let gender = res.data.gender === "male" ? "homme" : "femme"
	return res.data.name_sanitized+': '+gender + emoji +" sûr à " + res.data.accuracy + "%"
}

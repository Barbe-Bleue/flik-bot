const axios = require('axios');

module.exports = async prenom => {
	let res = await axios.get("https://gender-api.com/get?name="+prenom+"&country=FR&key=kXRfKPCeGsNKcUwseW")
	return res.data
}
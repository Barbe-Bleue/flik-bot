const axios = require('axios');

module.exports = async name => {
	let res = await axios.get("https://gender-api.com/get?name="+name+"&country=FR&key=kXRfKPCeGsNKcUwseW")
	return res.data
}
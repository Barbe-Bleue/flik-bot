const axios = require("axios");

module.exports = async () => {
	let res = await axios.get("https://cat-fact.herokuapp.com/facts/random");
	return res.data.text
}

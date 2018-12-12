const axios = require("axios");

module.exports = async () => {
	let res = await axios.get("https://aws.random.cat/meow");
	return res.data.file
}

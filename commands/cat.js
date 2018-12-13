const axios = require("axios");

module.exports = async message => {
	let res = await axios.get("https://aws.random.cat/meow");
	message.reply(res.data.file)
}

const axios = require("axios");

module.exports = async message => {
	let res = await axios.get("https://cat-fact.herokuapp.com/facts/random");
	message.channel.send(res.data.text)
}

const axios = require("axios");

module.exports = async message => {
	let res = await axios.get("http://www.chucknorrisfacts.fr/api/get?data=tri:alea;nb:01");
	message.channel.send({embed : {
		title: "Chuck Norris fact !",
		color: 12089171,
		description: res.data[0].fact,
		footer: {
			text: "Chuck Norris"
		},
		thumbnail: {
			url: "http://pngimg.com/uploads/chuck_norris/chuck_norris_PNG1.png"
		}
	}});
}

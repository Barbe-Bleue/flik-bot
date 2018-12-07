const axios = require("axios");

module.exports = async () => {	
	let res = await axios.get("http://www.chucknorrisfacts.fr/api/get?data=tri:alea;nb:01");
	return res.data[0]
}


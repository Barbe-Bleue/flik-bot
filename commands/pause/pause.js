const pauseJSON = require("./pause.json");

module.exports = async () => {	
	return await {
		manger: pauseJSON['manger'][Math.floor(Math.random() * pauseJSON['manger'].length)],
		boire: pauseJSON['boire'][Math.floor(Math.random() * pauseJSON['boire'].length)],
	}
}


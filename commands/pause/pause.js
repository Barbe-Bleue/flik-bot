const pause = require("./pause.json");

module.exports = async () => {
	return await {
		manger: pause['manger'][Math.floor(Math.random() * pause['manger'].length)],
		boire: pause['boire'][Math.floor(Math.random() * pause['boire'].length)],
	}
}

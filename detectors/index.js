const insult = require("./insult.js")
const police = require("./police.js")
const kickMe = require("./kickMe.js")

module.exports = message => {
	insult(message);
	police(message);
	kickMe(message);
}

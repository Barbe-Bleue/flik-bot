const fs = require("fs");
const path = require('path');
const brain = path.join(__dirname, './cerveau.txt');

module.exports = message => {
	try {
		let data = fs.readFileSync(brain, 'utf8')
		let savoir = data.toString().split('\n');
		let res = savoir != '' ? savoir[Math.floor(Math.random() * savoir.length)] : "Hey, flemme me casse pas les couilles"
		message.channel.send(res)
	} catch (e) {
		console.log(e);
	}
}

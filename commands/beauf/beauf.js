const fs = require("fs");
const path = require('path');
const beauf = path.join(__dirname, './beauf.txt');
const errorMessage = require("../../config.json").errorMessage

module.exports = message => {
	try {
		let data = fs.readFileSync(beauf, 'utf8');
		let beaufFact = data.toString().split('\n');

		if(beaufFact !='') {
			message.channel.send({embed : {
				title: "Le beauf",
				color: 44678,
				description: beaufFact[Math.floor(Math.random() * beaufFact.length)],
				thumbnail: {
					url: "http://image.noelshack.com/fichiers/2017/34/2/1503406665-beaufdefrance.png"
				}
			}});
		} else {
			return errorMessage.error
		}
	} catch (e) {
		return errorMessage.error
	}
}

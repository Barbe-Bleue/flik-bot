const fs = require("fs");
const path = require('path');

module.exports = () => {	
	try {
		let data = fs.readFileSync(path.join(__dirname, './cerveau.txt'), 'utf8') 
		let savoir = data.toString().split('\n');
		let res = savoir != '' ? savoir[Math.floor(Math.random() * savoir.length)] : "Hey, flemme me casse pas les couilles"
		return res
	} catch (e) {
		console.log(e);
	}	
}


const fs = require("fs");
const path = require('path');

module.exports = async () => {
	let res = await fs.readFile(path.join(__dirname, './data.txt'), 'utf8',  function (err,data) {
		if (err) {
	    return console.log(err);
	  } else {
			return data;
		}
	});
	console.log(res);
}


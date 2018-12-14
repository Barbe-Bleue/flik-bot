const fs = require('fs');
const path = require('path');
const history = path.join(__dirname, '../history.txt');

module.exports = async (pseudo,command,args) => {
	let log = {pseudo,command,args};
	log = JSON.stringify(log);
	await fs.appendFileSync(history,log+"\n","UTF-8",{'flags': 'a+'});
}	
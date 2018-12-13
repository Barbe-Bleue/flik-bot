const fs = require("fs");
const path = require('path');
const doc = path.join(__dirname, './doc.txt');

module.exports = message => {
	let data = fs.readFileSync(doc, 'utf8')
  let laDoc = data.toString().split('\n');
  let cmd ='';

  for (var i in laDoc){
    if(cmd[i] != '') {
			cmd += laDoc[i]+'\n';
		}
  }
	 message.author.send(cmd)
}

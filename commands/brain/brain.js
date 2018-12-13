const fs = require("fs");
const path = require('path');
const brain = path.join(__dirname, './cerveau.txt');

module.exports = message => {	
	try {
		let data = fs.readFileSync(brain, 'utf8')
    let grandSavoir = data.toString().split('\n');
    let savoir ='';

    for (let i in grandSavoir){
      if(savoir[i] != '') {
				savoir += grandSavoir[i]+'\n'
			};
    }
		message.channel.send(savoir);
		
	} catch (e) {
		console.log(e);
	}	
}


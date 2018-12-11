const fs = require("fs");
const path = require('path');

module.exports = () => {	
	try {
		let data = fs.readFileSync(path.join(__dirname, './cerveau.txt'), 'utf8')
    let grandSavoir = data.toString().split('\n');
    let savoir ='';

    for (let i in grandSavoir){
      if(savoir[i] != '') {
				savoir += grandSavoir[i]+'\n'
			};
    }
		return savoir
		
	} catch (e) {
		console.log(e);
	}	
}


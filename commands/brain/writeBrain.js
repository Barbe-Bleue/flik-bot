const fs = require("fs");
const path = require('path');
const brain = path.join(__dirname, './cerveau.txt');

module.exports = sentence => {	
	try {
		let newSavoir = true
		let data = fs.readFileSync(brain, 'utf8')
    let savoir = data.toString().split('\n');

    for(let line in savoir) {
      if(sentence == savoir[line]) {
       	newSavoir = false;
      }
    }
    if(newSavoir != false) {
      fs.appendFileSync(brain,sentence+'\n',"UTF-8",{'flags': 'a+'});
      return "Ok poto jm'en souviendrai :thumbsup:";
    } else {
    	return ":no_entry: Hey, je connais déjà ca ! :no_entry:";
    }
	} catch (e) {
		console.log(e);
	}	
}


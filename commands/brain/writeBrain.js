const fs = require("fs");
const path = require('path');
const brain = path.join(__dirname, './cerveau.txt');
const awaitMessagesOptions = require("../../config.json").awaitMessagesOptions
const errorMessage = require("../../config.json").errorMessage

module.exports = (message,args) => {
	if (args != "") {
		message.channel.send(write(args.join(' ')));
	} else {
		message.reply('Que veux tu me faire apprendre ?').then(() => {
			message.channel.awaitMessages(response => response.content.length > 0, awaitMessagesOptions).then(collected => {
					message.channel.send(write(collected.first().content));
				}).catch(() => {
					message.channel.send(errorMessage.waitingToMuch);
				});
		});
	}
	
	function write(sentence) {
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
			return errorMessage.error
		}		
	}	
}


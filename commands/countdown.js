let timeBeforeKick = require('../config.json').timeBeforeKick;

module.exports = message => {
	
	function countdown() {
		message.channel.send(timeBeforeKick)
     if (timeBeforeKick == 1) {
       return;
    } else {
      timeBeforeKick--;
    }
    timeoutMyOswego = setTimeout(countdown, 1000);
	}
  
	countdown();
}

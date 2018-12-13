const errorMessage = require("../config.json").errorMessage

module.exports = message => {
	const isAdmin = !message.author.kickable;
	if (isAdmin) {
		let perdant = message.guild.members.random();
		message.channel.send("Roulette russe de l'admin ! Un kick au hasard !")
		.then(() => {
			if(!perdant.kickable) {
				message.channel.send("Ok ça tombe sur l'admin on peut rien faire.");
			} else {
				message.channel.send(perdant.displayName+" a perdu.").then(() => {
					message.channel.send("https://gph.is/29dBRmh");
					wait(2000);
					perdant.kick()
				});
			}
		});
	} else {
		message.reply(errorMessage.notAdmin);
	}
	
	function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
  }
}

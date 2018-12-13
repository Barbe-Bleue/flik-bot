const pseudos = ["Bob le bricoleur","Suppoman","Voleur de crypto","Grandad Harol","Shitcoin"];
const punitions = ["kick", "Changement de pseudo"];
let nbR = 1;

module.exports = message => {
	message.channel.send("Jeu de la roulette russe : "+ nbR +"/6 chance d'avoir une punition.");
	
	if (Math.floor(Math.random() * (6-nbR)) == 0) {
		let puni = Math.floor(Math.random()*punitions.length);
		message.channel.send("PAN \nPunition : " + punitions[puni]);
		switch(puni) {
			case 0:
				message.member.kick("Vous avez perdu la roulette");
				break;
			case 1:
				message.member.setNickname(pseudos['pseudos'][Math.floor(Math.random() * pseudos['pseudos'].length)]);
				break;
		}
		message.channel.send("Chances de perdre remises à zéro.");
		nbR = 1;
	} else {
		message.channel.send("*Clic*");
		nbR += 1;
	}
}

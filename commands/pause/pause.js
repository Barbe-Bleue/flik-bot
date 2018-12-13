const pause = require("./pause.json");

module.exports = message => {
	let gouter = "";
	for (let member in message.guild.members.array()) {
		let manger = pause['manger'][Math.floor(Math.random() * pause['manger'].length)] 
		let boire = pause['boire'][Math.floor(Math.random() * pause['boire'].length)]
		
		let userID =  message.guild.members.array()[member]['user'].id;
	 	gouter +='<@'+userID+'> : '+manger+' | '+boire+"\n";
	}
	message.channel.send('Aight c\'est l\'heure de la pause :ok_hand: :coffee: :chocolate_bar: \n\n'+gouter);
}

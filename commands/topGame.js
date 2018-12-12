module.exports = (args) => {
	
	let nbGame = Math.floor((Math.random() * 5) + 1);
	if(args.length === 1) {
		nbGame = args[0]
	}
	
	let prediction ="Ce soir on fait "+nbGame+" game \n"

	for(let k = 0; k < nbGame; k++){
		let reaction;
		let top = Math.floor((Math.random() * 170) + 1);
		let kill = Math.floor((Math.random() * 10));

		if (top <=10){
			reaction = ":scream: :ok_hand: :fire: :military_medal: ";
		} else if(top > 10 && top <= 50) {
			reaction = ":neutral_face: :medal: ";
		} else {
			reaction = ":weary: :sob: :gun: :knife: :no_entry: ";
		}
		prediction += "Top "+top+" "+reaction+" | "+kill+" kill :boom: \n";
	}
	return prediction
}

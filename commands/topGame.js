module.exports = () => {
	let nbGame = Math.floor((Math.random() * 5) + 1);
	let prediction ="Ce soir on fait "+nbGame+" game \n"
	for(let k = 0; k < nbGame; k++){
		let top = Math.floor((Math.random() * 170) + 1);
		let kill = Math.floor((Math.random() * 10));

		if (top <=10){
			let reaction = ":scream: :ok_hand: :fire: :military_medal: ";
		} else if(top > 10 && top <= 50) {
			let reaction = ":neutral_face: :medal: ";
		} else {
			let reaction = ":weary: :sob: :gun: :knife: :no_entry: ";
		}
		prediction += "Top "+top+" "+reaction+" | "+kill+" kill :boom: \n";
	}
	return prediction
}

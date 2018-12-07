module.exports = () => {	
	var nbGame = Math.floor((Math.random() * 5) + 1);
	var prediction ="Ce soir on fait "+nbGame+" game \n"
	for(var k = 0; k < nbGame; k++){
		var top = Math.floor((Math.random() * 170) + 1);
		var kill = Math.floor((Math.random() * 10));

		if (top <=10){
			var reaction = ":scream: :ok_hand: :fire: :military_medal: ";
		} else if(top > 10 && top <= 50) {
			var reaction = ":neutral_face: :medal: ";
		} else {
			var reaction = ":weary: :sob: :gun: :knife: :no_entry: ";
		} 
		prediction += "Top "+top+" "+reaction+" | "+kill+" kill :boom: \n";
	}
	return prediction
}


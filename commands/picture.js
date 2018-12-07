module.exports = () => {	
	var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPKRSTUVWXYZ";
	var result="";
	
	for( var m = 0; m < 7; m++ ){
		result += charset[Math.floor(Math.random() * charset.length)];
	}
	return "http://imgur.com/gallery/"+result
}


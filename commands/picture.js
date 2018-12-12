module.exports = () => {
	let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPKRSTUVWXYZ";
	let result="";

	for(let i = 0; i < 7; i++ ){
		result += charset[Math.floor(Math.random() * charset.length)];
	}
	return "http://imgur.com/gallery/"+result
}

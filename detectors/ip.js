const axios = require("axios");
module.exports = async message => {
	
  let res = await axios.get("https://ipapi.co/json/");
	
	let infos = [
		{name: "Ton Ip c'est", value: res.data.ip},
		{name: "T'habites vers", value: res.data.city},
		{name: "Dans la région", value: res.data.region},
		{name: "Et ton opérateur c'est", value: res.data.org},
	]
	
	message.reply({embed : {
		author: {
			name: "KGB",
			icon_url:"https://imgix.ranker.com/user_node_img/50070/1001397355/original/russian-experts-say-putin-and-_39_s-hairline-and-beer-belly-prove-it-and-_39_s-not-him-photo-u2?w=650&q=50&fm=jpg&fit=crop&crop=faces"
		},
    title: ":cop: :rage: JE SAIS OÙ TU TE CACHE FDP :rage: :cop:",
    color: 44678,
    description: "La vie de oim je vais te retrouver",
		fields: infos,
    thumbnail: {
    	url: "https://imgix.ranker.com/user_node_img/50070/1001397355/original/russian-experts-say-putin-and-_39_s-hairline-and-beer-belly-prove-it-and-_39_s-not-him-photo-u2?w=650&q=50&fm=jpg&fit=crop&crop=faces"
    },
		footer:{
			text: "On se revoit aux goulags !",
			icon_url: "https://pbs.twimg.com/profile_images/3614552017/4aa0cfe9d98bf979d691d40c910489ef.png"
		},
	}});
}

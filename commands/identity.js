const axios = require("axios");

module.exports = async message => {
	let res =  await axios.get("https://randomuser.me/api/");
	
	let identity = res.data.results[0];
	
	let infos = [
		{name: "**Genre**", value: identity.gender},
		{name: "**Nom**", value: identity.name.title+' '+identity.name.first+' '+identity.name.last},
		{name: "**Addresse**", value: 
			"**Rue**: "+identity.location.street+'\n'+
			"**Ville**: "+identity.location.city+'\n'+
			"**Etat**: "+identity.location.state+'\n'
		},
		{name: "**Coordonées gps**", value: 
			"**Latitude**: "+identity.location.coordinates.latitude+'\n'+
			"**Longitude**: "+identity.location.coordinates.longitude+'\n'
		},
		{name: "**Email**", value: identity.email},
		{name: "**Login**", value: 
			"**Username**: "+identity.login.username+'\n'+
			"**Password**: "+identity.login.password+'\n'
		},
		{name: "**Email**", value: identity.email},
		{name: "**Telephone**", value: identity.phone},
	]
	message.reply({embed : {
    title: ":spy: Nouvelle identitée pour fuir les américains :spy:",
    color: 44678,
		fields: infos,
		author: {
			name: "KGB",
			icon_url:"https://imgix.ranker.com/user_node_img/50070/1001397355/original/russian-experts-say-putin-and-_39_s-hairline-and-beer-belly-prove-it-and-_39_s-not-him-photo-u2?w=650&q=50&fm=jpg&fit=crop&crop=faces"
		},
		footer:{
			text: "Bon courage mon ami.",
			icon_url: "https://pbs.twimg.com/profile_images/3614552017/4aa0cfe9d98bf979d691d40c910489ef.png"
		},
		thumbnail: {
 			url: identity.picture.large
 	 	}
  }});
}

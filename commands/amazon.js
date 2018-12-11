const Discord = require('discord.js');

module.exports = search => {	
	var url = "https://www.amazon.fr/s/ref=nb_sb_noss?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&url=search-alias%3Daps&field-keywords="+search;
	return(new Discord.RichEmbed()
		.setTitle("Recherche amazon pour: "+search)
		.setColor(0xF3A847)
		.setDescription(url)
		.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/b/b4/Amazon-icon.png")
		.setTimestamp()
		.setURL(url)
	);
}


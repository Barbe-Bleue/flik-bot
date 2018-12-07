const axios = require("axios");

module.exports = async recherche => {	
	let search = "Recherche wikipedia pour: "+recherche+"\n";
	let res = await axios.get("https://fr.wikipedia.org/w/api.php?action=opensearch&search="+recherche+"&limit=1&namespace=0&format=json")

	if(res.data[1].length === 0) {
		 return search +="Aucun résultats"
	} else {
		 return search += "Nom: "+res.data[1]+"\n"+res.data[3]+"\n\n"
	}
}


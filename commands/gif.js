const axios = require('axios');

module.exports = async recherche => {
	let res = await axios.get("http://api.giphy.com/v1/gifs/search?api_key=2a6166b6303a485088cd82579ada608f&q="+recherche+"&limit=20")
	return res.data.data[Math.floor(Math.random() * 20)].images.original.url;
}	
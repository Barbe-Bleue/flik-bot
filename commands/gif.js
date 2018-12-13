const axios = require('axios');

module.exports = async (message,args) => {
	let res = await axios.get("http://api.giphy.com/v1/gifs/search?api_key=2a6166b6303a485088cd82579ada608f&q="+agrs[0]+"&limit=20")
	message.channel.send(res.data.data[Math.floor(Math.random() * 20)].images.original.url);
}	
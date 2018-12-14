const axios = require("axios");
const bot = require('../config.json').bot

module.exports = async (message) => {
  let rss = await axios.get("https://api.rss2json.com/v1/api.json?rss_url=https://www.bfmtv.com/rss/info/flux-rss/flux-toutes-les-actualites/");
  let items = rss.data.items;
  let rand = Math.floor(Math.random() * 10);

  message.reply({embed : {
    title: items[rand].title,
    color: 44678,
    url: items[rand].url,
    description: items[rand].description.split('<br>')[0],
    timestamp: items[rand].pubDate,
    author: {
      name: bot.name,
      icon_url: bot.image
    },
    footer:{
      text: bot.name,
      icon_url: bot.image
    },
    thumbnail: {
    	url: "https://upload.wikimedia.org/wikipedia/commons/4/40/BFM_TV_logo.png"
    },
    image : {
      url: items[rand].thumbnail
    }
  }});
}

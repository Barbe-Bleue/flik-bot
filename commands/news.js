const axios = require("axios");
const Discord = require('discord.js');

module.exports = async (user) => {
  let rss = await axios.get("https://api.rss2json.com/v1/api.json?rss_url=https://www.bfmtv.com/rss/info/flux-rss/flux-toutes-les-actualites/");
  let items = rss.data.items;
  let rand = Math.floor(Math.random() * 10);

  return(new Discord.RichEmbed()
    .setTitle(items[rand].title)
    .setAuthor(user.username, user.avatarURL)
    .setColor(0x00AE86)
    .setFooter("Vag", user.avatarURL)
    .setImage(items[rand].thumbnail)
    .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/4/40/BFM_TV_logo.png")
    .setTimestamp()
    .setURL(items[rand].url)
  );
}

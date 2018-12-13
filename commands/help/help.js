const help = require('./help.json');
const prefix = require('../../config.json').prefix
const Discord = require('discord.js');

module.exports = (command,message) => {
  if(command){
    if(help[command]) {
      message.reply(new Discord.RichEmbed()
      .setAuthor(command.toUpperCase())
      .setTitle("*"+help[command].resume+"*")
      .setColor(0x39e116)
      .setDescription(help[command].exemples.map(cmd => prefix+cmd))
      .setThumbnail("https://www.supinfo.com/articles/resources/143087/5849/0.png")
      .setTimestamp())
    } else message.reply("Je ne connais pas la commande **"+command+"** :shrug:")
  } else {
    let allCmd = "";
    for (var cmd in help) {
      if (help.hasOwnProperty(cmd)) {
        if(help[cmd].exemples) {
          ex = getExemples(help[cmd])
        } else ex = prefix+cmd
        allCmd += "\n\n**"+cmd.toUpperCase()+"**\n*"+help[cmd].resume+"*\n"+ ex
      }
    }
    message.reply(new Discord.RichEmbed()
    .setTitle("HELP")
    .setColor(0x39e116)
    .setDescription(allCmd)
    .setThumbnail("https://www.supinfo.com/articles/resources/143087/5849/0.png")
    .setTimestamp())
  }

  function getExemples(command) {
    let aled = "";
    command.exemples.map(ex => {
      aled+=prefix+ex+"\n"
    });
    return aled
  }
}

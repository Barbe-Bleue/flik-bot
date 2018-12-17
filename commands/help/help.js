const help = require('./help.json');
const prefix = require('../../config.json').prefix
const awaitMessagesOptions = require("../../config.json").awaitMessagesOptions
const errorMessage = require("../../config.json").errorMessage

module.exports = (message,args) => {
  const command = args[0];
  
  if(command){
    if(help[command]) {
      render(command.toUpperCase(),help[command].resume,getExemples(command))
    } else {
      message.reply("Je ne connais pas la commande **"+command+"** :shrug:")
    }
  } else {
    message.reply("T'as besoin d'aide pour que commande ?").then(() => {
			message.channel.awaitMessages(response => response.content.length > 0 ,awaitMessagesOptions)
			.then(collected => {
				collected.first().content.split(/ +/g).forEach(cmd => {
					render(cmd.toUpperCase(),help[cmd].resume,getExemples(cmd))
				});
			}).catch(() => {
				renderAllCommandName();
			});
		});
    // for (var cmd in help) {
    //   if (help.hasOwnProperty(cmd)) {
    //     render(cmd.toUpperCase(),help[cmd].resume,getExemples(cmd))
    //   }
    // }
  }
  
  function render(command,resume,exemples) {
    message.reply({embed : {
      title: command,
      color: 3793174,
      fields: [
        {name: "Description", value: resume},
        {name: "Exemples", value: exemples}
      ],
      thumbnail: {
        url: "https://www.supinfo.com/articles/resources/143087/5849/0.png"
      }
    }});
  }
    
  function getExemples(command) {
    let exemples = "";
    if(help[command].exemples) {
      help[command].exemples.map(ex => {
        exemples +=prefix+ex+"\n"
      });
    } else {
      return prefix+command
    }
    return exemples
  }
  
  function renderAllCommandName() {
    let cmdName = "";
    for (var cmd in help) {
      if (help.hasOwnProperty(cmd)) {
        cmdName += cmd+"\n"
      }
    }
    message.reply({embed : {
      title: command,
      color: 3793174,
      description: cmdName,
      thumbnail: {
        url: "https://www.supinfo.com/articles/resources/143087/5849/0.png"
      }
    }});
  }
}

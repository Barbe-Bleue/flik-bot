const help = require('./help.json');
const prefix = require('../../config.json').prefix

module.exports = (message,args) => {
  const command = args[0];
  
  if(command){
    if(help[command]) {
      render(command.toUpperCase(),help[command].resume,getExemples(command))
    } else {
      message.reply("Je ne connais pas la commande **"+command+"** :shrug:")
    }
  } else {
    for (var cmd in help) {
      if (help.hasOwnProperty(cmd)) {
        render(cmd.toUpperCase(),help[cmd].resume,getExemples(cmd))
      }
    }
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
}

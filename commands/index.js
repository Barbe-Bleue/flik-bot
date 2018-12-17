const cmd = require('require-all')({
  dirname     :  __dirname,
  excludeDirs :  /^\.(git)$/,
	recursive   : true,
	filter      :  /(.+).js$/,
});

module.exports = (message,args,command) => {
  
  // alternative to the switch, but can't trigger if command not exist
  // function searchFunctionInObject(obj, value) {
  //   Object.keys(obj).forEach(async x => {
  //     if(typeof obj[x] === "function") {
  //       if(x === value ) {
  //         obj[x](message,args);
  //       }
  //     } else if(typeof obj[x] === "object") { 
  //       searchFunctionInObject(obj[x], value);
  //     }
  //   });
  // }
  // searchFunctionInObject(cmd, command);
  
	switch (command) {
		case "savoir":
			cmd.brain.knowledge(message);
			break;
		case "malou":
			cmd.brain.brain(message);
			break;
		case "pic":
			cmd.picture(message);
			break;
		case "beauf":
			cmd.beauf.beauf(message);
			break;
		case "doc":
			cmd.help.doc(message);
		case "help":
			cmd.help.help(message,args);
			break;
		case "h1z1":
		case "top":
			cmd.topGame(message,args);
			break;
		case "decide":
			cmd.decide(message,args);
			break;
		case "chat":
		case "cat":
			cmd.cat.cat(message);
			break;
		case "catfact":
			cmd.cat.catFact(message)
			break;
		case "chuck":
			cmd.chuck(message)
			break;
		case "traffic":
		case "trafic":
			cmd.trafic(message,args)
			break;
		case "gif":
			cmd.gif(message,args)
			break;
		case "meteo":
			cmd.weather.weather(message,args)
			break;
		case "actu":
			cmd.news(message)
			break;
		case "coin":
			cmd.coin(message,args)
			break;
		case "genre":
			cmd.gender(message,args)
			break;
		case "pause":
		case "break":
		case "snack":
			cmd.snack.snack(message);
			break;
		case "traduis":
			cmd.translate.translate(message,args)
			break;
		case "apprends":
			cmd.brain.writeBrain(message,args)
			break;
		case "amazon":
		case "afr":
			cmd.amazon(message,args);
			break;
		case "wikipedia":
		case "wiki":
			cmd.wikipedia(message,args);
			break;
		case "kick":
			cmd.admin.kick(message);
			break;
		case "countdown":
			cmd.countdown(message);
			break;
		case "roulette":
			cmd.kick(message);
			break;
		case "sondage":
			cmd.strawpall(message,args);
			break;
		case "rename":
			cmd.admin.rename(message,args);
			break;
		case "ban":
			cmd.admin.ban(message);
			break;
		case "mute":
			cmd.admin.mute(message,args)
			break;
		case "unmute":
			cmd.admin.unmute(message);
			break;
		case "suicide":
			cmd.admin.suicide(message)
			break;
		case "google":
			cmd.google(message,args)
			break;
		case "pokemon":
		case "poke":
			cmd.pokemon.pokemon(message,args)
			break;
    case "monster":
    case "monstre":
      cmd.monster(message);
      break;
    case "identity":
      cmd.identity(message);
      break;
		default:
			message.reply("Je connais pas la commande **"+command+"**" )
			return;
	}
	cmd.history(message.author.username,command,args);
}
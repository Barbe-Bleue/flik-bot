const decide = require("./decide")
const gender = require("./gender")
const weather = require("./weather/weather")
const snack = require("./snack/snack")
const topGame = require("./topGame")
const picture = require("./picture")
const chuck = require("./chuck")
const trafic = require("./trafic")
const beauf = require("./beauf/beauf")
const translate = require("./translate/translate")
const news = require("./news")
const coin = require("./coin")
const kick = require("./kick")
const countdown = require("./countdown")
const roulette = require("./roulette/roulette")
const strawpall = require("./strawpall")
const rename = require("./rename")
const pokemon = require("./pokemon/pokemon")
const history = require("./history")

// cat 
const cat = require("./cat/cat")
const catFact = require("./cat/catFact")

// help
const help = require("./help/help")
const doc = require("./help/doc")

// brain 
const knowledge = require("./brain/knowledge")
const brain = require("./brain/brain")
const writeBrain = require("./brain/writeBrain")

// search command 
const google = require("./google")
const wikipedia = require("./wikipedia")
const gif =  require('./gif')
const amazon = require("./amazon")

// admin command
const ban = require("./admin/ban")
const mute = require("./admin/mute")
const unmute = require("./admin/unmute")
const suicide = require("./admin/suicide")

module.exports = (message,args,command) => {
	switch (command) {
		case "savoir":
			knowledge(message);
			break;
		case "malou":
			brain(message);
			break;
		case "pic":
			picture(message);
			break;
		case "beauf":
			beauf(message);
			break;
		case "doc":
			doc(message);
		case "help":
			help(message,args);
			break;
		case "h1z1":
		case "top":
			topGame(message,args);
			break;
		case "decide":
			decide(message,args);
			break;
		case "chat":
		case "cat":
			cat(message);
			break;
		case "catfact":
			catFact(message)
			break;
		case "chuck":
			chuck(message)
			break;
		case "traffic":
		case "trafic":
			trafic(message,args)
			break;
		case "gif":
			gif(message,args)
			break;
		case "meteo":
			weather(message,args)
			break;
		case "actu":
			news(message)
			break;
		case "coin":
			coin(message,args)
			break;
		case "genre":
			gender(message,args)
			break;
		case "pause":
		case "break":
		case "snack":
			snack(message);
			break;
		case "traduis":
			translate(message,args)
			break;
		case "apprends":
			writeBrain(message,args)
			break;
		case "amazon":
		case "afr":
			amazon(message,args);
			break;
		case "wikipedia":
		case "wiki":
			wikipedia(message,args);
			break;
		case "kick":
			kick(message);
			break;
		case "countdown":
			countdown(message);
			break;
		case "roulette":
			roulette(message);
			break;
		case "sondage":
			strawpall(message,args);
			break;
		case "rename":
			rename(message,args);
			break;
		case "ban":
			ban(message);
			break;
		case "mute":
			mute(message,args)
			break;
		case "unmute":
			unmute(message);
			break;
		case "suicide":
			suicide(message)
			break;
		case "google":
			google(message,args)
			break;
		case "pokemon":
		case "poke":
			pokemon(message,args)
			break;
		default:
			message.reply("Je connais pas la commande **"+command+"**" )
			return;
	}
	history(message.author.username,command,args);
}







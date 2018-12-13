const Discord = require('discord.js');
const bot = new Discord.Client();
const cmd = require ("./commands/index.js");

const config = require('./config.json');
const token = config.token;
const prefix = config.prefix;

// Initialisation du bot
bot.on('ready', () => {
  console.log('bot ok!');
});

// Suppression de message
bot.on('messageDelete', message => {
	message.channel.send('Ohlala pas bien ! <@'+message.author.id+'> a supprimer son message **'+message.content+'** !');
  message.author.kickable ? message.member.setNickname("supprimeur") : null
});

// Membre rejoint le discord
bot.on("guildMemberAdd", member => {
  member.send("Salut moi c'est vag, tiens jte donne la liste des commandes c'est cadeau \n\n"+cmd.doc());
});

// Message
bot.on('message', message => {

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();  
 
  message.content.toUpperCase().includes("KICK MOI") ? cmd.kickMe(message) : null
  
  let swear = cmd.insult(message.content);
  swear ? message.reply(swear) : null

  let police = cmd.police(message);
  if (police) {
    message.reply(police.police);
    message.reply(police.msg)
    police.mutable ? cmd.mute(message) : null;
  }
   
  triggerCommand(message, args, command);
    
  function triggerCommand(message, args, command) {
    switch (command) {
      case "savoir":
        cmd.knowledge(message);
        break;
      case "malou":
        cmd.brain(message);
        break;
      case "pic":
        cmd.picture(message);
        break;
      case "beauf":
        cmd.beauf(message);
        break;
      case "doc":
        cmd.doc(message);
      case "help":
        cmd.help(message,args);
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
        cmd.cat(message);
        break;
      case "catfact":
        cmd.catFact(message)
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
        cmd.meteo(message,args)
        break;
      case "actu":
        cmd.news(bot.user,message)
        break;
      case "coin":
        cmd.coin(message,args)
        break;
      case "genre":
        cmd.gender(message,args)
        break;
      case "pause":
      case "break":
        cmd.pause(message);
        break;
      case "traduis":
        cmd.translate(message,args)
        break;
      case "apprends":
        cmd.writeBrain(message,args)
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
        cmd.kick(message);
        break;
      case "countdown":
        cmd.countdown(message);
        break;
      case "roulette":
        cmd.roulette(message);
        break;
      case "sondage":
        cmd.strawpall(message,args);
        break;
      case "rename":
        cmd.rename(message,args);
        break;
      case "ban":
        cmd.ban(message);
        break;
      case "mute":
        cmd.mute(message,args)
        break;
      case "unmute":
        cmd.unmute(message);
        break;
      case "suicide":
        cmd.suicide(message,bot)
      default:
        return;
    }
  }
});

bot.login(token);
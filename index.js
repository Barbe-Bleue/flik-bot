const Discord = require('discord.js');
const bot = new Discord.Client();
const cmd = require ("./commands/index.js");

const config = require('./config.json');
const token = config.token;
const prefix = config.prefix;
const muteTime = config.muteTime;
const awaitMessagesOptions = config.awaitMessagesOptions
const errorMessage = config.errorMessage

let timeBeforeKick =  config.timeBeforeKick
let nbR = 1;

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
  const isAdmin = !message.author.kickable
  
  if (command === "ban") {
    if (isAdmin) {
      if (message.mentions.members.first()) {
        message.mentions.members.first().kick().then(victime => {
          message.channel.send("@everyone :wave: **" + victime.displayName + "** a été kické :point_right: ");
        }).catch(() => {
          message.reply("On ne peut pas bannir Dieu :cross:");
        });
      } else {
        message.reply("Je peux pas bannir tout le monde ca ne se fait pas !");
      }
    } else {
      message.reply(errorMessage.notAdmin);
    }
  }

  if (command === "mute") {
    if (isAdmin){
      muteUser(message.mentions.members.first(), args[1] ? args[1] * 1000 : muteTime);
    } else {
      message.reply(errorMessage.notAdmin);
    }
  }

  if (command =="unmute") {
    if(isAdmin) {
      unmuteUser(message.mentions.members.first());
    } else {
      message.reply(errorMessage.notAdmin);
    }
  }

  if (command === "kick") {
    if (isAdmin) {
      let perdant = message.guild.members.random();
      message.channel.send("Roulette russe de l'admin ! Un kick au hasard !")
      .then(() => {
        if(!perdant.kickable) {
          message.channel.send("Ok ça tombe sur l'admin on peut rien faire.");
        } else {
          message.channel.send(perdant.displayName+" a perdu.").then(() => {
            message.channel.send("https://gph.is/29dBRmh");
            wait(2000);
            perdant.kick()
          });
        }
      });
    } else {
      message.reply(errorMessage.notAdmin);
    }
  }

  if (command === "roulette") {
    const pseudos = ["Bob le bricoleur","Suppoman","Voleur de crypto","Grandad Harol","Shitcoin"];
    message.channel.send("Jeu de la roulette russe : "+ nbR +"/6 chance d'avoir une punition.");
    const punitions = ["kick", "Changement de pseudo"];
    if (Math.floor(Math.random() * (6-nbR)) == 0) {
      let puni = Math.floor(Math.random()*punitions.length);
      message.channel.send("PAN \nPunition : " + punitions[puni]);
      switch(puni) {
        case 0:
          message.member.kick("Vous avez perdu la roulette");
          break;
        case 1:
          message.member.setNickname(pseudoJSON['pseudos'][Math.floor(Math.random() * pseudoJSON['pseudos'].length)]);
          break;
      }
      message.channel.send("Chances de perdre remises à zéro.");
      nbR = 1;
    } else {
      message.channel.send("*Clic*");
      nbR += 1;
    }
  }

  if (command === "suicide") {
    if (isAdmin) {
      message.channel.send("@everyone Ah ok on me bute comme ça :tired_face: :gun:");
      setTimeout(() => {
        bot.destroy();
      }, 2000);
    } else {
      message.reply(errorMessage.notAdmin);
    }
  }
  
  if (command === "rename") {
    if (args[1] && isAdmin) {
      message.mentions.members.first().setNickname(args[1]);
      message.channel.send("Hey @everyone ! "+message.author+" a changé le nom de "+message.mentions.members.first()+" en ***"+args[1]+"***");
    } else if (args[1] && !isAdmin) {
      message.reply(errorMessage.notAdmin);
    } else if(args[0]) {
      message.member.setNickname(args[0]);
      message.channel.send("Hey @everyone ! "+message.author+" a changé son nom en ***"+args+"***");
    } else {
      message.channel.send('Pseudo invalide')
    }
  }

  if (command === "sondage") {
    if (args.length > 1) {
      message.channel.send(":apple:***SONDAGE :apple:\n"+args.join(" ")+"***")
      .then(message => {
        message.react("👍")
        message.react("👎")
      })
    } else {
      message.reply("Indique la raison du sondage")
    }
  }
  
  

  if (message.content.toUpperCase().includes("KICK MOI")){
    if (isAdmin) {
      message.channel.send("Je peux pas te kick t'es admin.");
    } else{
      message.reply("ok.").then(() => message.member.kick());
    }
  }

  let swear = cmd.insult(message.content);
  swear ? message.reply(swear) : null

  let police = cmd.police(message);
  if (police) {
    message.reply(police.police);
    message.reply(police.msg)
    police.mutable ? muteUser(message.member,config.muteTime) : null;
  }

  function muteUser(victime,time){
    message.channel.overwritePermissions(victime, {
      SEND_MESSAGES: false
    }).then(() => {
      message.channel.send(victime+" a été mute pour "+time / 1000+" secondes. Fallait pas faire chier :kissing_heart:")
    });

    // temps avant de ban
    setTimeout(function(){
      unmuteUser(victime)
    },time);
  }

  function unmuteUser(victime){
    message.channel.overwritePermissions(victime, {
      SEND_MESSAGES: true
    }).then(() => message.channel.send("On libère "+victime+", tu peux reparler maintenant :ok_hand: :slight_smile:"));
  }
  
  function countdown(perdant) {
    message.channel.send(timeBeforeKick)
    if (timeBeforeKick == 1) {
      return;
   } else {
     timeBeforeKick--;
   }
   timeoutMyOswego = setTimeout(countdown, 1000);
  }

  function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
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
      default:
        return;
     }
  }
});

bot.login(token);
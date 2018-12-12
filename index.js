//VARIABLES
const Discord = require('discord.js');
const bot = new Discord.Client();
const cmd = require ("./commands/index.js");
//config
const config = require('./json/config.json');
const token = config.token; // token discord
const prefix = config.prefix; // préfix des commandes
const yandexApiKey = config.yandexApiKey; // pour traduction
const muteTime = config.muteTime; // pour temps de mute

const google = require('google')
const pseudos = ["Bob le bricoleur","Suppoman","Voleur de crypto","Grandad Harol","Shitcoin"]
let nbR = 1;

//CONNEXION
bot.on('ready', () => {
  console.log('bot ok!');
  //bot.sendMessage("Salut moi c'est vag, le meilleur bot du monde :ok_hand: tape 'doc' ou 'help' pour savoir tout ce que je peux faire :sunglasses: ")
});

// Suppression de message
bot.on('messageDelete', message => {
	message.channel.send('Ohlala pas bien ! <@'+message.author.id+'> a supprimer son message **'+message.content+'** !');
  message.member.kickable ? message.member.setNickname("supprimeur") : null
});

// Member join
bot.on("guildMemberAdd", member => {
  //console.log(member.user.username+member.guild.name);
  //console.log("Et maintenat on dit bonjour à "+member.user.username+" qui a rejoint"+member.guild.name+ " !" );
  //member.guild.channel.send(member.user.username+" a rejoint les cancers");
  member.send(cmd.doc());
});

// Message
bot.on('message', message => {

  // args & commands
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const isAdmin = !message.author.kickable

  // check admin
  //var adminCommands = new Array("ban", "kick", "suicide", "mute","unmute");

  // COMMANDES !
  // traduction
  if (command === "traduis"){
    if(args != "") {
      let text = message.content.split(' ').slice(1, -1).join(' ');
      let lang = message.content.split(" ").splice(-1);
      cmd.translate(text,lang,yandexApiKey).then(res => {
        message.channel.send(res);
      });
    } else {
      message.reply('Que veux tu me faire traduire ?').then(() => {
        message.channel.awaitMessages(responseText => responseText.content.length > 0, {
          max: 1,
          time: 30000,
          errors: ['time'],
        }).then((collected) => {
            let text = collected.first().content;
            message.reply('en quelle langue ?').then(() => {
              message.channel.awaitMessages(responseLang => responseLang.content.length > 0, {
                max: 1,
                time: 30000,
                errors: ['time'],
              }).then(collectedLang => {
                let lang = collectedLang.first().content;
                  if(text && lang){
                    cmd.translate(text,lang,yandexApiKey).then(res => {
                      message.channel.send(res)
                    });
                  }else(
                    message.reply("Il me faut un text et une langue")
                  )
                }).catch(() => {
                  message.reply('T\'as pas trouvé les touches sur ton clavier ou quoi ?');
                });
            });
          }).catch(() => {
            message.reply('T\'as pas trouvé les touches sur ton clavier ou quoi ?');
          });
      });
    }
  }

  // Ban
  if (command === "ban"){
    if(message.member.roles.find("name", "Admin")){
      var member = message.mentions.members.first();
      if(member){
        member.kick().then((member) => {
          message.channel.send("@everyone :wave: **" + member.displayName + "** a été kické :point_right: ");
        }).catch(() => {
          message.reply("On ne peut pas bannir Dieu :cross:");
        });
      }else{
        message.reply("Je peux pas bannir tout le monde ca ne se fait pas !");
      }
    }
  }

  // mute user
  if(command === "mute"){
    if(isAdmin){
      muteUser(message.mentions.members.first(), args[1] ? args[1] * 1000 : muteTime);
    } else {
      message.reply("Bah alors ? On essaye de lancer des commandes alors qu'on est pas admin ?");
    }
  }

  // unmute user
  if(command =="unmute"){
    if(isAdmin) {
      unmuteUser(message.mentions.members.first());
    } else {
      message.reply("Bah alors ? On essaye de lancer des commandes alors qu'on est pas admin ?");
    }
  }

  // kick au hasard de la part de l'admin
  if (command === "kick"){
    if(isAdmin) {
      let perdant = message.guild.members.random();
      message.channel.send("Roulette russe de l'admin ! Un kick au hasard !");
      if(perdant.kickable == false) {
        message.channel.send("Ok ça tombe sur l'admin on peut rien faire.");
      } else {
        message.channel.send(perdant.displayName+" a perdu.");
        setInterval(function() { handleTimer(); }, 1000);
      }
    }
  }
  // Timer avant kick
  function handleTimer(count) {
    if(count === 0) {
      clearInterval(timer);
      byebye(perdant);
    } else {
      message.channel.send(count);
      count--;
    }
  }

  // roulette russe
  if(command === "roulette") {
    message.channel.send("Jeu de la roulette russe : "+ nbR +"/6 chance d'avoir une punition.");
    const punitions = ["kick", "Changement de pseudo"];
    if(Math.floor(Math.random() * (6-nbR)) == 0) {
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
    }
    else{
      message.channel.send("*Clic*");
      nbR += 1;
    }
  }

  // decide choix1 choix2...
  if (command === ("decide")) {
    message.reply(cmd.decide(args));
  }

  // suicide du bot
  if (command === "suicide"){
    if(isAdmin){
      message.channel.send("@everyone Ah ok on me bute comme ça :tired_face: :gun:");
      setTimeout(function(){
        bot.destroy();
      }, 2000);
    }else {
      message.reply("Bah alors ? On essaye de lancer des commandes alors qu'on est pas admin ?");
    }
  }

  // meteo
  if(command === "meteo"){
    cmd.meteo(args).then(res => {
      message.reply(res)
    })
  }

  // Trafic
  if(command === "trafic"){
    cmd.trafic(args).then(res => {
      	message.channel.send(new Discord.RichEmbed()
    		.setTitle("Info traffic")
    		.setColor(0x4AC1AE)
    		.setDescription(res)
    		.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/RATP.svg/637px-RATP.svg.png")
    		.setTimestamp())
    });
  }


  // pour le trafic
  function leTrafic(type, code){
    var transports;
    return transports = function(callback){
      url = "https://api-ratp.pierre-grimaud.fr/v3/traffic/"+type+"/"+code;
    	request(url, function(err, response, body){
    		try{
    			var result = JSON.parse(body);
    			var previsions = {
      			status : result.result.title,
    				message : result.result.message,
    			};
    			callback(null, previsions);
    		}catch(e){
    			callback(e);
    		}
    	});
    };
  }

  function bulletin(type) {
    var transports;
    return transports = function(callback){
      url = "https://api-ratp.pierre-grimaud.fr/v3/traffic/"+type;
    	request(url, function(err, response, body){
    		try{
    			var jsonBulletin = JSON.parse(body);
          var result = jsonBulletin.result.rers
          var bulletin = [];
          for(ligne in result){
            if(ligne !== null){
              bulletin[result[ligne].line] = result[ligne].message;
              bulletin[result[ligne].line["status"]] = result[ligne].title;
            }
          }callback(null,bulletin);
    		}catch(e){
    			callback(e);
    		}
    	});
    };
  }

  // gif
  if(command === "gif") {
    cmd.gif(args[0]).then(res => {
      message.channel.send(res)
    });
  }

  // apprend une phrase
  if(command === "apprends") {
    if(args != ""){
      message.channel.send(cmd.writeBrain(args.join(' ')));
    }else{
      message.channel.sendMessage('Que veux tu me faire apprendre ?').then(() => {
        message.channel.awaitMessages(response => response.content.length > 0, {
          max: 1,
          time: 30000,
          errors: ['time'],
        }).then(collected => {
            message.channel.send(cmd.writeBrain(collected.first().content));
          }).catch(() => {
            message.channel.send('T\'as pas trouvé les touches sur ton clavier ou quoi ?');
          });
      });
    }
  }

  // savoir exprime 1 savoir
  if(command === "savoir") {
    message.channel.send(cmd.savoir())
  }

  // malou exprime tout le savoir
  if(command === "malou") {
    message.channel.send(cmd.malou())
  }

  // pause gouter pour chaque membres
  if(command === "pause") {
    message.channel.send('Aight c\'est l\'heure de la pause :ok_hand: :coffee: :chocolate_bar: ');

    for(let member in message.guild.members.array()){
      let userID =  message.guild.members.array()[member]['user'].id;
      cmd.pause().then( res => {
        message.channel.send('<@'+userID+'> : '+res.manger+' | '+res.boire);
      })
    }
  }

  // top
  if(command === "h1z1") {
    message.channel.send(cmd.topGame());
  }

  // google recherche google
  if(command === "google"){
    google.l
    google.resultsPerPage = 5;
    google.lang = 'fr';
    google.tld = 'fr';
    google.nextText='Plus';
    google.protocol = 'https';

    google(args, function (err, res){
      res.links.forEach(function(link) {
         message.channel.send( new Discord.RichEmbed()
        .setTitle(link.title)
        .setColor(0x4285F4)
        .setDescription(link.description)
        .setThumbnail("http://diylogodesigns.com/blog/wp-content/uploads/2016/04/google-logo-icon-PNG-Transparent-Background.png")
        .setURL(link.href))
  		})
    });
  }

  // pic image random sur imgur
  if(command === "pic"){
    message.channel.send(cmd.picture());
  }

  // actu
  if(command === "actu") {
    cmd.actu(bot.user).then(res => {
      message.reply(res)
    });
  }

  // chuck
  if(command === "chuck"){
    cmd.chuck().then(res => {
      message.reply(res);
    });
  }

  // beauf
  if(command === "beauf") {
    message.channel.send(cmd.beauf());
  }

  // Rename
  if(command == "rename"){
    if(args[1] && message.member.roles.find("name", "Admin")){
      message.mentions.members.first().setNickname(args[1]);
      message.channel.send("Hey @everyone ! "+message.author+" a changé le nom de "+message.mentions.members.first()+" en ***"+args[1]+"***");
    }else if (args[1] && !message.member.roles.find("name", "Admin")) {
      message.reply("Bah alors ? On essaye de lancer des commandes alors qu'on est pas admin ?");
    }else if(args[0]){
      message.member.setNickname(args[0]);
      message.channel.send("Hey @everyone ! "+message.author+" a changé son nom en ***"+args+"***");
    }else{
      message.channel.send('Pseudo invalide')
    }
  }

  // Sondage
  if(command == "sondage"){
    if(args.length > 1){
      choix = args.join(" ");
      message.channel.send(":apple:***SONDAGE :apple:\n"+choix+"***")
        .then(function (message) {
          message.react("👍")
          message.react("👎")
        }).catch(function(err) {
          console.log(err);
        });
    }else {
      message.channel.send("Indique la raison du sondage")
    }
  }

  // Btc
  if(command == "coin" || command == "btc"){
    cmd.coin(args).then(res => {
      message.reply(res)
    });
  }

  // genre
  if(command === "genre") {
    cmd.gender(args).then(res => {
      message.channel.send(res);
    });
  }

  // doc
  if(command === "doc" || command === "help") {
    message.author.send(cmd.doc())
  }

  // amazon search
  if(command === "amazon" || command === "a") {
    if(args.length > 1){
      message.channel.send(cmd.amazon(args.join('+')));
    } else if(args.length == 0) {
      message.channel.send('tu veux quoi ?').then(() => {
        message.channel.awaitMessages(response => response.content.length > 0 , {
          max: 1,
          time: 30000,
          errors: ['time'],
        }).then(collected => {
            message.channel.send(cmd.amazon(collected.first().content));
        }).catch(() => {
            message.channel.send('T\'as pas trouvé les touches sur ton clavier ou quoi ?');
        });
      });
    } else {
      message.channel.send(cmd.amazon(args[0]));
    }
  }

  // wikipedia search
  if(command === "wikipedia" || command === "wiki") {
    if(args.length > 1) {
      cmd.wikipedia(args.join('-')).then(res => {
        message.channel.send(res);
      });
    } else if(args.length == 0) {
      message.channel.send('tu veux quoi ?').then(() => {
        message.channel.awaitMessages(response => response.content.length > 0 , {
          max: 1,
          time: 30000,
          errors: ['time'],
        }).then(collected => {
            cmd.wikipedia(collected.first().content).then(res => {
              message.channel.send(res)
            });
        }).catch(() => {
            message.channel.send('T\'as pas trouvé les touches sur ton clavier ou quoi ?');
        });
      });
    } else {
      cmd.wikipedia(args[0]).then(res => {
        message.channel.send(res)
      });
    }
  }
  // QUESTIONS TEXTUELLES

  // Demande de kick
  if (message.content.toUpperCase().includes("KICK MOI")){
    if(message.member.roles.find("name", "Admin")){
      message.channel.send("Je peux pas te kick t'es admin.");
    }else{
      message.member.kick();
    }
  }

  // DETECTEURS
  // Insulte detector
  let swear = cmd.insult(message.content);
  swear ? message.reply(swear) : null

  // Insulte detector
  let police = cmd.police(message);
  if(police) {
    message.reply(police.police);
    message.reply(police.msg)
    police.mutable ? muteUser(message.member,config.muteTime) : null;
  }

  // mute
  function muteUser(victime,time){
    // Overwrite permissions for a message author
    message.channel.overwritePermissions(victime, {
      SEND_MESSAGES: false
    }).then(() => {
      message.channel.send(victime+" a été mute pour "+time / 1000+" secondes. Fallait pas faire chier :kissing_heart:")
    }).catch(console.error);

    // temps avant de ban
    setTimeout(function(){
      unmuteUser(victime)
    },time);
  }

  // unmute
  function unmuteUser(victime){
    // Overwrite permissions for a message author
    message.channel.overwritePermissions(victime, {
      SEND_MESSAGES: true
    }).then(() => message.channel.send("On libère "+victime+", tu peux reparler maintenant :ok_hand: :slight_smile:")).catch(console.error);
  }

  // Bye bye
  function byebye(perdant) {
    message.channel.send("Bye bye "+perdant+" !");
    setTimeout(function(){ perdant.kick()}, 3000);
  }
});

bot.login(token);

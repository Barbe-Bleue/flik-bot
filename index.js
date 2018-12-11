//VARIABLES
const Discord = require('discord.js');
const bot = new Discord.Client();
const cmd = require ("./commands/index.js");
const nodemailer = require('nodemailer');
const request  = require("request");

var google = require('google')
var feed = require('rss-to-json'); // pour les actus
var http = require('http'); // pour le btc
var translate = require('translate');
var CoinMarketCap = require("node-coinmarketcap"); // pour le btc
var options = {
  events: true, // Enable event system
  refresh: 60, // Refresh time in seconds (Default: 60)
  convert: "EUR" // Convert price to different currencies. (Default USD)
}
var Nexmo = require('nexmo');
const nexmoSMS = new Nexmo({
  apiKey: "7e6f3343",
  apiSecret: "2953fb71fcf9ea5f"
});

var coinmarketcap = new CoinMarketCap(options);
var jsonfile = require('jsonfile');

var nbR = 1; //pour la roulette
var punitions = ["kick", "Changement de pseudo"]; //Textes des punitions
var cancerJSON = require('./json/cancer.json');
var insultesJSON = require('./json/insultes.json');
var pseudoJSON = require('./json/pseudo.json');
var flagJSON = require("./json/flag.json");

//config
var config = require('./json/config.json');
var token = config.token; // token discord
var prefix = config.prefix; // préfix des commandes
var yandexApiKey = config.yandexApiKey; // pour traduction
var muteTime = config.muteTime; // pour temps de mute

//CONNEXION
bot.on('ready', () => {
  console.log('bot ok!');
  //bot.channels..send("Salut moi c'est vag, le meilleur bot du monde :ok_hand: tape 'doc' ou 'help' pour savoir tout ce que je peux faire :sunglasses: ");
});

// Suppression de message
bot.on('messageDelete', message => {
	message.channel.send('Ohlala pas bien ! '+message.author.username+' a supprimer son message !');
	message.member.setNickname("supprimeur");
});

// Member join
bot.on("guildMemberAdd", member => {
  //console.log(member.user.username+member.guild.name);
  //console.log("Et maintenat on dit bonjour à "+member.user.username+" qui a rejoint"+member.guild.name+ " !" );
  //member.guild.channel.send(member.user.username+" has joined this server");
  member.send(cmd.doc());
});

// Message
bot.on('message', message => {

  // args & commands
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // check admin
  //var adminCommands = new Array("ban", "kick", "suicide", "mute","unmute");

  // COMMANDES !
  if (command === "sms"){
    message.author.send('tape le numero de téléphone suivit du message. Exemple: ***0610101010 salut comment ca va ?***').then(() => {
      message.author.dmChannel.awaitMessages(response => response.author.id === message.author.id , {
       max: 1,
       time: 30000,
       errors: ['time'],
      }).then((collected) => {
        var numberPhone = collected.first().content.split(" ")[0];
        var messageText = collected.first().content.split(" ").slice(1).join(' ');

        if(isNaN(numberPhone)){
          message.author.send("Le numero n'est pas correct, relace la commande **sms**");
        }else if(numberPhone.length > 11 || numberPhone.length < 10)  {
          message.author.send("Le numero n'est pas correct, relace la commande **sms**");
        }else{
          if(numberPhone.charAt(0) == 0){
            numberPhone = numberPhone.replace('0','33');
          }
          nexmoSMS.message.sendSms(
            config.myNumber, numberPhone, messageText,
            (err, responseData) => {
              if (err) {
                message.autor.send("Erreur lors de l'envoie :calling: :x:")
                console.log(err);
              } else {
                message.author.send(" Message envoyé ! :calling: :white_check_mark:")
                console.dir(responseData);
              }
            }
          );
        }
      }).catch(() => {
        message.author.send('T\'as pas trouvé les touches sur ton clavier ou quoi ?');
      });
    });
  }
  
  
  // traduction
  if (command === "traduis"){
     var key = yandexApiKey;

    if(args != ""){
      var text = message.content.split(' ').slice(1, -1).join(' ');
      var lang = message.content.split(" ").splice(-1);
      trad(text,lang,key);
    }else {
      message.reply('Que veux tu me faire traduire ?').then(() => {
        message.channel.awaitMessages(responseText => responseText.content.length > 0, {
          max: 1,
          time: 30000,
          errors: ['time'],
        }).then((collected) => {
            var text = collected.first().content;
            message.reply('en quelle langue ?').then(() => {
              message.channel.awaitMessages(responseLang => responseLang.content.length > 0, {
                max: 1,
                time: 30000,
                errors: ['time'],
              }).then((collectedLang) => {
                var lang = collectedLang.first().content;
                  if(text && lang){
                    trad(text,lang,key);
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
    if(message.member.roles.find("name", "Admin")){
      let time = args[1] ? args[1] * 1000 : muteTime
      muteUser( message.mentions.members.first(),time);
    } else {
      message.reply("Bah alors ? On essaye de lancer des commandes alors qu'on est pas admin ?");
    }
  }

  // unmute user
  if(command =="unmute"){
    if(message.member.roles.find("name", "Admin")) {
      unmuteUser(message.mentions.members.first());
    } else {
      message.reply("Bah alors ? On essaye de lancer des commandes alors qu'on est pas admin ?");
    }
  }

  // kick au hasard de la part de l'admin
  if (command === "kick"){
    if(message.member.roles.find("name", "Admin")) {
      let perdant = message.guild.members.random();
      message.channel.send("Roulette russe de l'admin ! Un kick au hasard !");
      if(perdant.kickable == false) {
        message.channel.send("Ok ça tombe sur l'admin on peut rien faire.");
      } else {
        message.channel.send(perdant.displayName+" a perdu.");
        setInterval(function() { handleTimer(5); }, 1000);
      }
    }
  }

  // roulette russe
  if(command === "roulette") {
    message.channel.send("Jeu de la roulette russe : "+ nbR +"/6 chance d'avoir une punition.");
    if(Math.floor(Math.random() * (6-nbR)) == 0) {
      var puni = Math.floor(Math.random()*punitions.length);

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
    if(message.member.roles.find("name", "Admin")){
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
      message.channel.send( new Discord.RichEmbed()
    	.setTitle("Meteo à "+res.city)
    	.setColor(0x10B8FE)
    	.setDescription(res.annonce + " "+res.temperature + "°C, " + res.description + " "+ res.emoji)
    	.setThumbnail("https://cdn.pixabay.com/photo/2016/05/20/20/20/weather-1405870_960_720.png")
    	.setTimestamp())
    });
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
    })
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

    for(var member in message.guild.members.array()){
      var userID =  message.guild.members.array()[member]['user'].id;
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
  if(command === "actu"){

    var actu=" ";
    feed.load('http://www.bfmtv.com/rss/info/flux-rss/flux-toutes-les-actualites/', function(err, rss){
      for(i = 0; i <= 1; i++){

        const embed = new Discord.RichEmbed()
        .setTitle(rss.items[i].title)
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setColor(0x00AE86)
        //.setDescription(rss.items[i].description)
        .setFooter("Vag", bot.user.avatarURL)
        .setImage(rss.items[i].enclosures[0].url)
        .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/4/40/BFM_TV_logo.png")
        .setTimestamp()
        .setURL(rss.items[i].url)
        message.channel.send({embed});
      }
    });
  }

  // chuck
  if(command === "chuck"){
    cmd.chuck().then(res => {
      message.channel.send(new Discord.RichEmbed()
      .setTitle("Chuck Norris fact !")
      .setColor(0xB87753)
      .setDescription(res.fact)
      .setThumbnail("http://pngimg.com/uploads/chuck_norris/chuck_norris_PNG1.png")
      .setFooter("Chuck Norris")
      .setTimestamp());
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
    if(args.length == 0){
      coinmarketcap.get("bitcoin", coin => {
        message.channel.send(":dollar: **"+coin.price_usd+" $** :dollar:");
      });
    }else if(args.length > 0){
      coinmarketcap.multi(coins => {
        var multiCoin = "";
        for (var i = 0; i < args.length; i++) {
          crypto = args[i].toUpperCase();
          if(coins.get(crypto)){
            multiCoin += crypto+" : "+coins.get(crypto).price_usd+" :dollar: \n";
          }else(message.channel.send("Je ne connais pas la monnaie **"+crypto+"** désolé :confused: "))
        }
        message.channel.send(multiCoin);
      });
    }
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
  if(cancerJSON[message.content]){
    message.channel.send(cancerJSON[message.content][Math.floor(Math.random() * cancerJSON[message.content].length)]);
  }

  // Insulte detector
  if(insultesJSON['insultes'].filter(item => message.content.includes(item)).length >= 1) {
    var mechant = message.member;
    message.reply(':oncoming_police_car: :rotating_light: POLICE DES GROS MOTS :rotating_light: :oncoming_police_car:');
    if(mechant.kickable == true){
      muteUser(mechant,config.muteTime);
    }else {
      message.channel.send("Ohw c'est vous admin ? Excuser moi pour le dérangement")
    }
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
  
  // Timer avant kick
  function handleTimer() {
    if(count === 0) {
      clearInterval(timer);
      byebye(perdant);
    } else {
      message.channel.send(count);
      count--;
    }
  }

  // Bye bye
  function byebye(perdant) {
    message.channel.send("Bye bye "+perdant+" !");
    setTimeout(function(){ perdant.kick()}, 3000);
  }

  
  // SEARCH FUNCTION
  function trad(text,lang,key){
    var flag =""
    country = lang.toString();

    if(flagJSON[country]){
      lang = flagJSON[country].code;
      var flag = flagJSON[country].flag;
    }else {
      lang = country;
      var flag = flagJSON["default"].flag;
    }

    var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key="+key+"&text="+text+"&lang="+lang+"&format=plain";
    request(url, function(err, resopnse, json){
      const embed = new Discord.RichEmbed()
      .setTitle("Traduction")
      .setColor(0xFF0000)
      .setDescription(JSON.parse(json).text)
      .setThumbnail(flag)
      .setTimestamp()
      message.channel.send({embed});
    });
  }

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
});

bot.login(token);
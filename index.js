//VARIABLES
const Discord = require('discord.js');
const bot = new Discord.Client();
const nodemailer = require('nodemailer');
var request = require('request');
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
var fs = require("fs"); //obligtoire pour des fonctions
var cancerJSON = require('./cancer.json');
var insultesJSON = require('./insultes.json');
var pauseJSON = require('./pause.json');
var pseudoJSON = require('./pseudo.json');
var meteoJSON = require("./meteo.json");
var flagJSON = require("./flag.json");
var cerveauTXT = "./cerveau.txt";
var docTXT = "./doc.txt";
var beaufTXT = "./beauf.txt";

//config
var config = require('./config.json');
var token = config.token; // token discord
var prefix = config.prefix; // préfix des commandes
var yandexApiKey = config.yandexApiKey; // pour traduction
var muteTime = config.muteTime; // pour temps de mute

//CONNEXION
bot.on('ready', () => {
  console.log('bot ok!');
  bot.channels.first().send("Salut moi c'est vag, le meilleur bot du monde :ok_hand: tape 'doc' ou 'help' pour savoir tout ce que je peux faire :sunglasses: ");
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
  fs.readFile(docTXT, 'utf8', function(err, data) {
    if (!err) {
      var laDoc = data.toString().split('\n');
      var doc ='';

      for (var i in laDoc){
        if(doc[i] != '') doc += laDoc[i]+'\n';
      } member.send(doc);
    } else console.log(err);
  });
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
      // Easy way to get member object though mentions.
      var member = message.mentions.members.first();
      // Kick
      if(member != undefined){
        member.kick().then((member) => {
          // Successmessage
          message.channel.send("@everyone :wave: **" + member.displayName + "** a été kické :point_right: ");
        }).catch(() => {
          // Failmessage
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
      var victime = message.mentions.members.first();
      if(args[1]){
        time = args[1] * 1000;
      }else {
        time = muteTime;
      }
      muteUser(victime,time);
    }else {
      message.reply("Bah alors ? On essaye de lancer des commandes alors qu'on est pas admin ?");
    }
  }

  // unmute user
  if(command =="unmute"){
    if(message.member.roles.find("name", "Admin")){
      var victime = message.mentions.members.first();
      unmuteUser(victime);
    }else {
      message.reply("Bah alors ? On essaye de lancer des commandes alors qu'on est pas admin ?");
    }
  }

  // kick au hasard de la part de l'admin
  if (command === "kick"){
    if(message.member.roles.find("name", "Admin")){
      var perdant = message.guild.members.random();
      message.channel.send("Roulette russe de l'admin ! Un kick au hasard !");
      if(perdant.kickable == false){
        message.channel.send("Ok ça tombe sur l'admin on peut rien faire.");
      }else{
        message.channel.send(perdant.displayName+" a perdu.");
        var count = 5;
        var timer = setInterval(function() { handleTimer(count); }, 1000);
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
  if (command === ("decide"))
    message.reply("Le choix est : " + args[Math.floor(Math.random() * args.length)]);

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
    var ville = args[0];
    var demain = args[1];
    var jour = 0;
    var annonce = "aujourd'hui la température est de ";
    var url;
    if(demain != null && demain.toUpperCase() === "DEMAIN"){
      jour = 1;
      annonce = "demain la température sera de ";
    }
    var openweathermeteo = function(ville, jour, callback){
      if (/^[a-zA-Z]/.test(ville)) {
        url = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+ville+"&mode=json&units=metric&cnt=2&lang=fr&appid=50d1f0d31cd8814419a3d8a06d208d4d";
      }else{
        url = "http://api.openweathermap.org/data/2.5/forecast/daily?zip="+ville+"&mode=json&units=metric&cnt=2&lang=fr&appid=50d1f0d31cd8814419a3d8a06d208d4d";
      }

    	request(url, function(err, response, body){
    		try{
    			var result = JSON.parse(body);
    			var previsions = {
            temperature : result.list[jour].temp.day,
    				city : result.city.name,
    				description : result.list[jour].weather[0].description
    			};
    			callback(null, previsions);
    		}catch(e){
    			callback(e);
    		}
    	});
    };
    openweathermeteo(ville, jour, function(err, previsions){
    	if(err) return console.log(err);
      const embed = new Discord.RichEmbed()
      .setTitle("Meteo à "+previsions.city)
      .setColor(0x10B8FE)
      .setDescription(annonce + " "+previsions.temperature + "°C, " + previsions.description + " "+ meteoJSON[previsions.description])
      .setThumbnail("https://cdn.pixabay.com/photo/2016/05/20/20/20/weather-1405870_960_720.png")
      .setTimestamp()
      message.channel.send({embed});
    });
  }

  // Trafic
  if(command === "trafic"){

    var code = args[0];
    var type = "";

    if(code.length > 1){
      var info = bulletin(code);
      info(function(err, bulletin){
        if(err) return console.log(err);

        var infoTrafic = "";

        for(ligne in bulletin){
          var status = bulletin[ligne["status"]];
          var statusMessage = "";
          if(typeof ligne !== undefined){
          	if(status === "Trafic normal") statusMessage = (":white_check_mark: : "+bulletin[ligne]);
          	else if(status === "Travaux") statusMessage = (":warning: : "+bulletin[ligne]);
          	else if(status === "Trafic perturbé") statusMessage = (":octagonal_sign: : "+bulletin[ligne]);
          	else if (status === "Trafic très perturbé") statusMessage = (":poop: : " +bulletin[ligne]);
        	}infoTrafic += "Ligne **"+ligne+"**: "+statusMessage+"\n";
        }
        const embed = new Discord.RichEmbed()
        .setTitle("Info traffic")
        .setColor(0x4AC1AE)
        .setDescription(infoTrafic)
        .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/RATP.svg/637px-RATP.svg.png")
        .setTimestamp()
        message.channel.send({embed});
      });
    }else{
      if(isNaN(code)) type = "rers";
      else type = "metros";

      var transports = leTrafic(type, code);

      transports(function(err, previsions){
        var infoTrafic = "";
      	if(err) return console.log(err);
      	if(previsions.status != null){
        	if(previsions.status === "Trafic normal") infoTrafic = ":white_check_mark: : "+previsions.message;
        	else if(previsions.status === "Travaux") infoTrafic = ":warning: : "+previsions.message;
        	else if(previsions.status === "Trafic perturbé") infoTrafic = ":octagonal_sign: : "+previsions.message;
        	else if (previsions.status === "Trafic très perturbé") infoTrafic = ":poop: : " +previsions.message;
      	}
        const embed = new Discord.RichEmbed()
        .setTitle("Info traffic ligne "+code)
        .setColor(0x4AC1AE)
        .setDescription(infoTrafic)
        .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/RATP.svg/637px-RATP.svg.png")
        .setTimestamp()
        message.channel.send({embed});
      });
    }
  }

  // chien
  if(command === "chien"){
    var leChien = leChien(type, code);
    leChien(function(err, previsions){
    	if(err) return console.log(err);
        message.channel.send(previsions.url);
    });
  }

  // gif
  if(command === "gif"){
    var leGif = gif(args[0]);
    leGif(function(err, previsions){
      if(err) return console.log(err);
      message.channel.send(previsions.url);
    });
  }

  // apprend une phrase
  if(command === "apprends") {
    if(args != ""){
      var sentence = transformSentence(args.join(' '));
      writeCerveau(sentence);
    }else{
      message.channel.sendMessage('Que veux tu me faire apprendre ?').then(() => {
        message.channel.awaitMessages(response => response.content.length > 0, {
          max: 1,
          time: 30000,
          errors: ['time'],
        }).then((collected) => {
            var newSavoir = true;
            console.log(collected.first().content);
            var sentence = transformSentence(collected.first().content);
            writeCerveau(sentence);

          }).catch(() => {
            message.channel.send('T\'as pas trouvé les touches sur ton clavier ou quoi ?');
          });
      });
    }
  }

  // savoir exprime 1 savoir
  if(command === "savoir") {
    fs.readFile(cerveauTXT, 'utf8', function(err, data) {
      if (!err) {
        var savoir = data.toString().split('\n');

        if(savoir !='') message.channel.send(savoir[Math.floor(Math.random() * savoir.length)]);
        else message.channel.send("Hey, flemme me casse pas les couilles");

      } else {
        console.log(err);
      }
    });
  }

  // malou exprime tout le savoir
  if(command === "malou") {
    fs.readFile(cerveauTXT, 'utf8', function(err, data) {
      if (!err) {
        var grandSavoir = data.toString().split('\n');
        var savoir ='';

        for (var i in grandSavoir){
          if(savoir[i] != '') savoir += grandSavoir[i]+'\n';
        } message.channel.send(savoir);
      }else console.log(err);
    });
  }

  // pause gouter pour chaque membres
  if(command === "pause") {
    var userID,manger,boire;
    message.channel.send('Aight c\'est l\'heure de la pause :ok_hand: :coffee: :chocolate_bar: ');
    for(var member in message.guild.members.array()){
      userID =  message.guild.members.array()[member]['user'].id;
      manger = pauseJSON['manger'][Math.floor(Math.random() * pauseJSON['manger'].length)];
      boire = pauseJSON['boire'][Math.floor(Math.random() * pauseJSON['boire'].length)];
      message.channel.send('<@'+userID+'> : '+manger+' | '+boire);
    }
  }

  // top
  if(command === "h1z1"){
    var reaction,top,kill;
    var prediction = "";
    var nbGame = Math.floor((Math.random() * 5) + 1);

    message.channel.send("Ce soir on fait "+nbGame+" game \n");
    for(var k = 0; k < nbGame; k++){
      top = Math.floor((Math.random() * 170) + 1);
      kill = Math.floor((Math.random() * 10));

      if (top <=10) reaction = ":scream: :ok_hand: :fire: :military_medal: ";
      else if(top > 10 && top <= 50) reaction = ":neutral_face: :medal: ";
      else reaction = ":weary: :sob: :gun: :knife: :no_entry: ";

      prediction += "Top "+top+" "+reaction+" | "+kill+" kill :boom: \n";
    }
    message.channel.send(prediction);
  }

  // google recherche google
  if(command === "google"){
    var keyword = args[0];
    google.l
    //var nextCounter = 0;
    google.resultsPerPage = 5;
    google.lang = 'fr';
    google.tld = 'fr';
    google.nextText='Plus';
    google.protocol = 'https';
    var resultat,link ="";

    google(args, function (err, res){
      if (err) console.error(err);

      for (var i = 0; i < res.links.length; ++i) {
        link = res.links[i];
        console.log(res.links[i]);
        if (link.href != null){
          const embed = new Discord.RichEmbed()
          .setTitle(link.title)
          .setColor(0x4285F4)
          .setDescription(link.description)
          .setThumbnail("http://diylogodesigns.com/blog/wp-content/uploads/2016/04/google-logo-icon-PNG-Transparent-Background.png")
          .setURL(link.href)
          message.channel.send({embed});
        }
      }
    });
  }

  // pic image random sur imgur
  if(command === "pic"){
    var anysize = 5;//the size of string
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPKRSTUVWXYZ";
    var result="";
    for( var m=0; m < anysize; m++ ){
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    message.channel.send("http://imgur.com/gallery/"+result);
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
    var url = "http://www.chucknorrisfacts.fr/api/get?data=tri:alea;nb:01";
    request(url, function(err, response, json){
      const embed = new Discord.RichEmbed()
      .setTitle("Chuck Norris fact !")
      .setColor(0xB87753)
      .setDescription(JSON.parse(json)[0].fact)
      .setThumbnail("http://pngimg.com/uploads/chuck_norris/chuck_norris_PNG1.png")
      .setFooter("Chuck Norris")
      .setTimestamp()
      message.channel.send({embed});
    });
  }

  // beauf
  if(command === "beauf") {
    fs.readFile(beaufTXT, 'utf8', function(err, data) {
      if (!err) {
        var beauf = data.toString().split('\n');
        if(beauf !=''){
          const embed = new Discord.RichEmbed()
          .setTitle("Le beauf")
          .setColor(0x00AE86)
          .setDescription(  beauf[Math.floor(Math.random() * beauf.length)])
          .setThumbnail("http://image.noelshack.com/fichiers/2017/34/2/1503406665-beaufdefrance.png")
          message.channel.send({embed});
        }
        else message.channel.send("Hey, flemme me casse pas les couilles");
      } else console.log(err);
    });
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
          //message.pin()
          //message.delete()
        }).catch(function() {
          //Something
        });
    }else {
      message.channel.send("Indique la raison du sondage")
    }
  }

  // Btc
  if(command == "coin" || command == "btc"){
    if(args.length == 0){
      // If you want to check a single coin, use get() (You need to supply the coinmarketcap id of the cryptocurrency, not the symbol)
      // If you want to use symbols instead of id, use multi.
      coinmarketcap.get("bitcoin", coin => {
        message.channel.send(":dollar: **"+coin.price_usd+" $** :dollar:"); // Prints the price in USD of BTC at the moment.
      });
    }else if(args.length > 0){
      var multiCoin = "";
      // If you want to check multiple coins, use multi():
      coinmarketcap.multi(coins => {
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

  // RECHERCHES
  switch (command) {
    // wiki
    case "wiki" :
      bangSearch(wikiSearch,'_',args);
      break;
    // afr amazon fr
    case "amazon" :
      bangSearch(amazonSearch,'+',args);
      break;
    // genre
    case "genre" :
      bangSearch(genreSearch,' ',args);
      break;
  }

  // Steam
  if(command === "steam"){
    var pseudo = args[0];
    if(pseudo != null){
      var steamID = getSteamID(pseudo);
      steamID(function(err, resultat){
        var succ = resultat.success;
        var id = "";
        if(succ != "1" && /^\d+$/.test(pseudo) == true){
          id = pseudo;
          succ = "1";
        }else{
          id = resultat.id;
        }
        if (succ == "1"){
          var url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=B480E532F65ABE5030AA92D1E09EAAA5&steamid="+id+"&include_appinfo=1&format=json";
          request(url, function(err, response, json){
            var jeu,appid,img = "";
            var heuresJeu = 1;
            var result = JSON.parse(json);
            var nbJeux = result.response.game_count;
            for (var i = 0; i < nbJeux; i++){
          		if(result.response.games[i].playtime_forever > heuresJeu){
                heuresJeu = result.response.games[i].playtime_forever;
                jeu = result.response.games[i].name;
                appid = result.response.games[i].appid;
                img = result.response.games[i].img_logo_url;
              }
            }
            heuresJeu = heuresJeu/60;
            steamStats ="ce joueur a " + nbJeux + " jeux sur steam.\n";
            steamStats += "http://media.steampowered.com/steamcommunity/public/images/apps/"+appid+"/"+img+".jpg\n";
            steamStats += "Le jeu le plus joué est '" + jeu + "' avec " + heuresJeu.toFixed(2) + " heures de jeu.\n";
            message.channel.send(steamStats);
          });
        }
      });
    }
  }

  // doc
  if(command === "doc" || command === "help") {
    fs.readFile(docTXT, 'utf8', function(err, data) {
      if (!err) {
        var laDoc = data.toString().split('\n');
        var doc ='';

        for (var i in laDoc){
          if(doc[i] != '') doc += laDoc[i]+'\n';
        } message.author.send(doc)
      }   else console.log(err);
    });
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

  // FONCTIONS
  function writeCerveau(sentence) {
    fs.readFile(cerveauTXT, 'utf8', function(err, data) {
      if (!err || sentence !='') {
        var savoir = data.toString().split('\n');

        for(var line in savoir) {
          if(sentence == savoir[line]){
            var newSavoir = false;
          }
        }
        if(newSavoir != false) {
          fs.appendFile(cerveauTXT,sentence+'\n',"UTF-8",{'flags': 'a+'});
          message.channel.send("Ok poto jm'en souviendrai :thumbsup: ");
          newSavoir = false;
        } else {
          message.channel.send(":no_entry: Hey, je connais déjà ca ! :no_entry: ");
          newSavoir = true;
        }
      }
    });
  }

  // mute
  function muteUser(victime,time){
    // Overwrite permissions for a message author
    message.channel.overwritePermissions(victime, {
      SEND_MESSAGES: false
    }).then(() => message.channel.send(victime+" a été mute pour "+time / 1000+" secondes. Fallait pas faire chier :kissing_heart:")).catch(console.error);

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

  function transformSentence(sentence){
    var sentenceArray = sentence.slice().trim().split(/ +/g );
    // pronoms
    if(sentenceArray[0] == "que")
      sentenceArray.shift();

    switch (sentenceArray[0]) {
      case "tu" :
        sentenceArray[0] = "je";
        break;
      case "je" :
        sentenceArray[0] = message.author;
        break;
      case message.mentions.members.first():
        sentenceArray[0] =  message.mentions.members.first();
        break;
    }
    // verbe
    switch (sentenceArray[1]) {
      case "es":
        sentenceArray[1] = "suis";
        break;
      case "suis":
        sentenceArray[1] = "est";
        break;
      case "as":
        sentenceArray[1] = "ai";
        break;
      case "as":
        sentenceArray[1] = "ai";
        break;
    }
    return sentence = sentenceArray.join(" ");
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

  //Bye bye
  function byebye(perdant) {
    message.channel.send("Bye bye "+perdant+" !");
    setTimeout(function(){ perdant.kick()}, 3000);
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

  // pour le chien
  function leChien(type, code){
    var leChien;
    return leChien = function(callback){
      url = "https://api.thedogapi.co.uk/v2/dog.php?limit=1";
    	request(url, function(err, response, body){
    		try{
    			var result = JSON.parse(body);
    			var previsions = {
    				url : result.data[0].url,
    			};
    			callback(null, previsions);
    		}catch(e){
    			callback(e);
    		}
    	});
    };
  }

  // giphy
  function gif(recherche){
    var leGif = "";
    return leGif = function(callback){
      url = "http://api.giphy.com/v1/gifs/search?api_key=2a6166b6303a485088cd82579ada608f&q="+recherche+"&limit=20";
    	request(url, function(err, response, body){
    		try{
    		  var nbRec = Math.floor(Math.random() * 20);
    			var result = JSON.parse(body);
    			var previsions = {
    				url : result.data[nbRec].images.original.url,
    			};
    			callback(null, previsions);
    		}catch(e){
    			callback(e);
    		}
    	});
    };
  }

  //getID Steam
  function getSteamID(pseudo){
    var SID;
    return SID = function(callback){
      url = "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=B480E532F65ABE5030AA92D1E09EAAA5&vanityurl="+pseudo;
    	request(url, function(err, response, body){
    		try{
    			var result = JSON.parse(body);
    			var resultat = {
      			success : result.response.success,
    				id : result.response.steamid,
    			};
    			callback(null, resultat);
    		}catch(e){
    			callback(e);
    		}
    	});
    };
  }

  // SEARCH FUNCTION
  function genreSearch(prenom){
    var url = "https://gender-api.com/get?name="+prenom+"&country=FR&key=kXRfKPCeGsNKcUwseW";
    request(url, function(err, resopnse, json){
      var genre = JSON.parse(json).gender;
      var precision = JSON.parse(json).accuracy;
      if(genre === "male") genre = "Homme";
      else genre = "Femme";
      message.channel.send(prenom+': '+genre + ", sûr à " + precision + "%");
    });
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

  function wikiSearch(recherche){
    var url = "https://fr.wikipedia.org/w/api.php?action=opensearch&search="+recherche+"&limit=1&namespace=0&format=json";
    request(url, function(err, resopnse, json){
      try {
        var name = JSON.parse(json)[1];
        var link = JSON.parse(json)[3];
        if(name ==='undefined'){
          message.channel.send('Aucun résultats');
        }else {
          message.channel.send('Recherche wikipedia pour: '+recherche);
          message.channel.send('Nom: '+name[0]+'\n'+link[0]+'\n\n');
        }
      } catch (e) {
        callback('ERREUR: '+e);
      }
    });
  }

  function amazonSearch(recherche){
    var url = "https://www.amazon.fr/s/ref=nb_sb_noss?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&url=search-alias%3Daps&field-keywords="+recherche;
    const embed = new Discord.RichEmbed()
        .setTitle("Recherche amazon pour: "+recherche)
        .setColor(0xF3A847)
        .setDescription(url)
        .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/b/b4/Amazon-icon.png")
        .setTimestamp()
        .setURL(url)
        message.channel.send({embed});
  }

  function bangSearch(searchFunctionName,keywordSeparator,args){
    if(args.length > 1){
      searchFunctionName(args.join(keywordSeparator));
    }else if (args.length == 0) {
      message.channel.send('tu veux quoi ?').then(() => {
        message.channel.awaitMessages(response => response.content.length > 0 , {
          max: 1,
          time: 30000,
          errors: ['time'],
        }).then((collected) => {
          searchFunctionName(collected.first().content);
        }).catch(() => {
          message.channel.send('T\'as pas trouvé les touches sur ton clavier ou quoi ?');
        });
      });
    }else{
      searchFunctionName(args[0]);
    }
  }
});

bot.login(token);

/*
ressources API :
https://github.com/pgrimaud/horaires-ratp-api
https://openweathermap.org/api
http://thedogapi.co.uk/api/v1/dog?limit=1
https://developers.giphy.com/dashboard/
https://github.com/jprichardson/node-google
https://www.npmjs.com/package/rss-to-json
https://translate.yandex.net/api/v1.5/tr.json/translate?key=&text=&lang=&format=plain
https://www.nexmo.com/
*/

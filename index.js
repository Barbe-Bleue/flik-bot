//VARIABLES
const Discord = require('discord.js');
const bot = new Discord.Client();
const nodemailer = require('nodemailer');
var request = require('request');
var google = require('google')
var feed = require('rss-to-json');

var nbR = 1; //pour la roulette
var punitions = ["kick", "Changement de pseudo"]; //Textes des punitions
var fs = require("fs"); //obligtoire pour des fonctions
var cancerJSON = require('./cancer.json');
var pauseJSON = require('./pause.json');
var pseudoJSON = require('./pseudo.json');
var meteoJSON = require("./meteo.json");
var cerveauTXT = "./cerveau.txt";
var docTXT = "./doc.txt";
var beaufTXT = "./beauf.txt";
var config = require('./config.json');
chezmoi2
//CONNEXION
bot.on('ready', () => {
  console.log('bot ok!');
  bot.channels.first().send("Salut moi c'est vag, le meilleur bot du monde :ok_hand:");
});

// Suppression de message
bot.on('messageDelete', message => {
	message.channel.send('Ohlala pas bien ! '+message.author.username+' a supprimer son message !');
	message.member.setNickname("supprimeur");
});

// Member join
bot.on("guildMemberAdd", (member) => {
  console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
  member.guild.channels.get("welcome").send(`"${member.user.username}" has joined this server`);
});

// Message
bot.on('message', message => {

  // Variables
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //COMMANDES !

  // Ban
  if (message.content.startsWith('!ban')){
    if(message.member.kickable != false){
      // Easy way to get member object though mentions.
      var member= message.mentions.members.first();
      // Kick
      member.kick().then((member) => {
        // Successmessage
        message.channel.send(":wave: " + member.displayName + " a été kické :point_right: ");
      }).catch(() => {
        // Failmessage
        message.channel.send("On ne peut pas bannir Dieu :cross:");
      });
    }else {
      message.channel.send("Bah alors ? On essaye de lancer des commandes alors qu'on est pas admin ?");
    }
  }

  // kick au hasard de la part de l'admin
  if (command === "kick"){
    if(message.member.kickable == false){
      var perdant = message.guild.members.random();
      message.channel.send("Roulette russe de l'admin ! Un kick au hasard !");
      if(perdant.kickable == false){
        message.channel.send("Ok ça tombe sur l'admin on peut rien faire.");
      }else{
        message.channel.send('<@'+perdant.id+"> a perdu.");
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
    message.channel.send("Le choix est : " + args[Math.floor(Math.random() * args.length)]);

  // suicide du bot
  if (command === "suicide"){
    message.channel.send("Ah ok on me bute comme ça :tired_face: :gun:");
    bot.destroy();
  }

  // meteo
  if(command === "meteo"){

    var ville = args[0];
    var demain = args[1];
    var jour = 0;
    var annonce = "aujourd'hui, la température est de ";
    var url;
    if(demain != null && demain.toUpperCase() === "DEMAIN"){
      jour = 1;
      annonce = "demain, la température sera de ";
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
    	message.channel.send("A "+previsions.city+", " + annonce + previsions.temperature + "°C, " + previsions.description + " "+ meteoJSON[previsions.description]);
    });
  }

  // Trafic
  if(command === "trafic"){

    var traf = message.content.split(" ");
    if(traf.length > 1){
      var code = args[0];
      var type = "";

      if(code.toUpperCase() != code.toLowerCase()) type = "rers";
      else type = "metros";

      var transports = leTrafic(type, code);

      transports(function(err, previsions){
      	if(err) return console.log(err);
      	if(previsions.status != null){
        	if(previsions.status === "Trafic normal") message.channel.send(":white_check_mark: : "+previsions.message);
        	else if(previsions.status === "Travaux") message.channel.send(":warning: : "+previsions.message);
        	else if(previsions.status === "Trafic perturbé") message.channel.send(":octagonal_sign: : "+previsions.message);
        	else if (previsions.status === "Trafic très perturbé") message.channel.send(":poop: : " +previsions.message);
      	}
      });
    }
  }

  //chien
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
  if(command === "apprend") {
    message.channel.sendMessage('Que veux tu me faire apprendre ?').then(() => {
      message.channel.awaitMessages(response => response.content.length > 0, {
        max: 1,
        time: 30000,
        errors: ['time'],
      }).then((collected) => {
          var sentence = collected.first().content;
          var newSavoir = true;
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
                message.channel.send(":no_entry: Hey, je connais déjà ca fdp :no_entry: ");
                newSavoir = true;
              }
            }
          });
        }).catch(() => {
          message.channel.send('There was no collected message that passed the filter within the time limit!');
        });
    });
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
      }
      else console.log(err);

    });
  }

  // doc
  if(command === "doc") {
    fs.readFile(docTXT, 'utf8', function(err, data) {
      if (!err) {
        var laDoc = data.toString().split('\n');
        var doc ='';

        for (var i in laDoc){
          if(doc[i] != '') doc += laDoc[i]+'\n';
        } message.channel.send(doc);
      }
      else console.log(err);

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
        if (link.href != null) resultat +=  link.title + ' - ' + link.href+"\n\n";
      } message.channel.send(resultat);
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
      for(i = 0; i <= 5; i++) actu += rss.items[i].title+" - "+rss.items[i].url+"\n\n";
      message.channel.send(actu);
    });
  }

  // chuck
  if(command === "chuck"){
    var url = "http://www.chucknorrisfacts.fr/api/get?data=tri:alea;nb:1";
    request(url, function(err, response, json){
      message.channel.send(JSON.parse(json)[0].fact);
    });
  }

  // beauf
  if(command === "beauf") {
    fs.readFile(beaufTXT, 'utf8', function(err, data) {
      if (!err) {
        var beauf = data.toString().split('\n');
        if(beauf !='') message.channel.send('Le beauf '+beauf[Math.floor(Math.random() * beauf.length)]);
        else message.channel.send("Hey, flemme me casse pas les couilles");
      } else console.log(err);
    });
  }
  // wiki
  if(command === "wiki"){
    bangSearch(wikiSearch,'_',args);
  }

  // afr amazon fr
  if(command === ("afr")){
    bangSearch(amazonSearch,'+',args);
  }

  // sexe
  if(command === "sexe"){
    bangSearch(sexeSearch,' ',args);
  }

  // Steam
  if(message.content.toUpperCase().includes("/STEAM")){

    var pseudo = message.content.split(" ")[1];
    if(pseudo != null){
      var steamID = getSteamID(pseudo);
      steamID(function(err, resultat){
        var succ = resultat.success;
        var id = "";
        if(succ != "1" && /^\d+$/.test(pseudo) == true){
          id = pseudo;
          succ = "1";
        }
        else{
          id = resultat.id;
        }
        if (succ == "1"){
          var url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=B480E532F65ABE5030AA92D1E09EAAA5&steamid="+id+"&include_appinfo=1&format=json";
          request(url, function(err, response, json){
            var jeu = "";
            var heuresJeu = 1;
            var appid = "";
            var img = "";
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
            message.channel.send("ce joueur a " + nbJeux + " jeux sur steam.");
            message.channel.send("http://media.steampowered.com/steamcommunity/public/images/apps/"+appid+"/"+img+".jpg");
            message.channel.send("Le jeu le plus joué est '" + jeu + "' avec " + heuresJeu.toFixed(2) + " heures de jeu.");
          });
        }
      });
    }
  }

  // Mail
  if(command === "mail"){
    var phrase = message.content.split(" ");
        if(phrase.length >= 4){
          var mail = phrase[1];
          var sujet = phrase[2];
          var texte = "";
          for(var i = 3; i < phrase.length; i++){
            texte = texte + " " + phrase[i];
          }
          'use strict';
          let transporter = nodemailer.createTransport({
              host : "smtp.gmail.com",
              port: 465,
              auth: {
                user: 'lebotrelou@gmail.com',
                pass: 'Grostest92'
              }
          });
          let mailOptions = {
              from: '"Le Bot Relou 2 Discord !" <lebotrelou@gmail.com>',
              to: mail,
              subject: sujet,
              text: texte,
          };
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return console.log(error);
              }
              message.channel.send("Message envoyé poto :ok_hand:");
          });
      }
  }




  // QUESTIONS TEXTUELLES

  // Go cs
  if (message.content.toUpperCase() === ("GO CS")){
    if(message.member.kickable == false){
      message.channel.send("L'admin veut lancer une partie de cs, tappez 'go CS' pour rejoindre. (1/5)");
    }
    else{
      message.author.send("wlh tg parle pas de cs");
      message.member.kick();
    }
  }

  // Demande de kick
  if (message.content.toUpperCase().includes("KICK MOI")){
    if(message.member.kickable == false){
      message.channel.send("Batard je peut pas te kick t'es admin.");
    }
    message.member.kick();
  }

  // DETECTEURS

  // Insulte detector
  if(cancerJSON[message.content]){
    message.channel.send(cancerJSON[message.content][Math.floor(Math.random() * cancerJSON[message.content].length)]);
  }

  // Méthonde plus lente
  /*
    for(var insulte in cancerJSON) {
      if(message.content.includes(insulte) && message.content != '' && typeof cancerJSON[insulte] != 'undefined'){
          message.channel.send(cancerJSON[insulte][Math.floor(Math.random() * cancerJSON[insulte].length)]);
      }
    }
  }*/

  // FONCTIONS

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
    message.channel.send("Bye bye <@"+perdant.id+"> !");
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
  function sexeSearch(prenom){
    var url = "https://gender-api.com/get?name="+prenom+"&country=FR&key=kXRfKPCeGsNKcUwseW";
    request(url, function(err, resopnse, json){
      var sexe = JSON.parse(json).gender;
      var precision = JSON.parse(json).accuracy;
      if(sexe === "male") sexe = "Homme";
      else sexe = "Femme";
      message.channel.send(prenom+': '+sexe + ", sûr à " + precision + "%");
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
    message.channel.send('Recherche amazon pour: '+recherche+'\n'+url);
  }

  function bangSearch(searchFunctionName,keywordSeparator,args){
    if(args.length > 1){
      searchFunctionName(args.join(keywordSeparator));
    }else if (args.length == 0) {
      message.channel.send('tu veux quoi ?').then(() => {
        message.channel.awaitMessages(response => response.content.length > 0 , {
          max: 1,
          time: 10000,
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

bot.login(config.token);

/*
Pour lancer le bot,
Ouvrir un nouveau terminal et tapper "bot"

Fermer le terminal ou la page C9 = bot offline, tout recommencer
à faire après chaque ctrl+s


ressources API :
https://github.com/pgrimaud/horaires-ratp-api
https://openweathermap.org/api
http://thedogapi.co.uk/api/v1/dog?limit=1
https://developers.giphy.com/dashboard/
https://github.com/jprichardson/node-google
https://www.npmjs.com/package/rss-to-json
*/

//VARIABLES
const Discord = require('discord.js');
const bot = new Discord.Client();
const nodemailer = require('nodemailer');
var request = require('request');
var google = require('google')
var feed = require('rss-to-json');

var punitions = ["kick", "Changement de pseudo"]; //Textes des punitions
var fs = require("fs"); //obligtoire pour des fonctions
var cancerJSON = require('./cancer.json');
var pauseJSON = require('./pause.json');
var pseudoJSON = require('./pseudo.json');
var meteoJSON = require("./meteo.json");
var cerveauTXT = "./cerveau.txt";
var docTXT = "./doc.txt";
var beaufTXT = "./beauf.txt";
var nbR = 1; //pour la roulette
var auth = require('./auth.json');
bot.login(auth.token);

//CONNEXION
bot.on('ready', () => {
  console.log('bot ok!');
  bot.channels.first().send("Salut moi c'est Flik, le meilleur bot du monde :ok_hand:");
});


//Message
bot.on('message', message => {

  //Variables
  var tousLeMonde = message.guild.members;

  //COMMANDES !
  //kick au hasard de la part de l'admin
  if (message.content === ("!kick")){
    if(message.member.kickable == false){
      message.channel.send("Roulette russe de l'admin ! Un kick au hasard !");
      var perdant = tousLeMonde.random();
      if(perdant.kickable == false){
        message.channel.send("Ok ça tombe sur l'admin on peut rien faire.");
      }
      else{
        message.channel.send('<@'+perdant.id+"> a perdu.");
        var count = 5;
        var timer = setInterval(function() { handleTimer(count); }, 1000);
      }
    }
  }

  //roulette russe
  if(message.content === "!roulette") {
    message.channel.send("Jeu de la roulette russe : "+ nbR +"/6 chance d'avoir une punition.");
    if(Math.floor(Math.random() * (6-nbR)) == 0) {
      var puni = Math.floor(Math.random()*punitions.length);
      message.channel.send("PAN");
      message.channel.send("Punition : " + punitions[puni]);

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

  //decide choix1 choix2...
  if (message.content.includes("!decide")){
    var choix = message.content.split(" ");
    choix.splice(choix.indexOf("!decide"), 1);
    if(choix.indexOf("noir") == -1){
      message.channel.send("Le choix est : " + choix[Math.floor(Math.random() * choix.length)]);
    }
    else{
       choix.splice(choix.indexOf("noir"), 1);
       message.channel.send("lol c'est pas noir déjà. La réponse est : " + choix[Math.floor(Math.random() * choix.length)]);
    }
  }

  //spam "string" nbRepetitions
  if (message.content.includes("!spam")){
    var choix = message.content.split(" ");
    var taille = choix.length;
    var phrase = "";
    for (var j = 1; j < taille-1; j++){
      phrase = phrase + " " + choix[j];
    }
    if(choix[taille-1] <= 100 && choix.length >= 3){
      for (var i = 0; i < choix[taille-1]; i++) {
        message.channel.send(phrase);
      }
    }
  }

  //suicide du bot
  if (message.content === "!suicide"){
    message.channel.send("Ah ok on me bute comme ça :tired_face: :gun:");
    bot.destroy();
  }

  //meteo
  if(message.content.includes("!meteo")){

    var ville = message.content.split(" ")[1];
    var demain = message.content.split(" ")[2];
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
      }
      else{
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

  //trafic
  if(message.content.includes("!trafic")){

    var traf = message.content.split(" ");
    if(traf.length > 1){
      var code = traf[1];
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
  if(message.content === "!chien"){
    var leChien = leChien(type, code);
    leChien(function(err, previsions){
    	if(err) return console.log(err);
    	message.channel.send(previsions.url);
    });
  }

  //gif
  if(message.content.includes("!gif")){
    var phrase = message.content.split(" ");
    var recherche = "";
    for(var i = 1; i<phrase.length; i++){
      if(i==1) recherche = phrase[i];
      else recherche = recherche + "+" + phrase[i];
    }
    var leGif = gif(recherche);
    leGif(function(err, previsions){
      if(err) return console.log(err);
      message.channel.send(previsions.url);
    });
}

  //apprend une phrase
  if(message.content.includes("!apprend")) {
    var sentence = message.content.split("!apprend ").pop();
    fs.readFile(cerveauTXT, 'utf8', function(err, data) {
      if (!err || sentence !='') {
        var savoir = data.toString().split('\n');
        for(var line in savoir) {
          if(sentence == savoir[line]){
            var newSavoir = false;
          }
        }
      } else {
        console.log(err);
      }
      if(newSavoir != false) {
        fs.appendFile(cerveauTXT,sentence+'\n',"UTF-8",{'flags': 'a+'});
        message.channel.send("Ok poto jm'en souviendrai :thumbsup: ");
      } else {
        message.channel.send(":no_entry: Hey, je connais déjà ca fdp :no_entry: ");
      }
    });
  }

  //savoir exprime 1 savoir
  if(message.content === ("!savoir")) {
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

  //malou exprime tout le savoir
  if(message.content ===("!malou")) {
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

  //doc
  if(message.content ===("!doc")) {
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

  //pause gouter pour chaque membres
  if(message.content === ("!pause")) {
    var userID,manger,boire;
    message.channel.send('Aight c\'est l\'heure de la pause :ok_hand: :coffee: :chocolate_bar: ');
    for(var branleur in tousLeMonde.array()){
      userID =  tousLeMonde.array()[branleur]['user'].id;
      manger = pauseJSON['manger'][Math.floor(Math.random() * pauseJSON['manger'].length)];
      boire = pauseJSON['boire'][Math.floor(Math.random() * pauseJSON['boire'].length)];
      message.channel.send('<@'+userID+'> : '+manger+' | '+boire);
    }
  }

  //top
  if(message.content === ("!top")){
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

  //google recherche google
  if(message.content.includes("!google")){
    var keyword = message.content.split(" ");
    keyword.splice(keyword.indexOf("/google"), 1);
    google.l
    //var nextCounter = 0;
    google.resultsPerPage = 10;
    google.lang = 'fr';
    google.tld = 'fr';
    google.nextText='Plus';
    google.protocol = 'https';
    var resultat,link ="";

    google(keyword, function (err, res){
      if (err) console.error(err);

      for (var i = 0; i < res.links.length; ++i) {
        link = res.links[i];
        if (link.href != null) resultat +=  link.title + ' - ' + link.href+"\n\n";
      } message.channel.send(resultat);
    });
  }

  //pic image random sur imgur
  if(message.content === ("!pic")){
    var anysize = 5;//the size of string
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPKRSTUVWXYZ";
    var result="";
    for( var m=0; m < anysize; m++ ){
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    message.channel.send("http://imgur.com/gallery/"+result);
  }

  //actu
  if(message.content === ("/actu")){
    var actu = "";
    feed.load('http://www.bfmtv.com/rss/info/flux-rss/flux-toutes-les-actualites/', function(err, rss){
      console.log(rss);
      for(i = 0; i <= 5; i++) actu += rss.items[i].title+" - "+rss.items[i].url+"\n\n";
      message.channel.send(actu);
    });
  }

  //chuck
  if(message.content.includes("/chuck")){
    var nbChuck = message.content.split(" ");
    nbChuck.splice(nbChuck.indexOf("/chuck"), 1);

    var url = "http://www.chucknorrisfacts.fr/api/get?data=tri:alea;nb:"+nbChuck;

    request(url, function(err, response, json){
      message.channel.send(JSON.parse(json)[0].fact);
    });

  }

  //sexe
  if(message.content.includes("/sexe")){
    var nom = message.content.split(" ");
    nom.splice(nom.indexOf("/sexe"),1);
    var url = "https://gender-api.com/get?name="+nom[0]+"&country=FR&key=kXRfKPCeGsNKcUwseW";

    request(url, function(err, resopnse, json){
      var sexe = JSON.parse(json).gender;
      var precision = JSON.parse(json).accuracy;
      if(sexe === "male") sexe = "Homme";
      else sexe = "Femme";
      message.channel.send(sexe + ", sûr à " + precision + "%");
    });
  }

  //beauf
  if(message.content === "!beauf") {
    fs.readFile(beaufTXT, 'utf8', function(err, data) {
      if (!err) {
        var beauf = data.toString().split('\n');
        if(beauf !='') message.channel.send('Le beauf '+beauf[Math.floor(Math.random() * beauf.length)]);
        else message.channel.send("Hey, flemme me casse pas les couilles");
      } else console.log(err);
    });
  }

  //afr amazon fr
  if(message.content.includes("/afr")){
    var amazon = message.content.split(" ");
    amazon.splice(amazon.indexOf("/decide"), 1);
    message.channel.send("https://www.amazon.fr/s/ref=nb_sb_noss?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&url=search-alias%3Daps&field-keywords="+amazon);
  }

  //Steam
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

  //difference avec une heure
  if(message.content.includes("/diff")){
    var now = new Date();
    var heure = now.getHours()+2;
    var minute = now.getMinutes();

    var phrase = message.content.split(" ");
    phrase = phrase[phrase.indexOf("/diff")+1];
    var diff = diff(phrase);
    var diffH = Math.floor(diff / 60);
    var diffM = diff % 60;
    message.channel.send(diffH + " heures et " + diffM + " minutes.");
  }

  //Pourcentage de la journée
  if(message.content.includes("/%") && message.content.split(" ")[0] == "/%"){

    var now = new Date();
    var heure = now.getHours()+2;
    var minute = now.getMinutes();

    var phrase = message.content.split(" ");
    if(phrase.length == 3){
      var debut = phrase[1];
      var fin = phrase[2];

    var depuisDeb = diff(debut);
    var jusquaFin = diff(fin);
    var journee = depuisDeb + jusquaFin;
    message.channel.send(((depuisDeb/journee)*100).toFixed(2) + "% du temps déjà passée");
    }
  }

  //Mail
  if(message.content.includes("/mail")){
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
            service: 'Gmail',
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


  //QUESTIONS TEXTUELLES

  //Go cs
  if (message.content.toUpperCase() === ("GO CS")){
    if(message.member.kickable == false){
      message.channel.send("L'admin veut lancer une partie de cs, tappez 'go CS' pour rejoindre. (1/5)");
    }
    else{
      message.author.send("wlh tg parle pas de cs");
      message.member.kick();
    }
  }

  //Demande de kick
  if (message.content.toUpperCase().includes("KICK MOI")){
    if(message.member.kickable == false){
      message.channel.send("Batard je peut pas te kick t'es admin.");
    }
    message.member.kick();
  }

  //Jme casse
  if(message.content.includes("je me casse")){
    var transports = leTransport();
    transports(function(err, previsions){
    	if(err) return console.log(err);
    	message.channel.send("Metros 6 pour CDG dans "+previsions.temps1+", "+previsions.temps2+", "+previsions.temps3+" et "+previsions.temps4);
    });
  }



  //DETECTEURS

  //Insulte detector
  for(var insulte in cancerJSON) {
    if(message.content.includes(insulte) && message.content != '' && typeof cancerJSON[insulte] != 'undefined'){
        message.channel.send(cancerJSON[insulte][Math.floor(Math.random() * cancerJSON[insulte].length)]);
    }
  }

  //FONCTIONS

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

  //pour le transport
  function leTransport(){
    var transports;
    return transports = function(callback){
      url = "https://api-ratp.pierre-grimaud.fr/v3/schedules/metros/6/dupleix/A";
    	request(url, function(err, response, body){
    		try{
    			var result = JSON.parse(body);
    			var previsions = {
      			temps1 : result.result.schedules[0].message,
    				temps2 : result.result.schedules[1].message,
    				temps3 : result.result.schedules[2].message,
    				temps4 : result.result.schedules[3].message,
    			};
    			callback(null, previsions);
    		}catch(e){
    			callback(e);
    		}
    	});
    };
  }

  //pour le trafic
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

  //pour le chien
  function leChien(type, code){
    var leChien;
    return leChien = function(callback){
      url = "http://thedogapi.co.uk/api/v1/dog?limit=1";
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

  //giphy
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

  //diff heure
  function diff(lheure){
    var now = new Date();
    var heure = now.getHours()+2;
    var minute = now.getMinutes();
    var heureCible = lheure.split(":");
    if (heureCible[0] > 23 || heureCible[1] > 59){
      message.channel.send("T'inventes des heures qui existent pas toi.");
    }
    else{
      var s = now.getMonth()+"-"+now.getDay()+"-"+now.getYear()+" "+heureCible[0]+":"+heureCible[1]+":00";
      var d = new Date(s);
      var diff = 0;
      var cibleMin = (d.getHours()*60 + d.getMinutes());
      var mtnMin = (heure*60 + minute);
      if(cibleMin > mtnMin){
        diff = cibleMin - mtnMin;
      }
      else{
        diff = mtnMin - cibleMin;
      }
      return diff;
    }
  }
});


/*//Suppression de message
bot.on('messageDelete', message => {
	message.channel.send('Ohlala pas bien ! '+message.author.username+' a supprimer son message !');
	message.member.setNickname("supprimeur");
});*/


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

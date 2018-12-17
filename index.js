const Discord = require('discord.js');
const bot = new Discord.Client();

const cmd = require ("./commands/index.js");
const detector = require ("./detectors/index.js");

const config = require('./config.json');
const token = config.token;
const prefix = config.prefix;

bot.on('ready', () => {
  console.log('bot ok!');
});

bot.on('messageDelete', message => {
	message.channel.send('Ohlala pas bien ! <@'+message.author.id+'> a supprimer son message **'+message.content+'** !');
  message.author.kickable ? message.member.setNickname("supprimeur") : null
});

bot.on("guildMemberAdd", member => {
  member.send("Salut moi c'est vag, tiens jte donne la liste des commandes c'est cadeau \n\n"+cmd.doc());
});

bot.on('message', message => {
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();  
    cmd(message,args,command);
  } else {    
    detector(message)
  }
});

bot.login(token);
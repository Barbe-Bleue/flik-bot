const insult = require ('./insults.json');
const mute =  require("../commands/admin/mute")
const ip = require ("./ip.js");

module.exports = message => {
  if(message.member && insult['insults'].filter(item => message.content.toLowerCase().includes(item)).length >= 1) {
    let kickable = message.member.kickable ? true : false
    let police = {
      police: ':oncoming_police_car: :rotating_light: POLICE DES GROS MOTS :rotating_light: :oncoming_police_car:',
      msg: kickable ? "Allez bisous maggle" : "Ohw c'est vous admin ? Excuser moi pour le dérangement",
      mutable: kickable
    }
    
    message.reply(police.police);
    message.reply(police.msg)
    
    if(police.mutable) { 
      ip(message);
      mute(message)
    }
  }
}

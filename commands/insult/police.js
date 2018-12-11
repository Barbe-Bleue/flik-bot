const insult = require ('./insults.json');

module.exports = message => {
  if(insult['insultes'].filter(item => message.content.includes(item)).length >= 1) {
    let police = ':oncoming_police_car: :rotating_light: POLICE DES GROS MOTS :rotating_light: :oncoming_police_car:';
    let kickable = message.member.kickable ? true : false
    let msg = kickable ? "T'es mort fdp" : "Ohw c'est vous admin ? Excuser moi pour le dérangement"
    return {
      police: police,
      msg: msg,
      mutable: kickable
    }
  }

}

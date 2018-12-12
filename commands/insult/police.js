const insult = require ('./insults.json');

module.exports = message => {
  if(!message.member.user.bot && insult['insultes'].filter(item => message.content.toLowerCase().includes(item)).length >= 1) {
    let kickable = message.member.kickable ? true : false
    return {
      police: ':oncoming_police_car: :rotating_light: POLICE DES GROS MOTS :rotating_light: :oncoming_police_car:',
      msg: kickable ? "pd va" : "Ohw c'est vous admin ? Excuser moi pour le dérangement",
      mutable: kickable
    }
  }

}

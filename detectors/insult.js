const cancer = require ('./cancer.json');

module.exports = message => {
  if(cancer[message.content]) {
    message.reply(cancer[message.content][Math.floor(Math.random() * cancer[message.content].length)]);
  }
}

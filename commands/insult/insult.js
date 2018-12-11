const cancer = require ('./cancer.json');

module.exports = message => {
  if(cancer[message]) {
    return cancer[message][Math.floor(Math.random() * cancer[message].length)];
  }
}

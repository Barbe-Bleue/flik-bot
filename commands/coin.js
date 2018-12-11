const axios = require("axios");
const CoinMarketCap = require("node-coinmarketcap"); // pour le btc
const options = {
  events: true, // Enable event system
  refresh: 60, // Refresh time in seconds (Default: 60)
  convert: "EUR" // Convert price to different currencies. (Default USD)
}
const coinmarketcap = new CoinMarketCap(options);

module.exports = async args => {
  if(args.length == 0){
    let coin = await coinmarketcap.get("bitcoin");
    return ":dollar: **"+coin.price_usd+" $** :dollar:"
  } else if(args.length > 0) {
    coinmarketcap.multi(coins => {
      let multiCoin = "";
      for (var i = 0; i < args.length; i++) {
        crypto = args[i].toUpperCase();
        let coin = coins.get(crypto)
        if(coin){
          multiCoin += crypto+" : "+coin.price_usd+" :dollar: \n";
        }else {
          multiCoin += crypto+ "Je ne connais pas la monnaie **"+crypto+"** désolé :confused: \n"
        }
      }
      return multiCoin
    });
  }
}

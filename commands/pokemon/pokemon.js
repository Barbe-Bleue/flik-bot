const axios =  require("axios");
const bot = require('../../config.json').bot
const emoji = require("./type.json");
const french = require("./fr.json");
const colors = require("./colors.json");
const awaitMessagesOptions = require("../../config.json").awaitMessagesOptions
const errorMessage = require("../../config.json").errorMessage

module.exports = async (message,args) => {
	
	if (args.length >= 1) {
		args.forEach(pokemon => {
			getPokemon(pokemon)
		});
	} else if (args.length == 0) {
		message.reply('Quel pokémon ?').then(() => {
			message.channel.awaitMessages(response => response.content.length > 0 ,awaitMessagesOptions)
			.then(collected => {
				collected.first().content.split(/ +/g).forEach(pokemon => {
					getPokemon(pokemon)
				});
			}).catch(() => {
				message.reply(errorMessage.waitingToMuch);
			});
		});
	}
	
	async function getPokemon(name) {
		let id = french.pokemons.indexOf(name.toLowerCase()) + 1
		let pokemon;
		await axios.get("https://pokeapi.co/api/v2/pokemon/"+id)
		.then(res => {
			pokemon = res.data;
		}).catch(() => {
			return message.reply("Je ne connais pas le pokemon **"+name+"**");
		});
		
		if(pokemon) {
			let infos = {
				"id": pokemon.id,
				"name": ":sparkles: **"+name.toUpperCase()+"** :sparkles:",
				"color": await getColor(pokemon.species.url),
				"image": pokemon.sprites.front_default,
				"type": getType(pokemon.types),
				"abilities": getAbilities(pokemon.abilities),
				"stats": getStats(pokemon.stats)
			}
	
			message.reply({embed : {
				title: infos.name,
				color: infos.color,
				fields: [
					{ name: "Type", value: infos.type, inline: true},
					{ name: "Compétences", value: infos.abilities, inline: true},
					{ name: "Statistiques", value: infos.stats, inline: true}
				],
				thumbnail: {
					url: infos.image
				}
			}})
			return;
		}
	}
	
	async function getColor(url) {
		let species = await axios.get(url);
		return colorNameToHex(species.data.color.name);
	}
	
	function getType(types) {
		let allTypes = "";
		types.forEach(res => {
			allTypes += french.types[res.type.name]+" "+emoji[res.type.name]+"\n";
		});
		return allTypes;
	}
	
	function getAbilities(abilities) {
		let allAbilities = "";
		abilities.forEach(res => {
			allAbilities += res.ability.name+"\n"
		})
		return allAbilities;
	}
	
	function getStats(stats) {
		let allStats = "";
		stats.forEach(res => {
			allStats+= "**"+french.stats[res.stat.name]+"**: "+res.base_stat+"\n"
		})
		return allStats;
	}
	
	function colorNameToHex(name) {
    return typeof colors[name] != 'undefined' ? colorHexToNumber(colors[name].toString()) : false
	}
	
	function colorHexToNumber(hex) {
		return parseInt(hex.replace('#',"0x"),16);
	}
}

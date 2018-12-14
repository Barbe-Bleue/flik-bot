# Vag BOT

## setup

Enter your token into the `config.json` file

## start
	
	npm install
	npm start
	
## add a command

- create a `.js` file, for exemple `foo.js` in the `commands` folder.

- add this code to `/commands/foo.js`
	
		module.exports = message => {
			message.reply("foo")
		}

- add the `foo` option into the `switch` function into `/commands/index.js`

		case "foo":
			cmd.foo(message);
			break;

Go to discord and type `!foo` and you should see the message `foo`
	
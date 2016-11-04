global.toTitleCase = function(str){return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});}

global.replaceAll = function(find, replace, str) {return str.replace(new RegExp(find, 'g'), replace);}

global.WordCount = function(str) { return str.split(" ").length;}
global.nthWord = function(str, n) {var m = str.match(new RegExp('^(?:\\w+\\W+){' + --n + '}(\\w+)')); return m && m[1];};

global.isBotAdmin = function(nick, r, arg) {
	client.whois(nick, function isBotAdminWhoIs(text) {
		var isTheAdmin = false;
		for (i = 0, len = config.globaladminHosts.length; i < len; i++) {
			if (text.user+"@"+text.host == config.globaladminHosts[i]) {
				var isTheAdmin = true;
			}
		}
		if (isTheAdmin) {
			if (r == "help") {
				client.say(nick, " ");
				client.say(nick, "-=-=-=-=-ADMIN COMMANDS-=-=-=-=-");
				client.say(nick, config.globalCommandPrefix+"stop - Disconnects bot from server and stops Node.js process.");
				client.say(nick, config.globalCommandPrefix+"join - Has bot join channel, this option will not stay set after the bot is exited.");
				client.say(nick, config.globalCommandPrefix+"part - Has bot part channel, this option will not stay set after the bot is exited.");
			} else if (r == "stop") {
				console.log(nick.cyan + " used PM command of \"shutdown\"".cyan);
				console.log("Shutdown process begining...".red);
				client.say(nick, "Stopping...");
				client.disconnect("Shutdown: "+nick);
				console.log("Disconnected from server".red);
				console.log("Done");
				process.exit();
			} else if (r == "join") {
				if (WordCount(arg) == 2) {
					client.join(arg.split(" ")[1], function botJoinCmd(text) {});
					client.say(nick, "Joining "+arg.split(" ")[1]+"...");
				} else {
					client.say(nick, "Invalid number of arguments. Make sure to add the channel name after the "+config.globalCommandPrefix+"join");
				}
			} else if (r == "part") {
				if (WordCount(arg) == 2) {
					client.part(arg.split(" ")[1], function botJoinCmd(text) {});
					client.say(nick, "Parting "+arg.split(" ")[1]+"...");
				} else {
					client.say(nick, "Invalid number of arguments. Make sure to add the channel name after the "+config.globalCommandPrefix+"join");
				}
			}
		} else {
			if (r == "stop" || r == "join") {
				client.say(nick, "You do not have access to this command.");
				console.log(nick.yellow + " tried to use PM command of \""+r.toUpperCase()+"\" - ACCESS DENIED".yellow);
			}
		}
	});
}
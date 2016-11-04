var os = require('os');
var fs = require('fs');

global.callbackInfo = function(nick, text) {
	client.whois(client.nick, function callbackInfo2(text) {
		client.say(nick, "Current Host: "+text.nick+"!"+text.user+"@"+text.host);
		client.say(nick, "Connected To: "+text.serverinfo+" ("+text.server+") | Idle Time: "+text.idle);
		fs.readFile('./package.json', 'utf8', function (err,data) {
			if (err) {
				console.log("Error opening package.json file: ".red + err.red);
			}
			var textile = JSON.parse(data);
			client.say(nick, "Host OS: " + os.type() + " (" + os.platform() + ") v" + os.release() + " | Uptime: " + os.uptime() + " seconds.");
			client.say(nick, "Running "+textile.name+ " v"+textile.version+ " | Git: "+textile.repository.url+" | Process Uptime: "+process.uptime()+" seconds.");
		});
	});
}
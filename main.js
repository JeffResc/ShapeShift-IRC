#!/usr/bin/env node

global.config = require("./config.js").settings;
global.colors = require('colors');
var fs = require('fs');
var irc = require('irc');
global.https = require('https');

//Check for updates before going any further
https.get('https://raw.githubusercontent.com/Apexton/ShapeShift-IRC/master/package.json', function (res) {
		if (res.statusCode == 200) {
			var body = '';
            res.on('data', function(chunk) { body += chunk; });
            res.on('end', function() {
				fs.readFile('./package.json', 'utf-8', function (err, data) {
					if (err) {
						console.error(err);
						process.exit();
					} else if (JSON.parse(data).version < JSON.parse(body).version) {
						console.log("[UPDATER] You're running an old version of the bot. For possible security purposes and for new features, we recommend you update.".magenta);
						console.log("[UPDATER]".magenta+" https://github.com/Apexton/ShapeShift-IRC");
						console.log(" ");
					} else {
						console.log("[UPDATER] You are currently up to date.".magenta);
					}
				});
			});
		} else {
			client.say(nick, "Error checking for update -- HTTP Error: ".red+res.statusCode.red);
			client.say(nick, "We'll just skip the update".yellow);
		}
	  });

global.client = new irc.Client(config.globalNetHostname, config.globalNickname, {
  userName: config.globalUsername,
  realName: config.globalRealrname,
  port: config.globalNetPort,
  secure: config.globalNetSecure,
  localAddress: config.globalNetAddr,
  channels: config.globalChannelList,
  autoRejoin: config.globalAutoRejoin,
  selfSigned: true,
  certExpired: true,
  floodProtection: false,
  floodProtectionDelay: 1000
});

require('./includes/listeners.js');
require('./includes/functions.js');
require('./includes/cmd_help.js');
require('./includes/cmd_info.js');
require('./includes/cmd_marketinfo.js');
require('./includes/cmd_orderstatus.js');
require('./includes/cmd_shift.js');
require('./includes/cmd_validpairs.js');
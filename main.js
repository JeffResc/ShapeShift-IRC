#!/usr/bin/env node

var config = require("./config.js").settings;
var fs = require('fs');
var irc = require('irc');
var colors = require('colors');
var request = require('request');
var os = require('os');

var client = new irc.Client(config.globalNetHostname, config.globalNickname, {
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

client.addListener('registered', function (msg) {
  if (config.globalNetSecure === true) {
    console.log("Successfully connected to ".green + config.globalNetHostname.green + " +".green + config.globalNetPort.toString().green);
  } else {
    console.log("Successfully connected to ".green + config.globalNetHostname.green + " " + config.globalNetPort.toString().green);
  }
});

client.addListener('motd', function (motd) {
  client.say(config.globalNickServNick, config.globalNickServMsg);
  console.log("Sent authentication message to ".yellow + config.globalNickServNick.yellow);
});

client.addListener('join', function (chan, nick, msg) {
  if (nick == client.nick) {
    console.log("Bot Joined ".green + chan.green);
  }
});

client.addListener('part', function (chan, nick, r, msg) {
  if (nick == client.nick) {
    console.log("Bot Parted ".yellow + chan.yellow);
  }
});

client.addListener('kick', function (chan, nick, by, reason, msg) {
  if (nick == client.nick) {
    console.log("Bot was kicked from ".red + chan.red + " by ".red + by.red);
  }
});

client.addListener('pm', function (nick, text, msg) {
  if (text.toUpperCase().replace(config.globalCommandPrefix, '') == "HELP") {
    callbackHelp(nick, "MAIN");
    console.log(nick.cyan + " used PM command of \"help\"".cyan);
  } else if (text.indexOf(" ") != -1 && text.split(" ")[0].toUpperCase().replace(config.globalCommandPrefix, '') == "HELP") {
    callbackHelp(nick, text.split(" ")[1].toUpperCase());
    console.log(nick.cyan + " used PM command of \"".cyan+text.replace(config.globalCommandPrefix, '').cyan+"\"");
  } else if (text.toUpperCase().replace(config.globalCommandPrefix, '') == "VALIDPAIRS" || text.indexOf(" ") != -1 && text.split(" ")[0].toUpperCase().replace(config.globalCommandPrefix, '') == "VALIDPAIRS") {
    callbackValidPairs(nick);
    console.log(nick.cyan + " used PM command of \"validpairs\"".cyan);
  } else if (text.toUpperCase().replace(config.globalCommandPrefix, '') == "MARKETINFO" || text.indexOf(" ") != -1 && text.split(" ")[0].toUpperCase().replace(config.globalCommandPrefix, '') == "MARKETINFO") {
    callbackMarketInfo(nick, text);
    console.log(nick.cyan + " used PM command of \"marketinfo\"".cyan);
  } else if (text.toUpperCase().replace(config.globalCommandPrefix, '') == "INFO" || text.indexOf(" ") != -1 && text.split(" ")[0].toUpperCase().replace(config.globalCommandPrefix, '') == "INFO") {
    callbackInfo(nick, text);
    console.log(nick.cyan + " used PM command of \"info\"".cyan);
  } else if (text.toUpperCase().replace(config.globalCommandPrefix, '') == "SHIFT" || text.indexOf(" ") != -1 && text.split(" ")[0].toUpperCase().replace(config.globalCommandPrefix, '') == "SHIFT") {
    callbackShift(nick, text);
    console.log(nick.cyan + " used PM command of \"shift\"".cyan);
  } else if (text.toUpperCase().replace(config.globalCommandPrefix, '') == "ORDERSTATUS" || text.indexOf(" ") != -1 && text.split(" ")[0].toUpperCase().replace(config.globalCommandPrefix, '') == "ORDERSTATUS") {
    callbackOrderStatus(nick, text);
    console.log(nick.cyan + " used PM command of \"orderstatus\"".cyan);
  } else if (text.toUpperCase().replace(config.globalCommandPrefix, '') == "STOP" || text.indexOf(" ") != -1 && text.split(" ")[0].toUpperCase().replace(config.globalCommandPrefix, '') == "STOP") {
	isBotAdmin(nick, "stop");
  } else if (text.toUpperCase().replace(config.globalCommandPrefix, '') == "JOIN" || text.indexOf(" ") != -1 && text.split(" ")[0].toUpperCase().replace(config.globalCommandPrefix, '') == "JOIN") {
	isBotAdmin(nick, "join", text);
  } else if (text.toUpperCase().replace(config.globalCommandPrefix, '') == "PART" || text.indexOf(" ") != -1 && text.split(" ")[0].toUpperCase().replace(config.globalCommandPrefix, '') == "PART") {
	isBotAdmin(nick, "part", text);
  } else {
	client.say(nick, "Sorry, that doesn't seem to be a valid command. Message me \"" + config.globalCommandPrefix + "help\" to see all the commands I support")
  }
});

client.addListener('message#', function (nick, chan, text, msg) {
  if (text == config.globalCommandPrefix+"help") {
    callbackHelp(chan, "MAIN");
    console.log(chan.cyan + " used channel command of \"".cyan+text.cyan+"\"".cyan);
  } else if (text.indexOf(" ") != -1 && text.split(" ")[0] == config.globalCommandPrefix+"help") {
    callbackHelp(chan, text.split(" ")[1].toUpperCase());
    console.log(chan.cyan + " used channel command of \"".cyan+text.cyan+"\"");
  }
});

function callbackHelp(nick, info) {
  if (info == "MAIN" && nick.indexOf("#") == -1) {
    client.say(nick, "Hey "+nick+", I'm ShapeShift, the crypto-currency converter! I have the following commands:");
    client.say(nick, " ");
    client.say(nick, config.globalCommandPrefix+"validpairs - Displays all the currency pairs that I support.");
    client.say(nick, config.globalCommandPrefix+"marketinfo <From> <To> - Using the given currency pair, will display rates, transaction fees, etc.");
    client.say(nick, config.globalCommandPrefix+"shift <Send-To-Address (To Coin)> <From> <To> [Return Address (From Coin)] - Using the given currency pair, creates an address to send \"from\" coins to. Converts the from coins to \"to\" coins.");
	client.say(nick, config.globalCommandPrefix+"orderstatus <txID> - Shows the status of a \""+config.globalCommandPrefix+"shift\" transaction. The \""+config.globalCommandPrefix+"shift\" command will give you the txID to use this command.");
    client.say(nick, config.globalCommandPrefix+"info - Shows bot (debug) information.");
    client.say(nick, " ");
	isBotAdmin(nick, "help");
    client.say(nick, "If you need more help, you may use message me \"help <command>\", contact my owner, "+config.globalOwnerNick+", or read the documents/source at https://github.com/AlphaT3ch/ShapeShift-IRC");
  } else if (info == "MAIN" && nick.indexOf("#") != -1) {
    client.say(nick, "Hey "+nick+", I'm ShapeShift, the crypto-currency converter! To view my commands, type /msg "+client.nick+" help");
  } else if (info.replace(config.globalCommandPrefix, '') == "VALIDPAIRS") {
    client.say(nick, config.globalCommandPrefix+"validpairs - Displays all the currency pairs that I support.");
    client.say(nick, "Example: "+config.globalCommandPrefix+"validpairs");
  } else if (info.replace(config.globalCommandPrefix, '') == "MARKETINFO") {
    client.say(nick, config.globalCommandPrefix+"marketinfo <From> <To> - Using the given currency pair, will display rates, transaction fees, etc.");
    client.say(nick, "Example: "+config.globalCommandPrefix+"marketinfo btc doge");
  } else if (info.replace(config.globalCommandPrefix, '') == "SHIFT") {
    client.say(nick, config.globalCommandPrefix+"shift <Send-To-Address (To Coin)> <From> <To> [Return Address (From Coin)] - Using the given currency pair, creates an address to send \"from\" coins to. Converts the from coins to \"to\" coins.");
    client.say(nick, "Example: "+config.globalCommandPrefix+"shift MyBitcoinAddress BTC DOGE MyDogecoinAddress");
  } else if (info.replace(config.globalCommandPrefix, '') == "INFO") {
    client.say(nick, config.globalCommandPrefix+"info - Shows bot (debug) information.");
    client.say(nick, "Example: "+config.globalCommandPrefix+"info");
  } else if (info.replace(config.globalCommandPrefix, '') == "ORDERSTATUS") {
	client.say(nick, config.globalCommandPrefix+"orderstatus <txID> - Shows the status of a \""+config.globalCommandPrefix+"shift\" transaction. The \""+config.globalCommandPrefix+"shift\" command will give you the txID to use this command.");
	client.say(nick, "Example: "+config.globalCommandPrefix+"orderstatus 89346");
  } else {
    client.say(nick, "No help found for "+toTitleCase(info.replace(config.globalCommandPrefix, '')));
    client.say(nick, "If you need more help, you may use message me \"help <command>\", contact my owner, "+config.globalOwnerNick+", or read the documents/source at https://github.com/AlphaT3ch/ShapeShift-IRC");
  }
}

function toTitleCase(str){return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});}

function callbackValidPairs(nick) {
  request('https://shapeshift.io/getcoins', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body);
      var validPairs = Object.keys(obj).map(function(k) { return obj[k]; });
      var outputPairs = new Array([]);
      validPairs.forEach(function(coin) {
        if (coin['symbol'] != "NXT" || coin['symbol'] != "XRP") {
		  outputPairs.push(coin['symbol']+" ("+coin['name']+")");
		}
      });
      client.say(nick, replaceAll(',', '; ', outputPairs.join()));
    } else {
      client.say(nick, "Error fetching valid pairs.");
    }
  });
}

function callbackMarketInfo(nick, text) {
  if (WordCount(text) == 3) {
	  newText = text.split(" ");
	  request('https://shapeshift.io/marketinfo/'+newText[1]+'_'+newText[2], function (error, response, body) {
		if (!error && response.statusCode == 200) {
		  var obj = JSON.parse(body);
		  client.say(nick, "Market & Trade Info For "+newText[1].toUpperCase()+" and "+newText[2].toUpperCase()+":");
		  client.say(nick, "Rate: "+obj.rate+" | Miner Fee: "+obj.minerFee)
		  client.say(nick, "Minimum: "+obj.minimum+" | Maximum Limit: "+obj.maxLimit+" | Limit: "+obj.limit);
		} else {
		  client.say(nick, "Error fetching market info.");
		}
	  });
  } else {
	client.say(nick, "Wrong number of arguments. Try messaging me \""+config.globalCommandPrefix+"help marketinfo\" if you still need help");
  }
}

function callbackInfo(nick, text) {
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

function callbackShift(nick, text) {
	if (WordCount(text) == 4 || WordCount(text) == 5) {
		if (WordCount(text) == 4) {
			callURL = {form:{withdrawl :'value'}};
		} else {
			callURL = {form:{key:'value'}};
		}
	} else {
		client.say(nick, "Wrong number of arguments. Try messaging me \""+config.globalCommandPrefix+"help shift\" if you still need help");
	}
}

function callbackOrderStatus(nick, text) {
}

function isBotAdmin(nick, r, arg) {
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

function replaceAll(find, replace, str) {return str.replace(new RegExp(find, 'g'), replace);}
function WordCount(str) { return str.split(" ").length;}
var nthWord = function(str, n) {var m = str.match(new RegExp('^(?:\\w+\\W+){' + --n + '}(\\w+)')); return m && m[1];};
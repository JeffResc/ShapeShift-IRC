#!/usr/bin/env node

var config = require("./config.js").settings;
var irc = require('irc');
var colors = require('colors');
var request = require('request');

var client = new irc.Client(config.globalNetHostname, config.globalNickname, {
  userName: config.globalUsername,
  realName: config.globalRealrname,
  port: config.globalNetPort,
  secure: config.globalNetSecure,
  sasl: config.globalSasl,
  localAddress: config.globalNetAddr,
  channels: config.globalChannelList,
  autoRejoin: config.globalAutoRejoin,
  selfSigned: true,
  certExpired: true,
  floodProtection: true,
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
    console.log("Bot Successfully Joined ".green + chan.green);
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
    client.say(nick, config.globalCommandPrefix+"channels - Shows a list of channels I am currently in.");
    client.say(nick, config.globalCommandPrefix+"info - Shows bot info.");
    client.say(nick, " ");
    client.say(nick, "If you need more help, you may use message me \"help <command>\", contact my owner, "+config.globalOwnerNick+", or read the documents/source at https://github.com/Apexton/ShapeShift-IRC");
    client.say(nick, "NOTE: By using this bot, which includes, but is not limited to: using any of it's features, making transactions and checking rates, that the owner nor any of the bots developers are held reliable for anything that may go wrong during the transaction.");
    client.say(nick, "NOTE: Though it is very unlikely, a mishap may occur, and will be attempted to be fixed immediately upon notice by a developer.");
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
  } else if (info.replace(config.globalCommandPrefix, '') == "CHANNELS") {
    client.say(nick, config.globalCommandPrefix+"channels - Shows a list of channels I am currently in.");
    client.say(nick, "Example: "+config.globalCommandPrefix+"channels");
  } else if (info.replace(config.globalCommandPrefix, '') == "CHANNELS") {
    client.say(nick, config.globalCommandPrefix+"info - Shows bot info.");
    client.say(nick, "Example: "+config.globalCommandPrefix+"info");
  } else {
    client.say(nick, "No help found for "+toTitleCase(info.replace(config.globalCommandPrefix, '')));
    client.say(nick, "If you need more help, you may use message me \"help <command>\", contact my owner, "+config.globalOwnerNick+", or read the documents/source at https://github.com/Apexton/ShapeShift-IRC");
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

function replaceAll(find, replace, str) {return str.replace(new RegExp(find, 'g'), replace);}

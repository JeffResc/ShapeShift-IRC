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
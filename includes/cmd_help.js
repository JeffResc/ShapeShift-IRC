global.callbackHelp = function(nick, info) {
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
    client.say(nick, "Example: "+config.globalCommandPrefix+"shift MyDogecoinAddress BTC DOGE MyBitcoinAddress");
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
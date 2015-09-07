#!/usr/bin/env node

var config = require("./config.js").settings;
var irc = require('irc');
var colors = require('colors');

var client = new irc.Client(settings.globalNetHostname, settings.globalNickname, {
  userName: config.globalUsername,
  realName config.globalRealrname,
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
  console.log("Successfully connected to "+config.globalNetHostname+":"+config.globalNetPort.green):
});

client.addListener('motd', function (motd) {
  client.say(config.globalNickServNick, config.globalNickServMsg);
  console.log("Sent authentication message to "+config.globalNickServNick.blue);
});

client.addListener('join', function (chan, nick, msg) {
  if (config.globalNickname == client.nick) {
    console.log("Bot Successfully Joined "+chan.green);
  }
});

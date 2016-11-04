#!/usr/bin/env node

global.config = require("./config.js").settings;
global.colors = require('colors');
var fs = require('fs');
var irc = require('irc');
global.https = require('https');

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
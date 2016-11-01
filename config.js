exports.settings = {
	
	// DO NOT CHANGE LINE NUMBER ARRANGEMENTS. DOING SO WILL BREAK CONFIGURATION.
	
	// Nickname of your bot
	globalNickname: "ShapeShift",
	// Username of your bot
	globalUsername: "ShapeShift",
	// Realname of your bot
	globalRealname: "ShapeShift Crypto-Currency Converter",
	// Command prefix for your bot
	globalCommandPrefix: "!",
	// Nickname Service's Nick. Usally NickServ
	globalNickServNick: "NickServ",
	// Identification message to send to NickServ
	globalNickServMsg: "IDENTIFY ShapeShift Password",
	// Hostname or IP of the IRC Server
	globalNetHostname: "irc.caffie.net",
	// Port of The IRC Server (Highly reccomended to use 6697 (SSL) on networks that support it)
	globalNetPort: 6697,
	// Use SSL? (Highly reccomended) (set as either true or false with no quotes)
	globalNetSecure: true,
	// An array of channels to join
	globalChannelList: ['#devtest'],
	// Nickname of Bot owner in case of help
	globalOwnerNick: "JeffBaker",
	// List of FULL HOSTNAMES that are allowed to manage the bot - DO NOT INCLUDE NICKNAME - NO WILDCARDS
	globaladminHosts: ['JeffBaker@caffie-97483D9C.twcny.res.rr.com'],
	// Try to auto rejoin channels?
	globalAutoRejoin: true,
	
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// ADVANCED SETTINGS - Only change these if you're either having problems or are an advanced user //
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Bind address if you have multiple IP addresses (Leave null if you are not sure, or only have one IP)
	globalNetAddr: null,
}

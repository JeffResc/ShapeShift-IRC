global.callbackOrderStatus = function(nick, text) {
	if (WordCount(text) == 2) {
		newText = text.split(" ");
		https.get('https://shapeshift.io/txStat/'+newText[1], function (res) {
			if (res.statusCode == 200) {
				var body = '';
				res.on('data', function(chunk) { body += chunk; });
				res.on('end', function() {
					var obj = JSON.parse(body);
					if (obj['status'] == "no_deposits") {
						client.say(nick, "It looks like your transaction hasn't made it to ShapeShift yet. Wait a few moments and rerun this command, it should be there soon.");
					} else if (obj['status'] == "received") {
						client.say(nick, "Looks like we've found your order, it's been received. It's processing as we speak and should be in your wallet in no time");
					} else if (obj['status'] == "complete") {
						client.say(nick, "Looks like your order has been fully completed. Here's the information we have on your order.");
						client.say(nick, " ");
						client.say(nick, "Recived "+obj['incomingCoin']+" "+obj['incomingType']+" and converted it to "+obj['outgoingCoin']+" "+obj['outgoingType']);
						client.say(nick, obj['withdraw']+" -> "+obj['address']);
						client.say(nick, "If you're having troubles with your transaction, visit ShapeShift Support with the Transaction ID \""+obj['transaction']+"\". (https://shapeshift.zendesk.com/hc/en-us/requests/new)");
					} else if (obj['status'] == "failed") {
						client.say(nick, "Uh-oh. Looks like there was an error with your transaction. Here's the details I was provided with:");
						client.say(nick, obj['error']);
					}
				});
			} else {
				client.say(nick, "Error fetching order status. (HTTP Error: "+res.statusCode+")");
				console.log("ERROR: While fetching order status for ".red+nick.red+". (HTTP Error: ".red+res.statusCode.red+")".red);
			}
		});
	} else {
		client.say(nick, "Wrong number of arguments. Try messaging me \""+config.globalCommandPrefix+"help orderstatus\" if you still need help");
	}
};
global.callbackShift = function(nick, text) {
	if (WordCount(text) == 4 || WordCount(text) == 5) {
		splitText = text.split(" ");
		var options = {hostname: 'shapeshift.io', port: 443, path: '/shift', method: 'POST', headers: {'Content-Type': 'application/json'}};
		var req = https.request(options, function(res) {
			res.setEncoding('utf8');
				res.on('data', function (body) {
					returned = JSON.parse(body);
					if ( typeof returned['error'] !== 'undefined' && returned['error'] ) {
						if (returned['error'] == "Warning: Return address appears to be invalid for the deposit coin type.") {
							client.say(nick, "ERROR: Invalid deposit coin address. Are you sure this is a "+splitText[2]+" address?");
						} else {
							client.say(nick, "Error from API: " + returned['error']);
							console.log("ERROR (From ShapeShift API): ".red+returned['error'].red);
						}
					} else {
						client.say(nick, "Success! Deposit your "+returned['depositType']+" to "+returned['deposit']);
						client.say(nick, " ");
						client.say(nick, "Here's a friendly reminder of the Market Info:");
						callbackMarketInfo(nick, "marketinfo "+returned['depositType']+" "+returned['withdrawalType']);
					}
				});
		});
		if (WordCount(text) == 4) {
			callURL = {
				"withdrawal": splitText[1],
				"pair": splitText[2]+"_"+splitText[3]
			}
		} else {
			callURL = {
				"withdrawal": splitText[1],
				"pair": splitText[2]+"_"+splitText[3],
				"returnAddress": splitText[4]
			}
		}
		req.write(JSON.stringify(callURL));
		req.on('error', function(e) {
			console.log("ERROR (While retrieving webpage): ".red+e.message.red);
			client.say(nick, "I'm not really sure what happened right there. You provided enough arguments, but the server gave me this an error. Please verify that the information you inputed is valid. The error reads as followed:");
			client.say(nick, e.message);
		});
		req.end();
	} else {
		client.say(nick, "Wrong number of arguments. Try messaging me \""+config.globalCommandPrefix+"help shift\" if you still need help");
	}
}
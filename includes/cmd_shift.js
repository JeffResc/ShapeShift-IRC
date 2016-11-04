global.callbackShift = function(nick, text) {
	if (WordCount(text) == 4 || WordCount(text) == 5) {
		splitText = text.split(" ");
		var options = {hostname: 'shapeshift.io', port: 443, path: '/shift', method: 'POST', headers: {'Content-Type': 'application/json'}};
		var req = https.request(options, function(res) {
			res.setEncoding('utf8');
				res.on('data', function (body) {
					console.log('Body: ' + body);
				});
		});
		if (WordCount(text) == 4) {
			callURL = "{\"withdrawl\":\""+splitText[1]+"\", \"pair:\""+splitText[2]+"_"+splitText[3]+"\"}";
		} else {
			callURL = "{\"withdrawl\":\""+splitText[1]+"\", \"pair:\""+splitText[2]+"_"+splitText[3]+"\", \"returnAddress\":\""+splitText[4]+"\"}";
		}
		req.write(callURL);
		req.on('error', function(e) {
			console.log("ERROR: "+e.message);
			client.say(nick, "I'm not really sure what happened right there. You provided enough arguments, but the server gave me this an error. Please verify that the information you inputed is valid. The error reads as followed:");
			client.say(nick, e.message);
		});
		req.end();
	} else {
		client.say(nick, "Wrong number of arguments. Try messaging me \""+config.globalCommandPrefix+"help shift\" if you still need help");
	}
}
global.callbackMarketInfo = function(nick, text) {
  if (WordCount(text) == 3) {
	  newText = text.split(" ");
	  https.get('https://shapeshift.io/marketinfo/'+newText[1]+'_'+newText[2], function (res) {
		if (res.statusCode == 200) {
			var body = '';
            res.on('data', function(chunk) { body += chunk; });
            res.on('end', function() {
				var obj = JSON.parse(body);
				client.say(nick, "Market & Trade Info For "+newText[1].toUpperCase()+" and "+newText[2].toUpperCase()+":");
				client.say(nick, "Rate: "+obj.rate+" | Miner Fee: "+obj.minerFee)
				client.say(nick, "Minimum: "+obj.minimum+" | Maximum Limit: "+obj.maxLimit+" | Limit: "+obj.limit);
			});
		} else {
			client.say(nick, "Error fetching market info. (HTTP Error: "+res.statusCode+")");
		}
	  });
  } else {
	client.say(nick, "Wrong number of arguments. Try messaging me \""+config.globalCommandPrefix+"help marketinfo\" if you still need help");
  }
}
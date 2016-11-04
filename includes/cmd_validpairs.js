global.callbackValidPairs = function(nick) {
  https.get('https://shapeshift.io/getcoins', function (res) {
    if (res.statusCode == 200) {
		var body = '';
		res.on('data', function(chunk) { body += chunk; });
        res.on('end', function() {
			var obj = JSON.parse(body);
			var validPairs = Object.keys(obj).map(function(k) { return obj[k]; });
			var outputPairs = new Array([]);
			validPairs.forEach(function(coin) {
				if (coin['symbol'] != "NXT" || coin['symbol'] != "XRP" || coin['symbol'] != "XMR" || coin['symbol'] != "STEEM" || coin['symbol'] != "BTS" || coin['symbol'] != "BITUSD") {
					outputPairs.push(coin['symbol']+" ("+coin['name']+")");
				}
			});
			client.say(nick, replaceAll(",", ", ", outputPairs.join().substring(1)));
		});
    } else {
      client.say(nick, "Error fetching valid info. (HTTP Error: "+res.statusCode+")");
	  console.log("Error fetching valid info. (HTTP Error: ".red+res.statusCode.red+")".red);
    }
  });
}
var url = require("url"),
	path = require("path"),  
	spawn = require("child_process").spawn,
	config = require('./config'),
	fs = require("fs"),
	apiCalls = require('./apiCalls'),
	app = require('http').createServer(handler),
	util = require('./util'),
  	io = require('socket.io').listen(app);

app.listen(config.port);

var countries = [],
	trendsList = [],
	countryEmotion = [];

function handler (req, res) 
{
	var uri = url.parse(req.url).pathname;  
	console.log("Requested uri: " + uri);

	switch(uri)
	{
		case '/stream':
			apiCalls.stream(res);
			break;


		default:
			if ( uri == '/' ) uri = '/index.html';
			var filename = path.normalize( path.join(process.cwd(), uri) ); 
			console.log(filename);

			if (filename.indexOf(__dirname) == 0 ) {
				fs.exists(filename, function(exists) {
					if(!exists) {  
						res.writeHead(404, {"Content-Type": "text/plain"});  
						res.write("404 Not Found\n");  
						res.end();  
						return;  
					}  

					fs.readFile(filename, "binary", function(err, file) {
						if(err) {
							res.writeHead(500, {"Content-Type": "text/plain"});
							res.write(err + "\n");
							res.end();
							return;
						}

						res.writeHead(200);
						res.write(file, "binary");
						res.end();
					});
				});

			} else {
				console.log("invalid path: " + filename);
				res.writeHead(404, {"Content-Type": "text/plain"});  
				res.write("404 Not Found\n");  
				res.end();  
				return;  
			}
	}

}

console.log('Server running at http://'+config.address+':'+config.port+'/');


/*apiCalls.getAvailableCountries(countries, function() {
	apiCalls.fetchTrends(countries, io, trendsList);
});

apiCalls.stream( function(data) {
	//console.log("Tweet Stream: " + data.text + "\n");
	if(data.place) {
		if(!countryEmotion.hasOwnProperty(data.place.country_code))
			countryEmotion[data.place.country_code] = {
				'positive': 0,
				'negative': 0,
				'neutral': 0
			};
		if((m = util.moodAnalyze(data.text))==1)
			countryEmotion[data.place.country_code]['positive'] += 1;
		else if(m==-1)
			countryEmotion[data.place.country_code]['negative'] += 1;
		else countryEmotion[data.place.country_code]['neutral'] += 1;
		//console.log(countryEmotion);
	}
});

setInterval( function() {
	var arr = [];
	for(var key in countryEmotion)
	{
		if (key === 'length' || !countryEmotion.hasOwnProperty(key)) continue;
		var score = (countryEmotion[key]['positive']*100.0)/(countryEmotion[key]['positive']+countryEmotion[key]['negative']+countryEmotion[key]['neutral']);
		var abcd={Country: key, Score: score};
		arr.push(JSON.stringify(abcd));
	}
	io.sockets.emit('emotionUpdate', JSON.stringify(arr));
}, 3000);
*/

io.sockets.on('connection', function (socket) {
	socket.emit('init', trendsList);
	socket.on('reqStream', function(data) {
		apiCalls.createStream(data.credentials, data.filter, socket);
	});	
});

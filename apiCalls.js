var jsonline = require('json-line-protocol').JsonLineProtocol,
	config 	= require('./config'),
	https = require('https'),
	http = require('http');

function stream(res) {
	var jsonTwitter = new jsonline();
		var username = config.twitter_username,
				password = config.twitter_password;
		var options = {
			host: 'stream.twitter.com',
			port: 443,
			path: '/1/statuses/filter.json?locations=-180,-90,180,90',
			headers: {
				'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
			}
		};

		res.writeHead(200, {'Content-Type': 'text/event-stream'});
		https.get(options, function(resp){
			resp.on('data', function(chunk){
				jsonTwitter.feed(chunk);
			});
		}).on("error", function(e){
			console.log("Got error: " + e.message);
			console.log("Got error: " + e);
		});

		jsonTwitter.on('value', function (value) {
			res.write("event: twitter\n");
			res.write("data: "+JSON.stringify(value)+"\n\n");
		});
}

function getAvailableCountries(countries, callback) {
	
	console.log("Fetching country list");
	var options = {
		host: 'api.twitter.com',
		path: '/1/trends/available.json'
	};

	http.get(options, function(resp){
		var data = '';
		resp.on('data', function(chunk){
			data += chunk;
		});
		resp.on('end', function() {
			var regions = JSON.parse(data);
			for(r=0;r<regions.length;r++)
			{
				if(regions[r].placeType.name == 'Country')
				//res.write(regions[r].country +'\n')
				countries.push({
					'name': regions[r].name,
					'woeid': regions[r].woeid,
					'code': regions[r].countryCode
				});
			}
			console.log("COMPLETED: Fetching countries")
			callback();
		});
	}).on("error", function(e){
		console.log("Got error while fetching countries: " + e);
	}).end();
}

function fetchTrends(countries, io, trendsList)
{
	for(i=0; i<1; i++)
	{
		//console.log("Fetching Trends of Country: "+ countries[i].name);
		var options = {
			host: 'api.twitter.com',
			path: '/1/trends/' + countries[i].woeid +'.json'
		};

		https.get(options, function(resp){
			var data = '';
			resp.on('data', function(chunk){
				data += chunk;
			});
			resp.on('end', function() {
				var response = JSON.parse(data);
				console.log(response);
				trendsList[response[0].locations[0].woeid] = response[0];
				io.sockets.emit('trendUpdate', response[0]);
			});
		})
		.on("error", function(e){
			console.log("Got error while fetching Trends of Country ("+ countries[i].woeid +"): "+ e.message);
			console.log("Got error while fetching Trends of Country ("+ countries[i].woeid +"): "+ e);
		})
		.end();
	}
}

exports.getAvailableCountries = getAvailableCountries;
exports.stream = stream;

exports.fetchTrends = fetchTrends;
var jsonline = require('json-line-protocol').JsonLineProtocol,
	config 	= require('./config'),
	https = require('https'),
	util = require('./util'),
	http = require('http');

function createStream(credentials, filter, socket) {

	var jsonTwitter = new jsonline();
	var 	username = credentials.user,
	password = credentials.pass;
	
	
	var options = {
		host: 'stream.twitter.com',
		path: '/1/statuses/filter.json?' + filter,
		headers: {
			'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
		}
	};

	https.get(options, function(resp){
		resp.on('data', function(chunk){
			jsonTwitter.feed(chunk);
		});
	}).on("error", function(e){
		console.log("Got error: " + e.message);
		console.log("Got error: " + e);
	});

	jsonTwitter.on('value', function (value) {
		socket.emit('tweet', value);
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
				countries.push({
					'name': regions[r].name,
					'woeid': regions[r].woeid,
					'code': regions[r].countryCode
				});
			}
			if(regions.error)
				console.log(data);
			console.log("COMPLETED: Fetching countries")
			callback();
		});
	}).on("error", function(e){
		console.log("Got error while fetching countries: " + e);
	}).end();
}

function fetchTrends(countries, io, trendsList){
	for(i=0; i<countries.length; i++)
	{
		console.log("Fetching Trends of Country: "+ countries[i].name);
		var options = {
			host: 'api.twitter.com',
			path: '/1/trends/' + countries[i].woeid +'.json?lang=en'
		};

		https.get(options, function(resp){
			var data = '';
			resp.on('data', function(chunk){
				data += chunk;
			});
			resp.on('end', function() {
				var response = JSON.parse(data);
				util.merge(trendsList, response[0]);
				io.sockets.emit('trendUpdate', response[0]);
				console.log("Fetched Country: " + response[0].locations[0].name);
			});
		})
		.on("error", function(e){
			console.log("Got error while fetching Trends of Country ("+ countries[i].woeid +"): "+ e.message);
			console.log("Got error while fetching Trends of Country ("+ countries[i].woeid +"): "+ e);
		})
		.end();
	}
}

function stream(onStatusCallback){
	var jsonTwitter = new jsonline();
	
	var username = config.twitter_username,
	password = config.twitter_password;
	
	var options = {
		host: 'stream.twitter.com',
		path: '/1/statuses/filter.json?locations=-180,-90,180,90',
		headers: {
			'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
		}
	};

	https.get(options, function(resp){
		resp.on('data', function(chunk){
			jsonTwitter.feed(chunk);
		});
	}).on("error", function(e){
		console.log("Got error: " + e.message);
		console.log("Got error: " + e);
	});

	jsonTwitter.on('value', function (value) {
		onStatusCallback(value);
	});
}

exports.getAvailableCountries = getAvailableCountries;
exports.stream = stream;
exports.fetchTrends = fetchTrends;
exports.createStream = createStream;

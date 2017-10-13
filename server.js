var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({
	host: 'localhost',
	port: +process.env.PORT
});

var Mongoose = require('mongoose');
var options = {
		server: {
			socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }
		}, 
        replset: {
        	socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 }
        }
    };   

var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.on('disconnected', console.error.bind(console, 'disconnected to mongodb'));

try {
	Mongoose.connect('mongodb://admin:qwert@ds035664.mongolab.com:35664/nodejs', options);
	console.log("Connection with database succeeded.");
} catch (err) {
	console.log("Sever initialization failed " , err.message);
}

db.once('open', function callback() {
	
});

var routes = require('./routes')(Hapi);

server.route([
	{
	  method: 'GET',
	  path: '/init',
	  handler: routes.init
	},
	{
	  method: 'GET',
	  path: '/press/{Digits?}',
	  handler: routes.press
	},
	{
	  method: 'GET',
	  path: '/call',
	  handler: routes.call
	},
	{
	  method: '*',
	  path: '/record/{Digits?}',
	  handler: routes.record
	},
	{
	  method: '*',
	  path: '/getRecording',
	  handler: routes.getRecording
	},
	{
	  method: '*',
	  path: '/track/{val?}',
	  handler: routes.track
	}
]);

server.start(function () {
    console.log('Server started at: ' + server.info.uri);
});
var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({
	host: process.env.OPENSHIFT_NODEJS_IP || 'localhost',
	port: process.env.OPENSHIFT_NODEJS_PORT || 3000
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
	  path: '/getRecording/{val?}',
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
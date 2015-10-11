var plivo = require('plivo'),
	Hapi;
var p = plivo.RestAPI(require('./config'));
var Mongoose = require('mongoose');


module.exports = function(hapi) {
	Hapi = hapi;
	return exports;
};

var call = exports.call = function(request, reply) {
	var params = {
		from: '+85261574234',
		to: '+85261574234',
		answer_url:"http://ivr-orcisurvey.rhcloud.com/init",
		answer_method: "GET"
	};

	p.make_call(params, function(status, response) {
		console.log('Status: ', status);
		console.log('API Response:\n ', response);
	});
};

var init = exports.init = function(request, reply) {
	var r = plivo.Response();

	var welcome = 'Hello! This is O-R-C I-V-R system, you have been invited to participate in this survey; to continue, please press a number on your telephone keypad.';
	var params = {
		action:"http://ivr-orcisurvey.rhcloud.com/press/",
		method:"GET",
		timeout:7,
		numDigits:1,
		retries:1,
		playBeep:true
	};
	var goodbye = ('Sorry, I didn\'t catch that. Please try again later.')

	// Add Wait
	r.addWait({'length' : 1});
	// Add GetDigits
	g = r.addGetDigits(params);
	// Add Speak
	g.addSpeak(welcome);
	r.addSpeak(goodbye);

	reply(r.toXML()).type('text/xml');
	// Test SIP parameter
  	//var obj = {};
	//obj = request.query;
	//var jsonStr = JSON.stringify(obj);
	//var parsed = JSON.parse(jsonStr);
	//var queryStr = parsed.To.split('?')[1];
	//console.log(parsed.To);
	//console.log(queryStr);
};

var press = exports.press = function(request, reply) {
	var r = plivo.Response();
	var press = 'You have pressed ' + request.query.Digits;
	//var loop = {'loop' : parseInt(request.query.Digits)};
	var params = {
		action:"http://ivr-orcisurvey.rhcloud.com/record/",
		method:"GET",
		timeout:7,
		numDigits:1,
		retries:1,
		playBeep:true
	};
	var q1 = 'Before this call, did you know we have an I-V-R system?';
	var yes = 'Press 1 for YES';
	var no = 'Press 2 for NO';
	//var again = 'Please try pressing a number on your keypad again, or hangup the call.';

	// Add Speak
	r.addSpeak(press);
	// Add Wait
	r.addWait({'length' : 1});
	// Add Speak
	r.addSpeak(q1);
	// Add Play
	//r.addPlay('https://s3.amazonaws.com/plivocloud/Trumpet.mp3', loop);
	// Add GetDigits
	g = r.addGetDigits(params);
	g.addSpeak(yes);
	g.addSpeak(no);

	reply(r.toXML()).type('text/xml');
	console.log(request.query.Digits);
};

var record = exports.record = function(request, reply) {
	var r = plivo.Response();
	//var whisper = 'To ensure quality service, your call may be monitored or recorded.';
	var whisper = 'One last question. What is your impression on this I-V-R system? Please speak clearly so we can record your response, press the # key when you have finished.';
	var params = {
		action: "http://ivr-orcisurvey.rhcloud.com/getRecording",
		method: "POST",
		fileFormat: "mp3",
		maxLength: 30,
		finishOnKey: '#'
	};
	
	// Add Speak
	r.addSpeak(whisper);
	// Add Record
	r.addRecord(params);
	// Add Play
	//r.addPlay('https://s3.amazonaws.com/plivocloud/Trumpet.mp3');

	reply(r.toXML()).type('text/xml');
	console.log(request.query.Digits);
};

var getRecording = exports.getRecording = function(request, reply) {
	var obj = {};
	obj = request.payload;
	var jsonStr = JSON.stringify(obj);
	console.log(jsonStr);
	var parsed = JSON.parse(jsonStr);
	console.log(parsed);
	console.log(typeof jsonStr);
	console.log(typeof parsed);


	// Compile a 'Record' model using the recordSchema as the structure.
	var Record = Mongoose.model('Record', recordSchema);
	var test = new Record({
		RecordUrl: 'gdg',
		Direction: 'asd'
	});
	test.save(function(err, test) {
	  if (err) return console.error(err);
	  console.dir(test);
	});

    //console.log(request.payload);
	

	var r = plivo.Response();
	var thank = 'Thank you. Your feedback is very important to us. Goodbye.';

	// Add Hangup
	r.addHangup({schedule:10});
	// Add Speak
	r.addSpeak(thank);

	reply(r.toXML()).type('text/xml');
};

var track = exports.track = function(request, reply) {
	var obj = {};
	obj = request.payload;

	console.log(obj);
};
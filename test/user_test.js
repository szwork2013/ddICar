var request = require('request');

var h = "http://localhost:3000";

exports.doLogin = function(test){
	test.expect(2);

	request.post({
		url: h + "/users/login",
		json: {
			phone: "18612260939",
			password: "123456"
		}
	},
	function(err, resp, body){
		test.equal(resp.statusCode, 200);
		test.equal(body.user.info.phone, "18612260939");
		test.done();
	});
};

exports.doLogout = function(test){
	test.expect(1);

	request.post({
		url: h + "/users/login",
		json: {
			phone: "18612260939",
			password: "123456"
		}
	},
	function(err, resp, body){
		request.get( h + "/users/logout", function(err, resp, body) {
			console.log(resp);
			test.equal(resp.statusCode, 200);
			test.done();
		});
	});
};
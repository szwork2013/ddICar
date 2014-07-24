exports.doReg = function(test) {
	test.expect(2);

	request.post(
		{ url: h + "/users/reg",
		  json: { phone: "18612260939",
				  password: "123456",
				  password_repeat: "123456"}},
		function (err, resp, body) {

			test.equal(resp.statusCode, 200);
			test.equal(body.user.info.phone, "18612260939");
			test.done();
		}
	);
};
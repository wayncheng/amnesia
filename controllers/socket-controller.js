"use strict";
(function() {
	const express = require("express");
	const bodyParser = require("body-parser");
	const router = express.Router();
	

	/////////////////////////////////////////////////////
	// router.get("/api/all", function(req, res) {
	//   dbPage.findAll({}).then(function(data) {
	//     console.log("data", data);
	//     return res.json(data);
	//   });
	// });
	/////////////////////////////////////////////////////
	router.get("/io", (req, res) => {
		let shape = "dots";
		let subject = "Basketball Player";
		let output = { shape, subject };

		res.json(output);
	});
	/////////////////////////////////////////////////////
	/////////////////////////////////////////////////////

	module.exports = router;
})();

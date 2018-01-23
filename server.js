"use strict";

(function() {
// DEPENDENCIES ===================================
	const express = require("express");
	const bodyParser = require("body-parser");
	const path = require("path");
	require("dotenv").config();

// CONFIG =========================================
	const app = express();
	const PORT = process.env.PORT || 8000;
	app.disable("x-powered-by");

	// Set Body Parser
	app.use(bodyParser.json());
	app.use(bodyParser.text());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json({ type: "application/vnd.api+json" }));

	// Sets access control headers
	app.use((req, res, next) => {
		// console.log("url : " + req.url); // logs each url that is requested, then passes it on.
		res.header("Access-Control-Allow-Origin", "*");
		res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
		next();
	});

	// Route to serve gzipped bundle.js file.
	// IMPORTANT: This NEEDS to be higher-priority than the static route
	if (process.env.NODE_ENV === "production") {
		app.get("*/bundle.js", function(req, res, next) {
			req.url = req.url + ".gz";
			res.set("Content-Encoding", "gzip");
			res.set("Content-Type", "text/javascript");
			next();
		});
	}

	// Set Static Directory
	app.use(express.static(path.join(__dirname, "public")));

// ROUTES =========================================
	
	// Default React route --------------------
	app.get("*", (req, res, next) => {
		res.sendFile(path.join(__dirname, "./public/index.html"));
	});

	// Error 500 -----------------------
	app.use( (err,req,res,next) => {
		console.error(err.stack);
		res.status(500).send(err.stack);
	});



// START SERVER ===================================

	const server = app.listen(PORT, () =>
		console.log("----------------------- @ " + PORT)
	);


// SOCKET.IO ======================================

	const socketShit = require('./controllers/socket');
	socketShit(server);

//==================================================
module.exports = server;
})();

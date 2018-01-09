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
	// logs each url that is requested, then passes it on.
	app.use((req, res, next) => {
		// console.log("url : " + req.url);
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept"
		);
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
	// API -----
	// const apiRoutes = require("./controllers/api-controller");
	// app.use("/api", apiRoutes);

	// Socket.IO -----
	// const socketController = require("./controllers/socket-controller");
	// app.use("/io", socketController);

	// Default React route
	// Basic HTML gets (Handled by ReactRouter)
	app.get("*", (req, res, next) => {
		res.sendFile(path.join(__dirname, "./public/index.html"));
	});

// ERRORS =========================================
	app.use(function(req, res) {
		res.type("text/html");
		res.status(404);
		res.send("404");
	});

	app.use(function(err, req, res, next) {
		console.error(err.stack);
		res.status(500);
		res.send("500");
	});

// START SERVER ===================================
	const server = app.listen(PORT, () =>
		console.log("----------------------- @ " + PORT)
	);
// SOCKET.IO ======================================
	const socketShit = require('./controllers/socket');
	socketShit(server);
//==================================================
module.exports = server; // Export for testing
})();

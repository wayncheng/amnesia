"use strict";

(function() {
	// DEPENDENCIES ===================================
	const express = require("express");
	const bodyParser = require("body-parser");
	const path = require("path");
	require("dotenv").config();

	// CONFIG =======================================
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
	const apiRoutes = require("./controllers/api-controller");
	app.use("/api", apiRoutes);

	// Socket.IO -----
	const socketController = require("./controllers/socket-controller");
	app.use("/io", socketController);

	// Default React route
	// Basic HTML gets (Handled by ReactRouter)
	app.get("*", (req, res, next) => {
		res.sendFile(path.join(__dirname, "./public/index.html"));
	});

	// ERRORS =========================================
	app.use(function(req, res) {
		res.type("text/html");
		res.status(404);
		res.render("404");
	});

	app.use(function(err, req, res, next) {
		console.error(err.stack);
		res.status(500);
		res.render("500");
	});

	// START SERVER ===================================
	const server = app.listen(PORT, () =>
		console.log("----------------------- @ " + PORT)
	);

	// SOCKET.IO ======================================

	// API Routes
	const socketIo = require("socket.io");
	const io = socketIo(server);

	
	let roomCount = 0;
	let roomList = ["yo"];
	let roomData = {
		// "roomName": {
		// 	status: "open"
		// }
		yo: {
			status: "open",
			id: "yo",
			players: [
				"wc"
			]
		}
	};
	
	let room = {
		status: "",
		id: "",
		players: []
	};

	io.on("connection", socket => {
		console.log(">>>> Connected");

	// Initial Ping -----
		io.emit('msg','hola')

	// On Disconnect -----
		socket.on("disconnect", () => {
			console.log("<<<< Disconnected")

		});

	// Create New Game ------
		// socket.on("new game", (player,room) => {
		// 	console.log("---> New Game");
		// 	io.emit("game created", room);
		// });
		
	// Join Game -----------------------
		socket.on("join", (roomID, playerName, cb) => {
			console.log(`>>>> Join Game ---> ${roomID} / ${playerName}`);

			let roomNotFound = !roomData[roomID];
			// let room;
			if (roomNotFound){
				console.log('!!!! room does not exist')
				return cb({
					status: 'error',
					message: 'room does not exist.',
				})
			}
			// If Room Found
			else {
				let room = roomData[roomID];
				let playerExists = room.players.includes(playerName);

				if ( playerExists ) {
					console.log('!!!! player already present in room.')
					return cb({
						status: 'error',
						message: 'player already present in room.',
					})
				}
				else {
					// Push to players list
					roomData[roomID].players.push(playerName);

					// Updated players list
					let {players} = roomData[roomID];
					console.log('players:',players)

					socket.join(roomID, () => {
						console.log('socket.rooms:',socket.rooms)

					return cb({
						players,
						code: '200',
						status: 'ok',
						message: 'player joined.',
						rooms: socket.rooms,
					})
					
				})
				}
			}
		});


	// Stats -----
		socket.on("stats", (cb) => {
			console.log(`---- stats --->`)
			let {rooms} = socket;
			console.log('rooms:',rooms)

			return cb({
				rooms,
			});
		});

	// When Player Joins a Room -----
		socket.on("joined", (room, player) => {
			console.log(`---> Player Joined ==== ${room} / ${player}`);
			let msg = `${player} has joined ${room}`;
			io.to(room).emit("msg", msg);
		});
	});

	// }

	//==================================================
	module.exports = server; // Export for testing
})();

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
	const tools = require('./src/utils/tools');

	let roomCount = 0;
	let roomList = ["yo"];
	let roomData = {
		// "roomName": {
		// 	status: "open"
		// }
		yo: {
			status: "open",
			id: "yo",
			players: ["wc"],
		}
	};

	let roomModel = {
		status: "",
		id: "",
		players: []
	};

io.on("connection", socket => {
	console.log("✔️");

// Initial Ping -----
		// io.emit("msg", "hola");

// On Disconnect -----
		socket.on("disconnect", () => {
			console.log("❌");
		});

// Create Game ------------------------------
		socket.on("createGame", (roomID,playerName,cb) => {
			console.log(`>>>> Create Game ---> ${roomID} / ${playerName}`);
			// CHECK IF ROOM ALREADY EXISTS
			let room = roomData[roomID];

			// ROOM AVAILABLE
			if (!room) {
				// Set details of new room
				let roomDetails = {
					status: 'open',
					id: roomID,
					players: [playerName],
					turn: -1,
				}
				
				// Add details to roomData object
				roomData[roomID] = roomDetails;
				
				console.log(`---> Game Created ( ${roomID} )`);
				
				// Join Socket Room ----------------
				socket.join(roomID, () => {
					socket.emit('joined',roomID,playerName)
					console.log(`---> Player Joined ( ${playerName} / ${roomID} )`);

					io.to(roomID).emit("msg", `${playerName} has joined ${roomID}`);
					
					return cb({
						players: [playerName],
						code: "200",
						status: "ok",
						message: "game created",
					});
				});
			}
			// ROOM IS NOT AVAILABLE
			else {
				console.log("!!!! room already exists");
				return cb({
					status: "error",
					message: "room already exists"
				});
			}

		});

// Join Game ------------------------------
		socket.on("join", (roomID, playerName, cb) => {
			console.log(`>>>> Join Game ---> ${roomID} / ${playerName}`);

			let roomNotFound = !roomData[roomID];
			
			// ROOM DOES NOT EXIST =========================
			if (roomNotFound) {
				console.log("!!!! room does not exist");
				return cb({
					status: "error",
					message: "room does not exist."
				});
			} 
			// ROOM EXISTS =========================
			else {
				let room = roomData[roomID];
				let playerExists = room.players.includes(playerName);
				let openRoom = (room.status === 'open');

				// OPEN ROOM =========================
				if (openRoom){

					// NAME TAKEN =========================
					if ( playerExists ) {
						console.log("!!!! player already present in room.");
						return cb({
							status: "error",
							message: "player already present in room."
						});
					}
					// NAME AVAILABLE =========================
					else {
						// Push to players list
						roomData[roomID].players.push(playerName);
						
						// Updated players list
						let { players } = roomData[roomID];
						console.log("players:", players);
						
						socket.join(roomID, () => {
							// socket.emit('joined',roomID,playerName)
							console.log(`---> Player Joined ( ${roomID} / ${playerName} )`);
							// let msg = `${playerName} has joined ${roomID}`;
							// io.to(roomID).emit("msg", msg);
							
							return cb({
								players,
								code: "200",
								status: "ok",
								message: "player joined",
								rooms: socket.rooms
							});
						});
					}
				}
				// ROOM NOT OPEN =========================
				else {
					console.log("⛔️️ room is not open for joining.");
					return cb({
						status: "error",
						message: "room not open"
					});
				}


			}
		});
// Leave Game ------------------------------------------
		socket.on("leaveGame", (roomID, playerName, cb) => {
			console.log(`>>>> Leave Game ---> ${roomID} / ${playerName}`);
			let {players} = roomData[roomID];
			const iof = players.indexOf(playerName);

			// Remove player's name from room in roomData object
			roomData[roomID].players.splice(iof,1);

			// Leave Socket.IO Room
			socket.leave(roomID, () => {
				console.log(`---> Player Left ( ${roomID} / ${playerName} )`);
				let msg = `${playerName} has left ${roomID}`;
				io.to(roomID).emit("msg", msg);
				
				return cb({
					players,
					code: "200",
					status: "ok",
					message: "player left",
					rooms: socket.rooms
				});
			});
		})
// Start Game / Lock Room ------------------------------
		// socket.on('startGame', (roomID,cb) => {
		socket.on('startGame', (roomID) => {
			console.log(`>>>> Start Game ---> ${roomID}`);
			
			roomData[roomID].status = 'playing'; 
			// e.g. roomData['yo'].status;
			
			io.to(roomID).emit('newState', {
				status: 'playing',
				deck: tools.getNewDeck(),
			})
			
			// return cb({
			// 	code: "200",
			// 	status: "ok",
			// 	message: "game started"
			// });

		})
// Open Room ------------------------------
		// socket.on('openRoom', (roomID,cb) => {
		socket.on('openRoom', (roomID) => {
			console.log(`>>>> Open Room ---> ${roomID}`);
			
			roomData[roomID].status = 'open'; 
			// e.g. roomData['yo'].status;

			io.to(roomID).emit('newState', {
				status: 'open',
				deck: []
			})
		})
// Draw Card ------------------------------
		socket.on('drawCard', (roomID) => {
			console.log(`---> Draw Card (${roomID})`);
			
			// let {turn} = roomData[roomID];

			// roomData[roomID].turn = turn+1;
			roomData[roomID].turn++;

			// New Turn Number
			let {turn} = roomData[roomID];

			// Broadcast to room
			io.to(roomID).emit('newState',{
				turn
			})
		})
// Send Card ------------------------------
		socket.on('sendCard', (roomID,playerID,cardID,cb) => {
			console.log(`---> Send Card (${roomID} / ${playerID} / ${cardID})`);

			// Send to room
			io.to(roomID).emit('newCard',{
				playerID,
				cardID,
			})

			return cb({
				status: 'ok',
				message: 'card sent'
			})
		})

// Stats ------------------------------
		socket.on("stats", (roomID,cb) => {
			console.log(`---- stats --->`);
			let { rooms } = socket;
			console.log("rooms:", rooms);
			let {status, players} = roomData[roomID];

			return cb({
				rooms,
				status,
				players,
			});
		});

// When Player Joins a Room ------------------------------
		socket.on("joined", (room, player) => {
			console.log(`---> Player Joined ==== ${room} / ${player}`);
			let msg = `${player} has joined ${room}`;
			io.to(room).emit("msg", msg);
		});
// New Player ------------------------------
		socket.on("newPlayer", (room, player) => {
			console.log(`---> newPlayer (${player})`);
			io.to(room).emit("msg", `${player} has joined ${room}`);

			// let {players} = roomData[room];
			// let newState = {
			// 	players
			// }
			io.to(room).emit('newState', {
				players: roomData[room].players
			})
		});
// Update State ------------------------------
		socket.on("updateState", (room, newState) => {
			console.log(`---> updateState (${room})`);
			io.to(room).emit('newState', newState)
		});

////////////////////////////////////////////////////
}); // end io.on(connection) ///////////////////////
//==================================================
module.exports = server; // Export for testing
})();

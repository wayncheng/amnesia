"use strict";
(function(server) {
	const socketIo = require("socket.io");
	const tools = require("../src/utils/tools");

	module.exports = function(server) {
		const io = socketIo(server);

		let roomCount = 0;
		let roomList = [];
		let roomData = {};
		
io.on("connection", socket => {
	console.log("✅   " + socket.id);
	// direct('string msg')
	// direct({ type: 'success', text: 'success' })
	// direct({ type: 'info', text: 'info' })
	// direct({ type: 'warn', text: 'warn' })
	// direct({ type: 'error', text: 'error' })

	// On Disconnect -----
		socket.on("disconnect", () => {
			console.log("🚫   " + socket.id);
		});

// Create Game ------------------------------
		socket.on("createGame", (roomID, playerName, cb) => {
			console.log(`🚀  Create Game >>>> ${roomID} / ${playerName}`)

			// CHECK IF ROOM ALREADY EXISTS
			let room = roomData[roomID];

			// ROOM AVAILABLE
			if (!room) {

				// Set details of new room
				let roomDetails = {
					status: "open",
					id: roomID,
					players: [playerName],
					turn: -1
				};

				// Add details to roomData object
				roomData[roomID] = roomDetails;
				
				console.log(`👾  New Game Created ( ${roomID} )`);

				// Join Socket Room ----------------
				socket.join(roomID, () => {
					// socket.emit("joined", roomID, playerName);
					console.log(`👥  ${playerName} joined ${roomID}`);
					// io.to(roomID).emit("msg", `${playerName} has joined ${roomID}`);

					return cb({
						players: [playerName],
						code: "200",
						status: "ok",
						message: "game created"
					});
				});
			} else {
				// ROOM IS NOT AVAILABLE
				console.log("⚠️  Room already exists");
				return cb({
					status: "error",
					message: "Room is occupied"
				});
			}
		});

// Join Game ------------------------------
		socket.on("join", (roomID, playerName, cb) => {
			console.log(`🙋  Join Game >>>> [${roomID}] / (${playerName})`);

			let roomNotFound = !roomData[roomID];

			// ⚠️ ROOM DOES NOT EXIST
			if (roomNotFound) {
				let err = '⚠️  Room does not exist'
				console.log(err)
				
				// Notify user of error
				// socket.to(socket.id).emit(err)
				// direct(err)

				// Return callback with error details
				return cb({
					status: "error",
					message: "Room does not exist"
				});

			} else {
				// ROOM EXISTS...........
				let room = roomData[roomID];
				let playerExists = room.players.includes(playerName);
				let openRoom = room.status === "open";

				// ✅  OPEN ROOM 
				if (openRoom) {
					// ⚠️  NAME TAKEN 
					if (playerExists) {
						console.log("⚠️ Player already present in this room.");
						
						return cb({
							status: "error",
							message: "Player already present in this room."
						});
					} else {
						// NAME AVAILABLE =========================
						// Push to players list
						roomData[roomID].players.push(playerName);

						// Updated players list
						let { players } = roomData[roomID];
						console.log("   > players:", players);

						socket.join(roomID, () => {
							// socket.emit('joined',roomID,playerName)
							console.log(`   > Player Joined ( ${roomID} / ${playerName} )`);
							// let msg = `${playerName} has joined ${roomID}`;
							// io.to(roomID).emit("msg", msg);

							return cb({
								players,
								code: "200",
								status: "ok",
								message: "Player joined",
								rooms: socket.rooms
							});
						});
					}
				} else {
					// ROOM NOT OPEN =========================
					console.log("⚠️  room is not open for joining.");
					return cb({
						status: "error",
						message: "Room is not open to join"
					});
				}
			}
		});

// Leave Game ------------------------------------------
			socket.on("leaveGame", (roomID, playerName, cb) => {
				console.log(`👋  Leave Game >>>> [${roomID}] / (${playerName})`);
				let { players } = roomData[roomID];
				const iof = players.indexOf(playerName);

				// Remove player's name from room in roomData object
				roomData[roomID].players.splice(iof, 1);

				// Get list of players in roomID
				let room = roomData[roomID];

				// Leave Socket.IO Room
				socket.leave(roomID, () => {
					console.log(`   > Player Left [${roomID}] / (${playerName})`);
					let msg = `${playerName} has left ${roomID}`;
					io.to(roomID).emit("msg", msg);
					
					// Check Client List in Socket Room
					// io.in(roomID).clients( (clients) => {
					// 	let occupancy = clients.length;
					// 	console.log('occupancy',occupancy);
					// })
					
					if (room.players.length === 0){
						delete roomData[roomID]
					}

					return cb({
						players,
						code: "200",
						status: "ok",
						message: "player left",
						rooms: socket.rooms
					});
				});
			});

// Start Game / Lock Room ------------------------------
			socket.on("startGame", roomID => {
				console.log(`🚀  Start Game >>>> [${roomID}]`);

				// Lock room by updating status
				roomData[roomID].status = "playing";

				// Build New Deck
				let deck = tools.getNewDeck();
				if (deck.length !== 76){
					console.log(`⚠️⚠️⚠️⚠️⚠️  deck builder broken  ⚠️⚠️⚠️⚠️⚠️`);
					alert('deck build broken')
				}

				io.to(roomID).emit("newState", {
					status: "playing",
					deck: tools.getNewDeck(),
					cards: [],
					wilds: [],
					winnings: [],
				});
			});

// Open Room ------------------------------
			socket.on("openRoom", roomID => {
				console.log(`⚡️  Open Room >>>> [${roomID}]`);

				roomData[roomID].status = "open";
				// e.g. roomData['yo'].status;

				io.to(roomID).emit("newState", {
					status: "open",
					deck: [],
					cards: [],
					wilds: [],
				});
			});

// Draw Card ------------------------------
			socket.on("drawCard", roomID => {
				console.log(`⚡️  Draw Card >>>> [${roomID}]`);

				roomData[roomID].turn++;

				// New Turn Number
				let { turn } = roomData[roomID];

				// Broadcast to room
				io.to(roomID).emit("newState", {
					turn
				});
			});

// Send Card ------------------------------
			socket.on("sendCard", (roomID, playerID, cardID, cb) => {
				console.log(`⚡️  Send Card >>>> (${cardID} to ${playerID} in ${roomID})`);

				// Send to room
				io.to(roomID).emit("newCard", {
					playerID,
					cardID
				});

				return cb({
					status: "ok",
					message: "card sent"
				});
			});

// When Player Joins a Room ------------------------------
			socket.on("joined", (room, player) => {
				console.log(`🔔  Player Joined >>>> [${room}] / (${player})`);
				let msg = `${player} has joined ${room}`;
				io.to(room).emit("msg", msg);
			});

// New Player ------------------------------
			socket.on("newPlayer", (room, player) => {
				console.log(`⚡️  newPlayer >>>> (${player})`);

				// Notify Room
				// io.to(room).emit("msg", `${player} has joined ${room}`);
				io.to(room).emit("msg", {
					type: 'success',
					text: `${player} has joined ${room}`
				})

				// Broadcast new players list
				io.to(room).emit("newState", {
					players: roomData[room].players
				});
			});

// Update State ------------------------------
			socket.on("updateState", (room, newState) => {
				console.log(`⚡️  updateState >>>> [${room}]`);
				io.to(room).emit("newState", newState);
			});


// Stats ------------------------------
		socket.on("stats", (roomID, cb) => {
			console.log(`>>>> stats`);
			let { rooms } = socket;
			let { status, players } = roomData[roomID];
			
			if (roomID){
				io.of('/').in(roomID).clients((error, clients) => {
					if (error) throw error;

					return cb({
						rooms,
						status,
						players,
						clients,
					});
				});
			}

			return cb({
				rooms,
				status,
				players,
			});
		});


// Direct Message One Player ----------------------
		function direct(msg) {
			// socket.to(socket.id).emit(msg)
			io.to(socket.id).emit('msg', msg)
		}
		
////////////////////////////////////////////////////
}); // end io.on(connection) ///////////////////////
////////////////////////////////////////////////////
};
})();

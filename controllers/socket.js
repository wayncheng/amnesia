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

	// On Disconnect -----
		socket.on("disconnect", () => { console.log("🚫   " + socket.id); });

// Create Game ----------------------------
		socket.on("createGame", (roomID, playerName, cb) => {
			console.log(`🚀  Create --> ${roomID} / ${playerName}`)

			// CHECK IF ROOM ALREADY EXISTS
			let room = roomData[roomID];

			// ROOM AVAILABLE
			if (!room) {

				// Set details of new room
				let roomDetails = {
					status: "open",
					id: roomID,
					players: [playerName],
					turn: -1,
					order: [],
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
			console.log(`🙋  Join --> [${roomID}] / (${playerName})`);

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

// Leave Game -----------------------------
			socket.on("leaveGame", (roomID, playerName, cb) => {
				console.log(`👋  Leave --> [${roomID}] / (${playerName})`);
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

// Start Game / Lock Room -----------------
			socket.on("startGame", roomID => {
				console.log(`🚀  Start --> [${roomID}]`);

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
					deck,
					cards: [],
					wilds: [],
					winnings: [],
					turn: -1
				});
			});

// Stop Game / Open Room ------------------
			socket.on("openRoom", roomID => {
				console.log(`⚡️  Open --> [${roomID}]`);

				roomData[roomID].status = "open";
				// e.g. roomData['yo'].status;

				io.to(roomID).emit("newState", {
					status: "open",
					deck: [],
					cards: [],
					wilds: [],
				});
			});

// Finish Game ----------------------------
			socket.on('finishGame', roomID => {
				console.log(`⚡️  Finish --> [${roomID}]`);

				io.to(roomID).emit('msg', 
				{
					type: 'info',	
					text:'No cards left. Check your wins!'
				})
			})
// Draw Card ------------------------------
			socket.on("drawCard", (roomID,playerName,isWild) => {
				console.log(`⚡️  Draw --> [${roomID}]`);

				roomData[roomID].turn++;

				// New Turn Number
				let { turn } = roomData[roomID];

				// Broadcast to room
				io.to(roomID).emit("newState", {
					turn
				});

				
				let { players, order } = roomData[roomID];
				
				// Learn Player Sequence ..............
				if (order.length < players.length){
					console.log('order:',order)
					// Add player to order array only if unique
					if (!order.includes(playerName)){
						roomData[roomID].order.push(playerName)
					}
				}
				// Notify Next Player ..................
				else if (order.length === players.length) {

					// if last card was wild, nudge the player (playerName) that just flipped 
					// for regular cards...
					// 1. find index of playerName in room.order
					// 2. get next player's name in room.order (index+1)
					// 3. if index from (1) equals length -1, that means it's the last one
					//    get name of first player in array.
					
				}
			});

// Send Card ------------------------------
			socket.on("sendCard", (roomID, playerID, cardID, cb) => {
				console.log(`⚡️  Send --> (${cardID} to ${playerID} in ${roomID})`);

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

// When Player Joins a Room ---------------
			socket.on("joined", (room, player) => {
				console.log(`🔔  Player Joined --> [${room}] / (${player})`);
				let msg = `${player} has joined ${room}`;
				io.to(room).emit("msg", msg);
			});

// New Player -----------------------------
			socket.on("newPlayer", (room, player) => {
				console.log(`⚡️  newPlayer --> (${player})`);

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

// Update State ---------------------------
			socket.on("updateState", (room, newState) => {
				console.log(`⚡️  updateState --> [${room}]`);
				io.to(room).emit("newState", newState);
			});


// Stats ......
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

// Info ......
		socket.on('info', (cb) => {
			
			return cb(roomData)
		})

// Direct Message One Player --------------
		function direct(msg) {
			// socket.to(socket.id).emit(msg)
			io.to(socket.id).emit('msg', msg)
		}
		
////////////////////////////////////////////////////
}); // end io.on(connection) ///////////////////////
////////////////////////////////////////////////////
};
})();

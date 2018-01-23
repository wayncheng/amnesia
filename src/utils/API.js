import axios from "axios";
import subjects from './subjects.json';
import tools from './tools';
import io from "socket.io-client";
const socket = io();

const API = {
////////////////////////////////////////////////////



// GAME ////////////////////////////////////////////
	// Create Game =====================================
		createGame: (room,player,cb) => {
			// Create Room on server ===========================
			socket.emit('createGame',room,player, res => {
				let response = {
					status: res.status,
				}

				if (res.status === 'ok'){
					console.log('game created');

					let newStates = {
						currentRoom: room,
						currentName: player,
						status: 'open',
						players: res.players,
					}

					response.newStates = newStates;

				}
				else {
					response = res
				}
				
				return cb(response)
			})

			
		},
	// Join Game =======================================
		joinGame: (room,player,cb) => {
			socket.emit("join", room, player, res => {
				
				let response = {
					status: res.status,
				}

				if (res.status === 'ok'){
					console.log('joined game');
					socket.emit("newPlayer", room, player );

					let newStates = {
						currentRoom: room,
						currentName: player,
						status: 'open',
						players: res.players,
					}

					response.newStates = newStates;

				}
				else {
					response = res
				}
				
				return cb(response)
			});
		},
	// Leave Game ======================================*
		leaveGame: (room,player,cb) => {
			socket.emit("leaveGame", room, player, res => {
				console.log("res", res);
				let newStates = {};

				// If all good, broadcast to room
				if (res.status === 'ok'){			
					console.log('successfully left room')	
					// socket.emit("joined", roomID, playerName );

					// Set the new room / name states
					newStates = {
						currentRoom: '', 
						currentName: player,
						status: '',
						cards: [],
						winnings: [],
						turn: -1,
						players: [],
						wilds: [],
						cardSelected: false,
						isOpen: false,					
					}
				}
				
				// Return new states to be set (errors will return empty object)
				return cb(newStates);
			});
		},
	// Start Game ======================================
		startGame: (currentRoom, currentName, cb) => {
			socket.emit("startGame", currentRoom, res => cb(res) )
		},
	// Open Room =======================================
		openRoom: (room,cb) => {
			socket.emit("openRoom", room, res => {
				console.log("res", res);
				
				// If all good, broadcast to room
				if (res.status === 'ok'){			
					console.log('room opened')

					// Set the new status state
					let newStates = { 
						status: 'open',
					}
					return cb(newStates)
				}
				else {
					console.log('error opening room');
					return cb(res);
				}				
			});
		},
	// Finish Game =====================================
		finishGame: (roomID,cb) => {
			socket.emit("finishGame", roomID, res => {
				console.log("res", res);
				
				if (res.status === 'ok'){

					// Set the new status state
					let newStates = { 
						status: 'open',
					}
					return cb(newStates)
				}
				else {
					console.log('error finishing game');
					return cb(res);
				}				
			});
		},
////////////////////////////////////////////////////



// CARD ////////////////////////////////////////////
	// Draw Card ====================================
		drawCard: (room,player,isWild,cb) => {
			socket.emit("drawCard",room,player,isWild);
		},
	// Send Card ====================================
		sendCard: (roomID,receiverID,cardID,cb) => {
			socket.emit("sendCard", roomID, receiverID, cardID, res => {
				return cb(res)
			});
		},
	// Receive Card =================================
		onNewCard: (cb) => {
			socket.on("newCard", res => cb(res) );
		},
////////////////////////////////////////////////////



// Update State ====================================
	updateState: (room,newState) => {
		socket.emit('updateState',room,newState);
	},
// Events //////////////////////////////////////////
	onMessage: (cb) => {
		socket.on("msg", msg => cb(msg) );
	},
	onNewState: (cb) => {
		socket.on("newState", res => cb(res) );
	},
// Get Stats =======================================
	getStats: (roomID, cb) => {
		socket.emit("stats",roomID, res => {
			console.log("res:", res)
			return cb(res)
		});
	},
// Get Info ========================================
	getInfo: (cb) => {
		socket.emit('info', res => cb(res))
		// socket.emit("info", res => {
		// 	console.log("info =>", res)
		// 	return cb(res)
		// });
	},

////////////////////////////////////////////////////
};

export default API;

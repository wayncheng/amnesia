import axios from "axios";
import subjects from './subjects.json';
import tools from './tools';
import io from "socket.io-client";
const socket = io();

const API = {
// createGame //////////////////////////////////////////////////
	initNewGame: (playerNames) => {
		let playerCount = playerNames.length;
		console.log('playerCount',playerCount);
		
		// const finalSequence = tools.buildArray(subjects.length);
		// console.log('finalSequence',finalSequence);
		// return finalSequence;

		//==================================================
		// Process Cards (add suits, ids) ==================
		const processed = subjects.map( (ea,index) => {
			let cardObj;

			if (Array.isArray(ea)){
				cardObj = {
					type: 'wild',
					suit: ea,
					id: index,
				}
			}
			else {
				cardObj = {
					type: 'regular',
					subject: ea,
					suit: tools.getRandomSuit(), // Randomly pick the suit
					id: index,
				}
			}
			return cardObj;
		});

		// Shuffle Cards ===========================================
		const shuffled = tools.shuffleArray(processed);
		console.log('shuffled',shuffled);

		// Return Processed/Shuffled Cards =========================
		return shuffled;
		
	},
// Join Game //////////////////////////////////////////////////
	joinGame: (room,player,cb) => {
		socket.emit("join", room, player, res => {
			console.log("res", res);
			let newStates = {};

			// If all good, broadcast to room
			if (res.status === 'ok'){			
				console.log('successfully joined room')	
				// socket.emit("joined", roomID, playerName );

				// Set the new room / name states
				newStates = { 
					currentRoom: room, 
					currentName: player, 
				}
			}
			
			// Return new states to be set (errors will return empty object)
			return cb(newStates);
		});
	},
// Leave Game //////////////////////////////////////////////////
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
				}
			}
			
			// Return new states to be set (errors will return empty object)
			return cb(newStates);
		});
	},
// Start Game //////////////////////////////////////////////////
	startGame: (currentRoom,cb) => {
		socket.emit("startGame", currentRoom, res => {
			console.log("res", res);
			let newStates = {};

			// If all good, broadcast to room
			if (res.status === 'ok'){			
				console.log('successfully started game')

				// Set the new status state
				newStates = { 
					status: 'playing',
				}
			}
			else {
				console.log('error starting game');
			}
			
			// Return new states to be set (errors will return empty object)
			return cb(newStates);
		});
	},
// Open Room //////////////////////////////////////////////////
	openRoom: (room,cb) => {
		socket.emit("openRoom", room, res => {
			console.log("res", res);
			let newStates = {};

			// If all good, broadcast to room
			if (res.status === 'ok'){			
				console.log('room opened')

				// Set the new status state
				newStates = { 
					status: 'open',
				}
			}
			else {
				console.log('error opening room');
			}
			
			// Return new states to be set (errors will return empty object)
			return cb(newStates);
		});
	},
// Events //////////////////////////////////////////
	onMessage: (cb) => {
		socket.on("msg", msg => cb(msg) );
	},
// Gets ////////////////////////////////////////////
	getStats: (roomID, cb) => {
		socket.emit("stats",roomID, res => {
			console.log("res:", res)
			return cb(res)
		});
	}
////////////////////////////////////////////////////
};

export default API;


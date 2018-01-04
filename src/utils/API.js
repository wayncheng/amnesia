import axios from "axios";
import subjects from './subjects.json';
import tools from './tools';
import io from "socket.io-client";
const socket = io();

const API = {
// New Game //////////////////////////////////////////////////
	// getOne: function(id){
	// 	return axios.get('/api/'+id);
	// }
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
			
			// If all good, broadcast to room
			if (res.status === 'ok'){			
				console.log('successfully joined room')	
				// socket.emit("joined", roomID, playerName );
			}
		});
	},
// Events //////////////////////////////////////////
	// onMessage: (cb) => {
	// 	socket.on("msg", msg => cb(msg) );
	// },
// Gets ////////////////////////////////////////////
	getStats: () => {
		socket.emit("stats", res => console.log("res:", res));
	}
////////////////////////////////////////////////////
};

export default API;


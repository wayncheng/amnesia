import axios from "axios";
import subjects from './subjects.json';
import tools from './tools';

const API = {
////////////////////////////////////////////////////
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
		
	}
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
};

export default API;


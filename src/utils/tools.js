'use strict';
(function() { 
	const suits = [ "red", "orange", "yellow", "green", "blue", "purple", "brown", "pink" ]
	const subjects = require('./subjects.json');

	const tools = {
		//==================================================
		// Shuffle Array of Numbers to Create Card Sequence 
		// (Fisher-Yates Shuffle Algorithm)
		//==================================================
		shuffleArray: function(array) {
			let m = array.length;
			
			// While there remain elements to shuffle…
			while (m) { 
				// Pick a remaining element…
				let i = Math.floor(Math.random() * m--);
				// And swap it with the current element.
				let t = array[m];
				array[m] = array[i];
				array[i] = t;
			}

			// Send back the shuffled array
			return array;
		},
		//==================================================
		// Get Random Suit
		//==================================================
		getRandomSuit: function(){
			var suit = suits[Math.floor(Math.random()*suits.length)];
			return suit;
		},
		//==================================================
		// Build Array of Numbers
		//==================================================
		buildArray: function(n){
			// Alternate ES6 method 
			// >>>> Array.from(new Array(N),(val,index)=>index);
			var len = n || 73;
			var numbered = [];
			for(var i=0; i<len; i++) numbered.push(i);
			
			let shuffled = tools.shuffleArray(numbered);
			// console.log('shuffled',shuffled);

			return shuffled;
		},
		getNewDeck: function(){
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

	};


	module.exports = tools;
})();

'use strict';
(function() { 
	const suits = [ "red", "orange", "yellow", "green", "blue", "purple", "brown", "pink" ]
	const subjects = require('./subjects.json');
	const allWilds = require('./wilds');
	const allTopics = require('./topics');

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
		//==================================================
		// Get New, Shuffled Deck
		//==================================================
		getNewDeck: function(size = 69){
			//==================================================
			// Get N Random indeces for Regular Topics..........
			let indeces = [];
			let min = 0;
			let max = allTopics.length;

			while (indeces.length <= size){
				let random = Math.floor(Math.random() * (max - min + 1)) + min;

				if (indeces.indexOf(random) === -1){
					indeces.push(random)
				}
			}

			// Map the indeces to topics........................
			let regulars = indeces.map( (ea,index) => allTopics[ea] )

			// Pick 7 Random Unique Wild Combinations...........
			let wilds = this.getWilds();

			// Join Regular and Wild Cards......................
			let combined = regulars.concat(wilds);

			// Process Cards (add suits, ids)...................
			const processed = combined.map( (ea,index) => {
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

			// Shuffle Cards ...................................
			const shuffled = tools.shuffleArray(processed);

			// Return Processed/Shuffled Cards .................
			return shuffled;
		},
		//==================================================
		// Get 7 Wild Combinations
		//==================================================
		getWilds: function(){
			let wilds = allWilds;

			// Shuffle all possible wild combinations (28)
			let shuffledWilds = tools.shuffleArray(wilds);

			// Extract the first 7 from shuffled
			let selectedWilds = shuffledWilds.splice(0,7);

			// Return the selected 7
			return selectedWilds;
		}

	};


	module.exports = tools;
})();

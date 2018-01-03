'use strict';
(function() { 
	const suits = [ "red", "orange", "yellow", "green", "blue", "purple", "brown", "pink" ]

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
		}

	};


	module.exports = tools;
})();

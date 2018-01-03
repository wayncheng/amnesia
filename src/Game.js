import React from "react";
import Card from "./components/Card";

import subjects from "./utils/subjects.json";
import suits from "./utils/suits.json";
import API from "./utils/API";

import io from 'socket.io-client';
// let socket = io();
const socket = io({
  autoConnect: false
});
// const lobby = io('/poo');
// let lobby;

let finalSequence;

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			turn: -1,
			cards: [],
			wilds: [],
			current: null,
			gameStarted: false,
			gameEnded: false,

			subject: "",
			type: "regular",
			suit: ""
		};
	}
	//==================================================
	componentDidMount = () => {
		// const { players } = this.props;

		// window.addEventListener("keyup", function(e) {
		// 	e.preventDefault();
		// 	const code = e.which;
		// 	if (code === 13) {
		// 		document.getElementById("flip").click();
		// 	}
		// });

		// SOCKET.IO ================
		socket.on('game created',(room) => {
			console.log('>>>> game created')
			// Connect to Created Lobby
			this.joinGame(room)
			// lobby.on('connection', socket => {
			// 	console.log('connected to',keyword);
			// 	socket.on('player joined', player => console.log('player',player))
			// })

			// lobby.on('player joined', (player)=>{
			// 	console.log('--->',player, 'joined');
			// })
		})

	};

	//==================================================
	handleJoin = event => {
		event.preventDefault();
		const keyword = document.getElementById('keyword').value;
		const player = document.getElementById('player').value;
		this.joinGame(keyword,player)
	}
	//==================================================
	joinGame = (room,player) => {
		
		io.on('connection', (socket) => {
			socket.join(room);
			// let rooms = Objects.keys(socket.rooms);
			// console.log('rooms',rooms);
			// io.to(room, () => socket.emit('joined',player,room))

			socket.emit('joined',player,room)

			socket.on('spam', msg => {
				console.log('spam',msg);
			})
		})
	}
	//==================================================
	playTurn = () => {
		// Turns increment steadily
		let currentTurn = this.state.turn;
		let turn = currentTurn + 1;
		// Next Card
		let card = finalSequence[turn];
		console.log("card", card);
		let { subject, suit, type } = card;

		if (type === "wild") {
			subject = "Wild Card";
			this.setState({
				wilds: suit
			});
		} else {
		}

		// this.setState({
		// 	cards
		// })

		// Add to player's card deck
		let { cards } = this.state;
		cards.unshift(card);

		this.setState({
			cards,
			subject,
			suit,
			type,
			turn
		});
	};
	//==================================================
	handleTurns = event => {
		event.preventDefault();
		this.playTurn();
	};
	//==================================================
	createNewGame = (event) => {
		event.preventDefault();
		const player = document.getElementById('player').value;
		const keyword = document.getElementById('keyword').value;

		if (player && keyword) {	
			finalSequence = API.initNewGame(this.props.players);
			socket.emit('new game',player,keyword);
		}
		else {
			alert('player and keyword required')
		}

	}
	////////////////////////////////////////////////////
	render() {
		return (
			<main id="game-root">
				<ul className="log">
					<li>{"turn " + this.state.turn}</li>
					<li>{"subject " + this.state.subject}</li>
					<li>{"suit " + this.state.suit}</li>
				</ul>

				<section className="wild-suit-area">
					{this.state.wilds.map((suit, index) => {
						let id = "wild-" + index;
						return (
							<div
								id={id}
								className={"wild-suit " + suit}
								data-suit={suit}
								key={id}
							/>
						);
					})}
				</section>

				<button
					id="flip"
					className="ws-btn action"
					type="submit"
					onClick={this.handleTurns}
					data-turn={this.state.turn}
				>
					Flip
				</button>

				
				<section className="pile">
					{this.state.cards.map((card, index) => {
						return <Card specs={card} key={index} />;
					})}
				</section>

					<form className="game-form">
						<label>
							Nickname
							<input type="text" id="player" name="player"/>
						</label>
						<label>
							Keyword
							<input type="text" id="keyword" name="keyword"/>
						</label>
						<button
							id="new"
							className="ws-btn ws-mini"
							type="button"
							onClick={this.createNewGame}
						>
							New
						</button>
						<button
							id="join"
							className="ws-btn ws-mini"
							type="button"
							onClick={this.joinGame}
						>
							Join
						</button>
					</form>
			</main>
		);
	}
}
export default Game;

function getRandom(len) {
	len = Math.floor(len - 1);
	return Math.floor(Math.random() * (len - 0 + 1)) + 0;
}

// const allShapes = [
// 	"dots",
// 	"grid",
// 	"ring",
// 	"asterisk",
// 	"diamond",
// 	"squiggles",
// 	"bars",
// 	"plus"
// ];
// const allSubjects = [
// 	"One",
// 	"Two",
// 	"Three",
// 	"Four",
// 	"Five",
// 	"Six",
// 	"Seven",
// 	"Eight",
// 	"Nine",
// 	"Ten"
// ];
// let testCards = [];
// let suitSeq = [];
// let subjectSeq;

// for (let i=0; i<100; i++){
// 	testCards.push(i)

// 	let suitIndex = getRandom(allShapes.length)
// 	suitSeq.push(suitIndex)
// }

// subjectSeq = shuffle(testCards);
// console.log('subjectSeq',subjectSeq);
// console.log('suitSeq',suitSeq);
// console.log('Number of Cards:',subjectSeq.length);

// When we reach end of deck, END GAME
// if (nextIndex >= subjects.length) {
// if (currentTurn === 72){
// 	this.setState({
// 		gameStarted: false,
// 		gameEnded: false,
// 		current: null,
// 		turn: turn,
// 		card: card,
// 	})
// }

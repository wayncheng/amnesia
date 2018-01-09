import React from "react";
import { ToastContainer, toast, style } from "react-toastify";
import Modal from "react-modal";
import Helmet from 'react-helmet';
import { Card, PlayerList, WildSuits, Winnings, ActivePile, MenuToggle, GameForm } from "./";
import API from "./utils/API";

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: "",
			room: "",
			status: "",
			currentRoom: "",
			currentName: "",
			turn: -1,
			players: [],
			wilds: [],
			cards: [],
			winnings: [],
			deck: [],

			subject: "",
			type: "regular",
			suit: "",

			cardSelected: false,
			isOpen: false,
			menuOpen: false,
		};
	}
// componentDidMount =========================================
	componentDidMount = () => {
		
		// Socket Listeners ===============
		API.onMessage(msg => {
			console.log("💬", msg);
			toast(msg);
		});

		API.onNewState(newState => {
			console.log("newState", newState);
			this.setState(newState);
		});

		API.onNewCard(newCard => {
			let {playerID,cardID} = newCard;
			console.log('playerID',playerID);
			console.log('cardID',cardID);

			if (playerID === this.state.currentName){
				toast('Card Received');
				console.log('cardID',cardID);

				// Add to winnings pile
				let {winnings} = this.state;
				winnings.push(cardID)
				this.setState({
					winnings,
				})

			} else {
				console.log('card transferred between players',newCard);
			}
		})

		////////////////////////////////////////////////////
		// TODO: FETCH FROM COOKIES OR LOCAL STORAGE
		////////////////////////////////////////////////////

		// let stored = JSON.parse(sessionStorage.getItem('amnesia')); // Fetch from Local Storage
		// if (stored) { // Set state if there is data stored
		// 	this.setState(stored)
		// }
	};
// clearOut ==================================================
	clearOut = () => {
		this.setState({
			cards: [],
			currentRoom: '',
		})
	}
// createGame ================================================
	createGame = e => {
		e.preventDefault();
		console.log("👉 createGame");

		let { room = "yo", player = "wc" } = this.state;

		API.createGame(room, player, response => {
			console.log("👈", response);
			this.setState(response);
		});
	};
// joinGame ==================================================
	joinGame = event => {
		event.preventDefault();
		console.log("👉 joinGame");
		// const room = document.getElementById("room").value.trim() || "yo";
		// const player = document.getElementById("player").value.trim() || "wc";
		let { room = "yo", player = "wc" } = this.state;
		console.log("room:", room);
		console.log("player:", player);

		API.joinGame(room, player, response => {
			console.log("joinGame ==>", response);
			if (response.status === 'error'){
				console.log('response.message',response.message);
				toast(response.message)
			}
			else {
				this.setState(response);

				API.getStats(this.state.currentRoom, (response) => {
					console.log('response',response);
				})
			}
		});
	};
// endGame / openRoom  =======================================
	endGame = e => {
		e.preventDefault();
		console.log(`👉  endGame =>`);
		
		const { currentRoom, currentName } = this.state;

		API.openRoom(currentRoom);
	}
// handleEmit ================================================
	handleEmit = e => {
		e.preventDefault();
		// console.log(`👉  handleEmit --->`);
		const event = e.target.getAttribute("data-socket-event");
		const { currentRoom, currentName } = this.state;
		// console.log(`   > ${event}`);

		if (currentRoom && currentName) {
			API[event](this.state.currentRoom, currentName);
		} else {
			console.log("no current room or name");
		}
	};
// handleSocket ==============================================
	handleSocket = e => {
		e.preventDefault();
		// console.log(`>>>> handleSocket --->`);
		const event = e.target.getAttribute("data-socket-event");
		const { currentRoom, currentName } = this.state;
		// console.log(`   * ${event}`);

		if (currentRoom && currentName) {
			API[event](this.state.currentRoom, currentName, response => {
				console.log("response", response);
				this.setState(response);
			});
		} else {
			console.log("no current room or name");
		}
	};
// portState =================================================
	portState = newState => this.setState(newState);
// updateGroup ===============================================
	updateGroup = () => {
		let { currentRoom, currentName } = this.state;
		API.drawCard(currentRoom);
	};
// updateWilds ===============================================
	updateWilds = wilds => {
		let { currentRoom, currentName } = this.state;
		let newState = {
			wilds
		};
		API.updateState(currentRoom, newState);
	};
// handleTurn ================================================
	handleTurn = e => {
		e.preventDefault();

		// Turns increment steadily
		let currentTurn = this.state.turn;
		let turn = currentTurn + 1;
		// Next Card
		let card = this.state.deck[turn];
		console.log("card", card);
		let { subject, suit, type, id } = card;

		if (type === "wild") {
			subject = "Wild Card";
			this.setState({
				wilds: suit
			});
			this.updateWilds(suit);
		} else {
		}

		// this.setState({
		// 	cards
		// })

		// Add to player's card deck
		let { cards } = this.state;
		cards.push(card);

		this.setState({
			cards,
			subject,
			suit,
			type,
			turn
		});

		// Update rest of group
		this.updateGroup();
	};
// handleCard ================================================
	handleCard = e => {
		e.preventDefault();
		let el = e.target;

		// Traverse upwards until you find card element
		if (!el.classList.contains('card')){
			let parent = el.parentNode;
			while( !parent.classList.contains('card') ){
				parent = parent.parentNode;
			}
			el = parent;
		}

		// Get Card Info
		// Show Player List
		// On Player Select...
		// Send to player, add to their winnings
		// Remove from current pile
		
		// console.log('el',el);
		const id = el.getAttribute("data-id");
		const type = el.getAttribute("data-type");
		const suit = el.getAttribute("data-suit");
		const subject = el.getAttribute("data-subject");
		const card = { id, type, suit, subject };
		// console.log('card',card);

		if (type === 'wild'){
			let {cards} = this.state;
			let popped = cards.pop();
			this.setState({
				cards
			})
		}
		else {	
			this.setState({
				isOpen: true,
				cardID: id,
			});
		}
	};
// afterOpenModal ============================================
	afterOpenModal = () => {
		const rootEl = document.getElementById("app");
		rootEl.classList.add("blur-for-modal");
	};
// closeModal ================================================
	closeModal = () => {		
		const rootEl = document.getElementById("app");
		rootEl.classList.remove("blur-for-modal");

		this.setState({ isOpen: false });
	};
// MENU //////////////////////////////////////////////////
// toggleMenu ================================================
	toggleMenu = e => {
		// const el = document.getElementById("app");
		// el.classList.remove("blur-for-modal");
		this.setState({ menuOpen: true });
	};
// afterOpenMenu ============================================
	afterOpenMenu = event => {
		const rootEl = document.getElementById("app");
		rootEl.classList.add("blur-for-modal");
	};
// closeMenu ================================================
	closeMenu = e => {
		const el = document.getElementById("app");
		el.classList.remove("blur-for-modal");
		this.setState({ menuOpen: false });
	};
// handleSend ================================================
	handleSend = e => {
		e.preventDefault();
		const el = e.target;
		const receiverID = el.getAttribute('data-player');
		const { cardID, currentRoom } = this.state;
		console.log(`Sending to ${receiverID}...`);

		this.closeModal();

		// Remove last card in pile
		let {cards} = this.state;
		cards.pop();
		this.setState({cards})

		API.sendCard(currentRoom,receiverID,cardID, response => {
			// console.log('sendCard ==>',response);
			if (response.status === 'ok'){
				toast(`Card sent to ${receiverID}`)
			}
			else {
				toast('Error sending card')
			}
		})
	};
// TODO: Store Locally =======================================
	storeData = () => {
		const stateString = JSON.stringify(this.state);
		console.log('stateString:',stateString)
		// Store in Session Storage
		sessionStorage.setItem('amnesia',stateString)
	}
	fetchData = e => {
		e.preventDefault();
		const fetched =	JSON.parse(sessionStorage.getItem('amnesia'));
		console.log('fetched:',fetched)
	}
// RENDER ====================================================
	render() {
		let { status, currentRoom, currentName, players, cards, winnings } = this.state;

		return (
			<div id="game-root" className="socket ">
				<MenuToggle onClick={this.toggleMenu} />
			
				{!currentRoom &&
				<GameForm portState={this.portState} joinGame={this.joinGame} createGame={this.createGame} /> }
				
				<WildSuits wilds={this.state.wilds}/>
				
				{cards.length !== 0 && 
				<ActivePile cards={this.state.cards} onClick={this.handleCard} portState={this.portState} /> }
				
				{status && 
				<Winnings winnings={this.state.winnings}/> }
				
				{status === 'playing' && 
				<a id="flip" className="ws-btn action" onClick={this.handleTurn}> Flip </a> }

				{status === 'open' && 
				<PlayerList players={this.state.players} currentName={currentName} /> }
			
				{/* Not Visible ================================== */}
				<ToastContainer autoClose={1500} />
				<Helmet title={'Waynomia'+ (currentRoom && ` (${currentRoom})`)}/>
				
				{/* Modal =================================== */}
					<Modal
						isOpen={this.state.isOpen}
						onAfterOpen={this.afterOpenModal}
						onRequestClose={this.closeModal}
						contentLabel="Player List"
						portalClassName="ws-modal-shit"
						className={{
							base: "ws-modal2",
							afterOpen: "ws-modal2_after-open",
							beforeClose: "ws-modal2_before-close"
						}}
						overlayClassName={{
							base: "ws-modal-overlay",
							afterOpen: "ws-modal-overlay_after-open",
							beforeClose: "ws-modal-overlay_before-close"
						}}
					>
						<ul className="player-list" onClick={this.closeModal}>
							<h3>
								{ (this.state.players.length > 1) 
									? "Send Card to:"
									: "You're the only one playing... so there's nobody to send this card to."
								}
							</h3>
							{this.state.players.map((player, index) => {
								// Return list of other players
								if ( this.state.currentName !== player){
									return (
										<li 
										className="player-destination" 
										key={`player-dest-${index}`}
										onClick={this.handleSend}
										data-player={player}
										>
										{player}
									</li>
								);
							}
							})}
						</ul>
					</Modal>
					<Modal
						isOpen={this.state.menuOpen}
						onAfterOpen={this.afterOpenMenu}
						onRequestClose={this.closeMenu}
						contentLabel="Waynomia Menu"
						portalClassName="ws-modal-shit ws-modal-menu dark-modal"
						className={{
							base: "ws-modal2",
							afterOpen: "ws-modal2_after-open",
							beforeClose: "ws-modal2_before-close"
						}}
						overlayClassName={{
							base: "ws-modal-overlay",
							afterOpen: "ws-modal-overlay_after-open",
							beforeClose: "ws-modal-overlay_before-close"
						}}
					>
						<h3 className="modal-title">Menu</h3>
						<section className="control-panel" onClick={this.closeMenu}>
							{status && (
								<div className="panel-section">
									{status !== "playing" && (
										<a className="ws-btn ws-green" onClick={this.handleEmit} data-socket-event="startGame" >
											Start Game
										</a>
									)}
									{status !== "open" && (
										<a className="ws-btn ws-danger" onClick={this.handleEmit} data-socket-event="openRoom" >
											End Game
										</a>
									)}
									{currentRoom && (
										<a className="ws-btn ws-warning" onClick={this.handleSocket} data-socket-event="leaveGame" >
											Leave Room
										</a>
									)}
								</div>
							)}
						</section>
					</Modal>
				{/* END ===================================== */}
			</div>
		);
	}
}
export default Game;



// Set Modal root
Modal.setAppElement("#app");

// Toast Styling
style({
	width: "320px",
	colorDefault: "#fff",
	colorInfo: "#3498db",
	colorSuccess: "#07bc0c",
	colorWarning: "#f1c40f",
	colorError: "#e74c3c",
	colorProgressDefault: "rgba(0,0,0,0.12)",
	mobile: "only screen and (max-width : 480px)",
	fontFamily: "inherit",
	zIndex: 999999
});

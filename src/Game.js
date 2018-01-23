import React from "react";
import { ToastContainer, toast, style } from "react-toastify";
import Modal from "react-modal";
import Helmet from "react-helmet";
import {
	Card,
	PlayerList,
	WildSuits,
	Winnings,
	ActivePile,
	MenuToggle,
	GameForm,
	BlanketModal,
	Swipe,
	Drag,
	MainMenu,
} from "./";
import API from "./utils/API";

const suitsArray = [
	"red",
	"orange",
	"brown",
	"yellow",
	"pink",
	"purple",
	"green",
	"blue",
];
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
			menuOpen: false
		};
	}
// componentDidMount =========================================
	componentDidMount = () => {
		// Socket Listeners ===============
		API.onMessage(msg => {
			console.log("💬", msg);

			// If msg is just a string, use default toast type
			if (typeof msg === "string") {
				toast(msg);
			} else {
				// If msg is an object, use the type of toast that is specified
				// let toastType = msg.type;
				// let toastText = msg.text;
				let {type,text} = msg;

				toast[type](text); // e.g. toast.error('Error Text!')
			}
		});

		API.onNewState(newState => {
			console.log("newState", newState);
			this.setState(newState);
		});

		API.onNewCard(newCard => {
			let { playerID, cardID } = newCard;
			console.log("playerID", playerID);
			console.log("cardID", cardID);

			if (playerID === this.state.currentName) {
				toast("Card Received");
				console.log("cardID", cardID);

				// Add to winnings pile
				let { winnings } = this.state;
				winnings.push(cardID);
				this.setState({
					winnings
				});
			} 
			else {
				console.log("card transferred between players", newCard);
			}
		});

		// Refresh Warning
		// window.addEventListener('beforeunload', (e) => {
		// 	var dialogText = 'NOOOOOOOO';
		// 	e.returnValue = dialogText;
		// 	return dialogText;
		// })

		// Disable mobile scroll
		// document.ontouchmove = function(e){ e.preventDefault(); }

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
			currentRoom: ""
		});
	};
// createGame ================================================
	createGame = e => {
		e.preventDefault();
		console.log("👉 createGame");
		let {room,player} = this.state;


		if (room && player){
			API.createGame(room, player, response => {
				console.log("👈", response);

				if (response.status === 'ok') {
					this.setState(response.newStates);
				}
				else {
					toast.error(response.message)
				}
			});
		}
		else {
			toast.error('Name & Room are both required')
		}
	};
// joinGame ==================================================
	joinGame = event => {
		event.preventDefault();
		console.log("👉 joinGame");
		let { room,player } = this.state;

		if (room && player){
			API.joinGame(room, player, response => {
				console.log("👈 joinGame", response);
				
				if (response.status === "ok") {
					this.setState(response.newStates);
				} else {
					toast.error(response.message);
				}
			});
		}
		else {
			toast.error('Name & Room are both required')
		}
	};
// endGame / openRoom  =======================================
	endGame = e => {
		e.preventDefault();
		console.log(`👉  endGame =>`);

		const { currentRoom, currentName } = this.state;

		API.openRoom(currentRoom);
	};
// startGame =================================================
	startGame = e => {
		e.preventDefault();
		console.log(`👉 startGame =>`);

		const { currentRoom, currentName } = this.state;

		API.startGame(currentRoom, currentName, response => {
			console.log("👈 startGame", response);

			if (response.status === "ok") {
				this.setState(response.newStates);
			} else {
				toast.error(response.message);
			}
		});
	};
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
// leaveGame ==============================================
	leaveGame = e => {
		e.preventDefault();
		console.log(`⚡️ leaveGame =>`);
		// const event = e.target.getAttribute("data-socket-event");
		const { currentRoom, currentName } = this.state;
		// console.log(`   * ${event}`);

		if (currentRoom && currentName) {
			API.leaveGame(currentRoom, currentName, response => {
				console.log("👀  leaveGame", response);
				this.setState(response);
			});
		} else {
			console.log("😧 no current room or name");
		}
	};
// portState =================================================
	portState = newState => this.setState(newState);
// updateWilds ===============================================
	updateWilds = wilds => API.updateState( this.state.currentRoom, {wilds} );
	
// handleTurn ================================================
	handleTurn = e => {
		e.preventDefault();

		// Turns increment steadily
		let currentTurn = this.state.turn;
		let turn = currentTurn + 1;
		let card = this.state.deck[turn]; // Next Card
		let { subject, suit, type, id } = card;
		console.log("card", card);
		let isWild = false;

		if (type === "wild") {
			subject = "Wild Card";
			this.setState({
				wilds: suit
			});
			this.updateWilds(suit);

			// Set isWild to true, which will be used for smart turn assistance feature
			isWild = true;
		} 

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
		let {currentRoom, currentName} = this.state;
		API.drawCard(currentRoom,currentName,isWild);
	};


// Main Menu =====================================================
	
	toggleMenu = e => { this.setState({ menuOpen: true }) };

	closeMenu = e => {
		const el = document.getElementById("app");
		el.classList.remove("blur-for-modal");
		this.setState({ menuOpen: false });
	};

// handleCard ================================================
	handleCard = e => {
		e.preventDefault();
		let el = e.target;

		// Traverse upwards until you find card element
		if (!el.classList.contains("card")) {
			let parent = el.parentNode;
			while (!parent.classList.contains("card")) {
				parent = parent.parentNode;
			}
			el = parent;
		}

		// console.log('el',el);
		const id = el.getAttribute("data-id");
		const type = el.getAttribute("data-type");
		const suit = el.getAttribute("data-suit");
		const subject = el.getAttribute("data-subject");
		const card = { id, type, suit, subject };
		// console.log('card',card);

		if (type === "wild") {
			let { cards } = this.state;
			let popped = cards.pop();
			this.setState({
				cards
			});
		} else {
			this.setState({
				isOpen: true,
				cardID: id
			});
		}
	};


// PlayerList Modal ==========================================
	afterOpenModal = () => {
		const rootEl = document.getElementById("app");
		rootEl.classList.add("blur-for-modal");
	};
	closeModal = () => {
		const rootEl = document.getElementById("app");
		rootEl.classList.remove("blur-for-modal");
		this.setState({ isOpen: false });
	};


// handleSend ================================================
	handleSend = e => {
		e.preventDefault();
		const el = e.target;
		const receiverID = el.getAttribute("data-player");
		const { cardID, currentRoom } = this.state;
		console.log(`Sending to ${receiverID}...`);

		this.closeModal();

		// Remove last card in pile
		let { cards } = this.state;
		cards.pop();
		this.setState({ cards });

		API.sendCard(currentRoom, receiverID, cardID, response => {
			// console.log('sendCard ==>',response);
			if (response.status === "ok") {
				toast(`Card sent to ${receiverID}`);
			} else {
				toast("Error sending card");
			}
		});
	};

// TEMP: Get Info ============================================
	getInfo = () => {
		API.getInfo(response => {
			console.log('getInfo =>',response)
		})
	}
	getStats = () => {
		API.getStats(response => {
			console.log('getStats =>',response)
		})
	}
// TODO: Store Locally =======================================
	storeData = () => {
		const stateString = JSON.stringify(this.state);
		console.log("stateString:", stateString);
		// Store in Session Storage
		sessionStorage.setItem("amnesia", stateString);
	};
	fetchData = e => {
		e.preventDefault();
		const fetched = JSON.parse(sessionStorage.getItem("amnesia"));
		console.log("fetched:", fetched);
	};
// RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	render() {
		let {
			status,
			currentRoom,
			currentName,
			players,
			cards,
			winnings,
			wilds,
		} = this.state;

		return (
			<div id="game-root" className="socket ">


			{/* Testing ========================= */}
				{/* <Swipe>
						SWIPE
					</Swipe> */}
					
			{/* Focal Point / Spotlight ======================== */}
				<div className="focal-point card-background">
					{/* Landing State */}
					{!currentRoom && (
						<GameForm portState={this.portState} joinGame={this.joinGame} createGame={this.createGame} /> )}
					
					{/* Waiting Lobby State */}
					{status === "open" && (
						<PlayerList
						players={this.state.players}
						currentName={currentName}
						>
							<a
								className="ws-btn ws-green"
								onClick={this.startGame}
								>
								{" "}
								Start Game{" "}
							</a>
						</PlayerList>
					)}
		
					{/* Active Game State */}
					{cards.length !== 0 && (
						<ActivePile cards={this.state.cards} onClick={this.handleCard} portState={this.portState} /> )}
					{status === "playing" && (
						// <Drag> 
						// 	<a id="flip" className="ws-btn action" onClick={this.handleTurn} >Flip</a> 
						// </Drag>
						// <div className="card-background">
							<a id="flip" className="ws-btn action" onClick={this.handleTurn} >Flip</a> 
						// </div> 
					)}
				</div>


			{/* Subheadline ======================== */}
				{status === 'open' && (
					<h4 className="subheadline">Once the whole gang's here, Press "Start"</h4> )}

			{/* Bottom Section Level =============================== */}
				<section className="level">
					{/* Burger Menu Button */}
					<MenuToggle onClick={this.toggleMenu} />
					
					{/* Globally Active Wilds (if applicable) */}
					{(status === "playing" && wilds.length === 2) && (
						<WildSuits wilds={this.state.wilds} />
					)}
					
					{/* Temporary =========== */}
					{/* {suitsArray.map( (suit,index) => { <div className={"suit-area"} key={'suitarea-'+index} > <div className={"acon suit "+suit}/> </div> })} */}

					{/* Winnings */}
					{status === "playing" && (
						<Winnings winnings={this.state.winnings} />
					)}
				</section>

			{/* Not Visible ================================== */}
				<div className="ghost">
					<ToastContainer autoClose={1500} hideProgressBar={true} closeButton={false} />
				</div>
				<Helmet title={"Amnesia" + (currentRoom && ` (${currentRoom})`)} />

			{/* Player Modals =================================== */}
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
					onClick={this.closeModal}
				>
					<div className="modal-container limited-container">
					
					<ul className="player-list">
						<h3>
							{this.state.players.length > 1
								? "Send Card to:"
								: "You're the only one playing... so there's nobody to send this card to."}
						</h3>
						{this.state.players.map((player, index) => {
							// Return list of other players
							if (this.state.currentName !== player) {
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
					</div>
				</Modal>

			{/* Main Menu ================================ */}
				<Modal
					isOpen={this.state.menuOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeMenu}
					contentLabel="Amnesia Menu"
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
					<MainMenu
						status={status}
						currentRoom={currentRoom}
						currentName={currentName}
						winnings={winnings}
						closeMenu={this.closeMenu}
						leaveGame={this.leaveGame}
						startGame={this.startGame}
						endGame={this.endGame}
						getInfo={this.getInfo}
					/>
				</Modal>
				{/* END ===================================== */}
			</div>
		);
	}
}
export default Game;


// Toast Styling
style({
	width: "320px",
	colorDefault: "#ffffff",
	colorInfo: "#3498db",
	colorSuccess: "#2ecc71",
	colorWarning: "#f1c40f",
	colorError: "#e74c3c",
	colorProgressDefault: "rgba(0,0,0,0.12)",
	mobile: "only screen and (max-width : 480px)",
	fontFamily: "inherit",
	zIndex: 999999
});



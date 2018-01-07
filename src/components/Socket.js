import React from "react";
import { Game, Card } from "../";
import API from "../utils/API";
import { ToastContainer, toast, style } from "react-toastify";
import Modal from "react-modal";

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
	colorProgressDefault: "rgba(0,0,0,0.24)",
	mobile: "only screen and (max-width : 480px)",
	fontFamily: "inherit",
	zIndex: 999999
});

class Socket extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: "",
			room: "",
			status: "",
			currentRoom: "",
			currentName: "",
			turn: -1,
			players: ["apple", "banana", "cookie"],
			wilds: [],
			cards: [],
			winnings: [],

			subject: "",
			type: "regular",
			suit: "",

			cardSelected: false,
			isOpen: false
		};
	}
// componentDidMount =========================================
	componentDidMount = () => {
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
			} else {
				console.log('card transferred between players',newCard);
			}
		})

		////////////////////////////////////////////////////
		// TODO: FETCH FROM COOKIES OR LOCAL STORAGE
		////////////////////////////////////////////////////
	};
// createGame ================================================
	createGame = e => {
		e.preventDefault();
		console.log("---> createGame");
		// const room = document.getElementById("room").value.trim() || "yo";
		// const player = document.getElementById("player").value.trim() || "wc";

		let { room = "yo", player = "wc" } = this.state;

		API.createGame(room, player, response => {
			console.log("response", response);
			this.setState(response);
		});
	};
// joinGame ==================================================
	joinGame = event => {
		event.preventDefault();
		console.log("---> joinGame");
		// const room = document.getElementById("room").value.trim() || "yo";
		// const player = document.getElementById("player").value.trim() || "wc";
		let { room = "yo", player = "wc" } = this.state;
		console.log("room:", room);
		console.log("player:", player);

		API.joinGame(room, player, response => {
			console.log("👂", response);
			if (response.status === 'error'){
				console.log('response.message',response.message);
				toast(response.message)
			}
			else {
				this.setState(response);
			}
		});
	};
// handleEmit ================================================
	handleEmit = e => {
		e.preventDefault();
		console.log(`>>>> handleEmit --->`);
		const event = e.target.getAttribute("data-socket-event");
		const { currentRoom, currentName } = this.state;
		console.log(`   > ${event}`);

		if (currentRoom && currentName) {
			API[event](this.state.currentRoom, currentName);
		} else {
			console.log("no current room or name");
		}
	};
// handleSocket ==============================================
	handleSocket = e => {
		e.preventDefault();
		console.log(`>>>> handleSocket --->`);
		const event = e.target.getAttribute("data-socket-event");
		const { currentRoom, currentName } = this.state;
		console.log(`   * ${event}`);

		if (currentRoom && currentName) {
			API[event](this.state.currentRoom, currentName, response => {
				console.log("response", response);
				this.setState(response);
				// this.getStats();
			});
		} else {
			console.log("no current room or name");
		}
	};
// handleChange ==============================================
	handleChange = event => {
		event.preventDefault();
		const { name, value } = event.target;
		this.setState({
			[name]: value
		});
	};
// updateGroup ===============================================
	updateGroup = () => {
		// e.preventDefault();
		console.log("update group");
		let { currentRoom, currentName } = this.state;
		API.drawCard(currentRoom);
	};
// updateWilds ===============================================
	updateWilds = wilds => {
		// e.preventDefault();
		console.log("update group");
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
		let { subject, suit, type } = card;

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
		cards.unshift(card);

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

		console.log('card',card);

		this.setState({
			isOpen: true,
			cardID: id,
		});
	};
// handleModalTrigger ========================================
	handleModalTrigger = event => {
		event.preventDefault();
		this.setState({
			isOpen: true
		});
	};
// afterOpenModal ============================================
	afterOpenModal = event => {
		const rootEl = document.getElementById("app");
		rootEl.classList.add("blur-for-modal");
	};
// closeModal ================================================
	closeModal = e => {
		const rootEl = document.getElementById("app");
		rootEl.classList.remove("blur-for-modal");
		this.setState({ isOpen: false });
	};
// handleSend ================================================
	handleSend = e => {
		e.preventDefault();
		const el = e.target;
		const receiverID = el.getAttribute('data-player');
		const { cardID, currentRoom } = this.state;
		console.log(`Sending to ${receiverID}...`);

		this.closeModal();
		
		API.sendCard(currentRoom,receiverID,cardID, response => {
			console.log('response',response);
			if (response.status === 'ok'){
				toast(`Card sent to ${receiverID}`)
			}
			else {
				toast('Error sending card')
			}
		})
	};
// RENDER ====================================================

	render() {
		let { status, currentRoom, currentName } = this.state;

		return (
			<div id="game-root" className="socket ">
			{/* Control Panel=============================== */}
				<section className="control-panel">
				{/* Game/Room =============================== */}
					{status && (
						<div className="panel-section">
							<p>Game</p>
							{status !== "playing" && (
								<a
									className="ws-btn ws-mini"
									onClick={this.handleEmit}
									data-socket-event="startGame"
								>
									Start
								</a>
							)}
							{currentRoom && (
								<a
									className="ws-btn ws-mini"
									onClick={this.handleSocket}
									data-socket-event="leaveGame"
								>
									Leave
								</a>
							)}
							{status !== "open" && (
								<a
									className="ws-btn ws-mini"
									onClick={this.handleEmit}
									data-socket-event="openRoom"
								>
									Open
								</a>
							)}
						</div>
					)}
				{/* General =============================== */}
					{/* <div className="panel-section">
						<p>General</p>
						<a className="ws-btn ws-mini" onClick={this.handleSocket} data-socket-event="getStats">
							Get Stats
						</a>
					</div> */}
				</section>
			{/* Form =============================== */}
				{!currentRoom && (
					<form className="game-form">
						<div className="input-group">
							<input
								type="text"
								id="player"
								name="player"
								placeholder="Name"
								onChange={this.handleChange}
								value={this.state.player}
							/>
							<label htmlFor="player">Name</label>
						</div>
						<div className="input-group">
							<input
								type="text"
								id="room"
								name="room"
								placeholder="Room"
								onChange={this.handleChange}
								value={this.state.room}
							/>
							<label htmlFor="room">Room</label>
						</div>
						<div className="form-group">
							<button
								id="join"
								className="ws-btn ws-mini"
								type="submit"
								onClick={this.joinGame}
							>
								{" "}
								Join{" "}
							</button>
							<button
								id="new"
								className="ws-btn ws-mini"
								type="button"
								onClick={this.createGame}
							>
								{" "}
								New{" "}
							</button>
						</div>
					</form>
				)}
			{/* Wild Suits =============================== */}
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
			{/* props.children =============================== */}
				{this.props.children}
			{/* Pile =============================== */}
				<section className="pile" onClick={this.handleCard}>
					{this.state.cards.map((card, index) => {
						return <Card specs={card} key={index} />;
					})}
				</section>
			{/* Flip Button =============================== */}
				{status === 'playing' && (
					<a id="flip" className="ws-btn action" onClick={this.handleTurn}> Flip </a>
				)}
			{/* Log =============================== */}
				<ul className="log">
					{currentRoom && <li>{"room: " + currentRoom}</li>}
					{currentName && <li>{"player: " + currentName}</li>}
					{/* <li>{"status: " + status}</li> */}
					{/* <li>{"turn: " + this.state.turn}</li> */}
					{/* <li>{"subject: " + this.state.subject}</li> */}
					{/* <li>{"suit: " + this.state.suit}</li> */}
					{/* <li>
						<ul>
							{this.state.players.map((player, index) => {
								return <li key={`player-${index}`}>{player}</li>;
							})}
						</ul>
					</li> */}
				</ul>
			{/* Toasts =============================== */}
				<ToastContainer autoClose={1500} />

			{/* Modal =============================== */}
				<a className="ws-btn ws-primary" onClick={this.handleModalTrigger}> Open Modal </a>

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
					<ul className="player-list">
						<h3>Send Card to:</h3>
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
			{/* END =============================== */}
			</div>
		);
	}
}
export default Socket;

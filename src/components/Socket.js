import React from "react";
import {Game} from "../";
// import io from "socket.io-client";
// let socket = io({ autoConnect: false });
// const socket = io();
import API from '../utils/API';
import { ToastContainer, toast, style } from 'react-toastify';

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
	zIndex: 999999,
});

class Socket extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: '',
			room: '',
			status: '',
			currentRoom: '',
			currentName: '',
			turn: -1,
			players: [],
			wilds: [],
		};
	}
// componentDidMount ==================================================
	componentDidMount = () => {
		
		API.onMessage( msg => {
			console.log("   :", msg);
			toast(msg)
		});

		API.onNewState( newState => {
			console.log('newState',newState);
			this.setState(newState)
		})

		////////////////////////////////////////////////////
		// TODO: FETCH FROM COOKIES OR LOCAL STORAGE
		////////////////////////////////////////////////////



	};
// createGame ==================================================
	createGame = e => {
		e.preventDefault();
		console.log("---> createGame");
		// const room = document.getElementById("room").value.trim() || "yo";
		// const player = document.getElementById("player").value.trim() || "wc";

		let { room = 'yo' , player = 'wc' } = this.state;

		API.createGame(room,player, (response) => {
			console.log('response',response);
			this.setState(response)
		})
	};
// joinGame ==================================================
	joinGame = event => {
		event.preventDefault();
		console.log("---> joinGame");
		// const room = document.getElementById("room").value.trim() || "yo";
		// const player = document.getElementById("player").value.trim() || "wc";
		let { room = "yo" , player = "wc"} = this.state;
		console.log('room:',room)
		console.log('player:',player)

		API.joinGame(room,player, (response) => {
			console.log('response',response);
			this.setState(response)
		})
	};
// handleEmit ==================================================
	handleEmit = e => {
		e.preventDefault();
		console.log(`>>>> handleEmit --->`);
		const event = e.target.getAttribute('data-socket-event');
		const { currentRoom, currentName } = this.state;
		console.log(`   > ${event}`);

		if (currentRoom && currentName){
			API[event](this.state.currentRoom, currentName)
		}
		else {
			console.log('no current room or name');
		}
	}
// handleSocket ==================================================
	handleSocket = e => {
		e.preventDefault();
		console.log(`>>>> handleSocket --->`);
		const event = e.target.getAttribute('data-socket-event');
		const { currentRoom, currentName } = this.state;
		console.log(`   * ${event}`);

		if (currentRoom && currentName){
			API[event](this.state.currentRoom, currentName, response => {
				console.log('response',response);
				this.setState(response)
				// this.getStats();
			})
		}
		else {
			console.log('no current room or name');
		}
	}
// startGame ==================================================
	// startGame = e => {
	// 	e.preventDefault();
	// 	console.log('---> startGame');
	// 	API.startGame(this.state.currentRoom);
	// 	this.getStats();
	// }
// openRoom ==================================================
	// openRoom = e => {
	// 	e.preventDefault();
	// 	console.log('---> openRoom');
	// 	API.openRoom(this.state.currentRoom);
	// 	this.getStats();
	// }
// leaveGame ==================================================
	// leaveGame = e => {
	// 	e.preventDefault();
	// 	console.log('---> openRoom');
	// 	API.leaveGame(this.state.currentRoom);
	// 	this.getStats();
	// }
// getStats ==================================================
	// getStats = () => {
	// 	let {currentRoom, currentName} = this.state;
	// 	API.getStats(currentRoom,currentName, response => {
	// 		console.log('response',response);
	// 		this.setState(response)
	// 	})
	// };
// handleChange ==================================================
	handleChange = (event) => {
		event.preventDefault();
		const { name, value } = event.target;
		this.setState({
			[name]: value
		})
	}
// handleUpdate ==================================================
	handleUpdate = () => {
		// e.preventDefault();
		console.log('update group');
		let {currentRoom,currentName} = this.state;
		API.drawCard(currentRoom);
	}
// handleWilds ==================================================
	handleWilds = (wilds) => {
		// e.preventDefault();
		console.log('update group');
		let {currentRoom,currentName} = this.state;
		let newState = {
			wilds
		}
		API.updateState(currentRoom, newState);
	}
//==================================================

	render() {
		return <div className="socket">
				<section className="control-panel">
					<div className="panel-section">
						<p>Game/Room</p>
						<a className="ws-btn ws-mini" onClick={this.handleEmit} data-socket-event="createGame">
							Create
						</a>
						<a className="ws-btn ws-mini" onClick={this.handleEmit} data-socket-event="startGame">
							Start
						</a>
						<a className="ws-btn ws-mini" onClick={this.handleSocket} data-socket-event="leaveGame">
							Leave
						</a>
						<a className="ws-btn ws-mini" onClick={this.handleEmit} data-socket-event="openRoom">
							Open
						</a>
					</div>
					<div className="panel-section">
						<p>Actions</p>
						<a className="ws-btn ws-mini" onClick={this.handleEmit} data-socket-event="drawCard">
							Draw Card
						</a>
					</div>
					<div className="panel-section">
						<p>General</p>
						<a className="ws-btn ws-mini" onClick={this.handleSocket} data-socket-event="getStats">
							Get Stats
						</a>
					</div>
				</section>
				<form className="game-form">
					<label>
						{" "}
						Name
						<input type="text" id="player" name="player" onChange={this.handleChange} value={this.state.player} />
					</label>
					<label>
						{" "}
						Room
						<input type="text" id="room" name="room" onChange={this.handleChange} value={this.state.room} />
					</label>
					<div className="panel-section">
						<button id="new" className="ws-btn ws-mini" type="button" onClick={this.createGame}>
							New
						</button>
						<button id="join" className="ws-btn ws-mini" type="submit" onClick={this.joinGame}>
							Join
						</button>
					</div>
				</form>

				<ToastContainer autoClose={2400} />

				<Game turn={this.state.turn} deck={this.state.deck} wilds={this.state.wilds} updateGroup={this.handleUpdate} updateWilds={this.handleWilds} />

				{this.props.children}

				<ul className="log">
					<li>{"room: " + this.state.currentRoom}</li>
					<li>{"player: " + this.state.currentName}</li>
					<li>{"status: " + this.state.status}</li>
					<li>{"turn: " + this.state.turn}</li>
					<li>
						{this.state.players.map((player, index) => {
							return <p key={`player-${index}`}>{player}</p>;
						})}
					</li>
				</ul>
			</div>;
	}
}
export default Socket;

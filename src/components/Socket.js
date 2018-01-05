import React from "react";
// import io from "socket.io-client";
// let socket = io({ autoConnect: false });
// const socket = io();
import API from '../utils/API';

class Socket extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: '',
			room: '',
			status: 'open',
			currentRoom: '',
			currentName: '',
			
		};
	}
// componentDidMount ==================================================
	componentDidMount = () => {

		// socket.on("msg", msg => {
		// 	console.log("msg:", msg);
		// 	let el = document.createElement("li");
		// 	el.classList.add("msg");
		// 	el.innerHTML = msg;

		// 	let feedEl = document.getElementById("feed");
		// 	feedEl.appendChild(el);
		// });
		API.onMessage( msg => {
			console.log("::::", msg);
			let el = document.createElement("li");
			el.classList.add("msg");
			el.innerHTML = msg;

			let feedEl = document.getElementById("feed");
			feedEl.appendChild(el);
		});

		////////////////////////////////////////////////////
		// TODO: FETCH FROM COOKIES OR LOCAL STORAGE
		////////////////////////////////////////////////////



	};
// joinGame ==================================================
	joinGame = event => {
		event.preventDefault();
		console.log("---> joinGame");
		const room = document.getElementById("room").value.trim() || "yo";
		const player = document.getElementById("player").value.trim() || "wc";

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
		console.log(`   > ${event}`);

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
	startGame = e => {
		e.preventDefault();
		console.log('---> startGame');
		API.startGame(this.state.currentRoom);
		this.getStats();
		// API.startGame(this.state.currentRoom, response => {
		// 	console.log('response',response);
		// 	this.setState(response)
		// })
	}
// openRoom ==================================================
	openRoom = e => {
		e.preventDefault();
		console.log('---> openRoom');
		API.openRoom(this.state.currentRoom);
		this.getStats();
		// API.openRoom(this.state.currentRoom, response => {
		// 	console.log('response',response);
		// 	this.setState(response)
		// })
	}
// leaveGame ==================================================
	leaveGame = e => {
		e.preventDefault();
		console.log('---> openRoom');
		API.openRoom(this.state.currentRoom);
		this.getStats();
		// API.openRoom(this.state.currentRoom, response => {
		// 	console.log('response',response);
		// 	this.setState(response)
		// })
	}
// getStats ==================================================
	getStats = () => {
		let {currentRoom, currentName} = this.state;
		API.getStats(currentRoom,currentName, response => {
			console.log('response',response);
			this.setState(response)
		})
		// socket.emit("stats", (res) => console.log("res:", res));
	};
// handleChange ==================================================
	handleChange = (event) => {
		event.preventDefault();
		const { name, value } = event.target;
		this.setState({
			[name]: value
		})
	}
//==================================================

	render() {
		return (
			<div className="socket">
				<form className="game-form">
					<label> Name
						<input type="text" id="player" name="player" onChange={this.handleChange} value={this.state.player}/>
					</label>
					<label> Room
						<input type="text" id="room" name="room" onChange={this.handleChange} value={this.state.room}/>
					</label>
					{/* <button
							id="new"
							className="ws-btn ws-mini"
							type="button"
							onClick={this.createNewGame}
						>
							New
						</button> */}
					<button id="join" className="ws-btn ws-mini" type="submit" onClick={this.joinGame} >
						Join
					</button>
				</form>
				<section className="control-panel">
				<a className="ws-btn ws-mini" onClick={this.handleSocket} data-socket-event="leaveGame" >Leave Game</a>
				<a className="ws-btn ws-mini" onClick={this.handleEmit}   data-socket-event="openRoom"  >Open Room</a>
				<a className="ws-btn ws-mini" onClick={this.handleEmit}   data-socket-event="startGame" >Start Game</a>
				<a className="ws-btn ws-mini" onClick={this.handleSocket} data-socket-event="getStats"  >Get Stats</a>
				{/* <a className="ws-btn ws-mini" data-socket-event="leaveRoom" onClick={this.leaveRoom}>Leave Room</a>
				<a className="ws-btn ws-mini" data-socket-event="openRoom"  onClick={this.openRoom} >Open Room</a>
				<a className="ws-btn ws-mini" data-socket-event="startGame" onClick={this.startGame}>Start Game</a>
				<a className="ws-btn ws-mini" data-socket-event="getStats"  onClick={this.getStats} >Get Stats</a> */}
				</section>

				<section id="msg-container" className="feed-container">
					<ul id="feed" className="feed">
						<li className="msg">messages go here</li>
					</ul>
				</section>


				<ul className="log">
					<li>{"room: " + this.state.currentRoom}</li>
					<li>{"player: " + this.state.currentName}</li>
					<li>{"status: " + this.state.status}</li>
				</ul>
			</div>
		);
	}
}
export default Socket;

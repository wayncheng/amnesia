import React from "react";
import io from "socket.io-client";
// let socket = io({ autoConnect: false });
const socket = io();
import API from '../utils/API';

class Socket extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: '',
			room: '',
			currentRoom: '',
		};
	}
	componentDidMount = () => {

		socket.on("msg", msg => {
			console.log("msg:", msg);
			let el = document.createElement("li");
			el.classList.add("msg");
			el.innerHTML = msg;

			let feedEl = document.getElementById("feed");
			feedEl.appendChild(el);
		});
		// API.onMessage( msg => {
		// 	console.log("::::", msg);
		// 	let el = document.createElement("li");
		// 	el.classList.add("msg");
		// 	el.innerHTML = msg;

		// 	let feedEl = document.getElementById("feed");
		// 	feedEl.appendChild(el);
		// });
	};

	joinGame = event => {
		event.preventDefault();
		console.log("---> joinGame");
		const room = document.getElementById("room").value.trim() || "purgatory";
		const player = document.getElementById("player").value.trim() || "wc";

		API.joinGame(room,player)
	};

	getStats = () => {
		API.getStats()
		// socket.emit("stats", (res) => console.log("res:", res));
	};

	handleChange = (event) => {
		event.preventDefault();
		const { name, value } = event.target;
		this.setState({
			[name]: value
		})
	}

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
					<button
						id="join"
						className="ws-btn ws-mini"
						type="submit"
						onClick={this.joinGame}
					>
						Join
					</button>
				</form>
				<a className="ws-btn" onClick={this.getStats}>Stats</a>
				<section id="msg-container" className="feed-container">
					<ul id="feed" className="feed">
						<li className="msg">messages go here</li>
					</ul>
				</section>
			</div>
		);
	}
}
export default Socket;

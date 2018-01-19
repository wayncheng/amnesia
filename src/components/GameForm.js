import React, { Component } from "react";

class GameForm extends Component {
	constructor(props) {
		super(props);
		this.state={
			player: '',
			room: '',
		}
	}

	componentDidMount = () => {
		// Set focus to player input field by default
		document.getElementById('player').focus();
	}

	// handleChange ==============================================
	handleChange = event => {
		event.preventDefault();
		const { name, value } = event.target;
		
		let newState = {
			[name]: value.trim().toLowerCase()
		}

		this.setState(newState)
		
		this.props.portState(newState)
	};


	render() {
		return (
			<div className="card-background focal-point">
				<form className="game-form">
					<div className="form-info">
						<h4 className="form-headline">Amnesia</h4>
					</div>
					<div className="input-group">
						<input
							id="player"
							type="text"
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
							className="ws-btn "
							type="submit"
							onClick={this.props.joinGame}
						>
							{" "}
							Join{" "}
						</button>
						<button
							id="new"
							className="ws-btn "
							type="button"
							onClick={this.props.createGame}
						>
							{" "}
							New{" "}
						</button>
					</div>
				</form>
			</div>
		);
	}
}
export default GameForm;

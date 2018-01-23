import React, {Component} from 'react'


class MainMenu extends Component {
	constructor(props){
		super(props)
		this.state = {}
	}

	render(){

		let { status, currentRoom, currentName, winnings, closeMenu, leaveGame, startGame, endGame, getInfo } = this.props;

		return(
			<div className="modal-container menu-modal" onClick={closeMenu}>
				<header className="modal-header">
					<h3 className="modal-title">Amnesia Menu</h3>
				</header>
				<section className="control-panel modal-section">
					{status && (
						<div className="panel-section">

							{/* Leave Game */}
							{currentRoom && (
								<a className="ws-btn ws-warning" onClick={leaveGame} >Leave</a> )}

							{/* Start Game */}
							{status !== "playing" && (
								<a className="ws-btn ws-green" onClick={startGame} >Start</a> )}

							{/* End Game / Open Room */}
							{status !== "open" && (
								<a className="ws-btn ws-danger" onClick={endGame} >End</a> )}

						</div>
					)}

					{status && (
						<div className="panel-section aligned-left">
							<p className="panel-text">
								<span className="text-label">Room:</span> {currentRoom}
							</p>
							<p className="panel-text">
								<span className="text-label">Name:</span> {currentName}
							</p>

							{status === "playing" && (
								<p className="panel-text">
									<span className="text-label">Cards Won: </span> {winnings.length}
								</p>
							)}
						</div>
					)}
					
					<footer className="modal-footer">
						<a href="#!" onClick={getInfo} >Info</a>
					</footer>
				</section>
			</div>
		)
	}
}
export default MainMenu
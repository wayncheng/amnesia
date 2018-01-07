import React from "react";

const PlayerList = props => {
	return (
		<ul className="roll-call-list">
			{props.players.map((player, index) => {
					return (
						<li
							className="player-in-lobby"
							key={`player-${index}`}
							data-player={player}
						>
							{ player }
							{ props.currentName === player && ' (you!)'}
						</li>
					);
				
			})}
		</ul>
	);
};
export default PlayerList;

PlayerList.defaultProps = {
	players: [],
	currentName: '',
}
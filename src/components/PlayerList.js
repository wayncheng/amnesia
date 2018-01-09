import React from "react";

const PlayerList = props => {
	return (
		<section className="roll-call container">
			<h4 className="section-title">Who's Here</h4>
			<ul className="roll-call-list">
				{props.players.map((player, index) => {
					return (
						<li
							className="player-in-lobby"
							key={`player-${index}`}
							data-player={player}
						>
							{player}
							{props.currentName === player && "  (you!)"}
						</li>
					);
				})}
			</ul>
		</section>
	);
};
export default PlayerList;

PlayerList.defaultProps = {
	players: [],
	currentName: ""
};

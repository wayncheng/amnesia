import React from "react";

const Winnings = props => {
	return (
		<aside className="winnings" data-wins={props.winnings.length}>
			{props.winnings.length}
		</aside>
	);
};
export default Winnings;

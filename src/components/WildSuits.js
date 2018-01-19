import React from "react";

const WildSuits = props => {
	return (
		<section className="wild-suit-area">
			{props.wilds.map((suit, index) => {
				let id = "wild-" + index;
				return (
					<div
						id={id}
						className={"acon wild-suit " + suit}
						data-suit={suit}
						key={id}
					/>
				);
			})}
		</section>
	);
};
export default WildSuits;

WildSuits.defaultProps = {
	wilds: []
};

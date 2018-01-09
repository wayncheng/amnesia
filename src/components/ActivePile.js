import React from "react"
import { Card } from "../"

const ActivePile = props => {
	return (
		<section className="pile" onClick={props.onClick}>
			{props.cards.map((card, index) => {
				return <Card specs={card} key={index} />;
			})}
		</section>
	);
};
export default ActivePile;

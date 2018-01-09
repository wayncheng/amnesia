import React, {Component} from "react"
import { Card } from "../"

class ActivePile extends Component {
	constructor(props){
		super(props);
		this.state={
			cards: [],
		}
	}

	// dismissCard = e => {
	// 	e.preventDefault();

	// 	let newPile = this.props.cards;
	// 	console.log('newPile.length',newPile.length);

	// 	newPile.pop();
	// 	console.log('newPile.length',newPile.length);
	// 	console.log('newPile',newPile);

	// 	this.props.portState({
	// 		cards: newPile
	// 	})
	// }

	render(){
		return (
			<section className="pile" onClick={this.props.onClick}>
				{this.props.cards.map((card, index) => {
					// return <Card specs={card} key={index} dismissCard={this.dismissCard} />;
					return <Card specs={card} key={index} />;
				})}
			</section>
		);
	}
};
export default ActivePile;

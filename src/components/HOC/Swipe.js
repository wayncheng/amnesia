import React, { Component } from "react";
import Swipeable from "react-swipeable";
// import { Card } from "../"

class Swipe extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	swiping = (e, deltaX, deltaY, absX, absY, velocity) => {
		// console.log("You're Swiping...", e, deltaX, deltaY, absX, absY, velocity)
	};

	swiped = (e, deltaX, deltaY, isFlick, velocity) => {
		console.log("swiped", e, deltaX, deltaY, isFlick, velocity);
	};

	// swipingRight = (e, absX) => { 	console.log("👉", absX);
	// 	console.log('e.target', e.target); }

	swipedRight = (e, deltaX, isFlick) => {
		console.log("👆➡ swipedRight");
		console.log("deltaX", deltaX);
	};

	swipedUp = (e, deltaY, isFlick) => {
		console.log("👆⬆ swipedUp");
		console.log("deltaY", deltaY);
	};

	render() {
		return (
			<Swipeable
				className="swipe-area"
				onSwiping={this.swiping}
				onSwiped={this.swiped}
				onSwipedUp={this.swipedUp}
				onSwipedRight={this.swipedRight}
				trackMouse={true}
			>
				{this.props.children}
			</Swipeable>
		);
	}
}
export default Swipe;

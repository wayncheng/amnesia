import React, { Component } from "react";
import Draggable from "react-draggable";

// import { Transition } from "react-transition-group";
// const transitionStyles = {
// 	entering: { transform: "translate(0,0)" }
// };

class Drag extends Component {
	constructor(props) {
		super(props);
		this.state = {
			x: 0,
			y: 0,
			dragStop: false
		};
	}

	handleStart = (e, data) => {
		let { deltaX, deltaY, lastX, lastY, x, y } = data;
		console.log(
			`START >>>> last (${lastX},${lastY}) / delta (${deltaX},${deltaY}) / xy (${x},${y})`
		);
	};

	handleDrag = (e, data) => {
		let { deltaX, deltaY, lastX, lastY, x, y } = data;
		// console.log(`DRAG >>>> last (${lastX},${lastY}) / delta (${deltaX},${deltaY}) / xy (${x},${y})`);
		this.setState({ x, y });
	};

	handleStop = (e, data) => {
		let { deltaX, deltaY, lastX, lastY, x, y, node } = data;
		console.log( `STOP >>>> last (${lastX},${lastY}) / delta (${deltaX},${deltaY}) / xy (${x},${y}) / ${node}` );

		let el = e.target;
		// el.classList.add("drag-end");

		// setTimeout(() => { }, 1000);
		console.log(`back to start pos...`);
		this.goHome();
		
		// el.classList.remove("drag-end");
	};

	goHome = () => {
		this.setState({ x: 0, y: 0 });
	}

	render() {
		let { x, y } = this.state;

		return (
			// <Transition in={this.state.dragStop} timeout={400}>
				<Draggable
					defaultClassName="draggable"
					defaultClassNameDragged="dragged"
					defaultClassNameDragging="dragging"
					axis="both"
					onDrag={this.handleDrag}
					onStart={this.handleStart}
					onStop={this.handleStop}
					handle=".draggable"
					defaultPosition={{ x: 0, y: 0 }}
					position={{ x, y }}
				>
					{/* <div className="drag-handle" > */}
						{/* <p>{`(${x},${y})`}</p> */}
						{this.props.children}
					{/* </div> */}
				</Draggable>
			// </Transition>
		);
	}
}
export default Drag;

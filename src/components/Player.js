import React from "react";
import io from 'socket.io-client';
const socket = io({
  autoConnect: false
});

class Player extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	componentDidMount = () => {

	}


	render() {
		return (
			<section className="player">
				
			</section>
		);
	}
}
export default Player;

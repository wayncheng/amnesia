import React from "react";
import { Game, Socket } from "./";

import subjects from './utils/subjects.json';
import suits from './utils/suits.json';


class GameBoard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount = () => {
		// console.log('subjects',subjects);
		// console.log('subjects.length',subjects.length);

	}


	render() {
		return (
			<Socket>
				<Game 
					deck={ subjects }
					players={[
						"Wayne",
						"Irene",
						"Angela",
						"Michelle"
					]}
				/>
			</Socket>
		);
	}
}
export default GameBoard;

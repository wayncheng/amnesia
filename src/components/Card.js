import React from "react";
import classnames from "classnames";
// regularCard = {
// 	type: 'regular',
// 	subject: 'poop',
// 	suit: 'green'
// }
// wildCard = {
// 	type: 'wild',
// 	suitA: 'blue',
// 	suitB: 'green'
// }

class Card extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			suit: "red"
		};
	}

	componentDidMount = () => {
		// let {type} = this.props.specs;
		// if (type === 'wild'){
		// }
	};

	render() {
		// let {type,suit,subject,id} = this.props;
		let { type, suit, subject, id } = this.props.specs;
		return (
			<div
				className={classnames("card", type)}
				data-type={type}
				data-suit={type === "regular" ? suit : "wild"}
			>
				<h3 className="subject">{subject || "Wild Card"}</h3>
				{type === "regular" ? (
					<div className={"suit-area"} >
						<div className={"suit "+suit}/>
					</div>
				) : (
					<div className="suit-area wild-area">
						<div className={`suit ${suit[0]}`} />
						<div className={`suit ${suit[1]}`} />
						{/* // <div className={classnames("suit", "wild", suit[1])} /> */}
					</div>
				)}
			</div>
		);
	}
}
export default Card;

Card.defaultProps = {
	subject: "(Subject)",
	suit: "?"
};

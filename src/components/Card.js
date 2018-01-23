import React, {Component} from "react";
import classnames from "classnames";

class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {
			suit: ""
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
				data-id={id}
				data-subject={subject}
			>
				<h3 className="subject">{subject || "Wild Card"}</h3>
				{type === "regular" 
					? (
						<div className={"suit-area"} >
							<div className={"acon suit "+suit}/>
						</div>
					) : (
						<div className="suit-area wild-area">
							<div className={`acon suit ${suit[0]}`} />
							<div className={`acon suit ${suit[1]}`} />
						</div>
					)
				}
			{/* <a className="ws-btn ws-primary dismiss-btn" onClick={this.props.dismissCard}> Dismiss </a>  */}
			</div>
		);
	}
}
export default Card;
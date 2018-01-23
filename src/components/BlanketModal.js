import React, {Component} from 'react'
import Modal from 'react-modal'

class BlanketModal extends Component {
	constructor(props){
		super(props)
		this.state = {
			isOpen: false, // closed by default
		}
	}

componentWillReceiveProps = (nextProps) => {
	if (nextProps.isOpen !== this.props.isOpen){
		this.setState({
			isOpen: nextProps.isOpen
		})
	}
}

// afterOpenModal ============================================
afterOpenModal = () => {
	const rootEl = document.querySelector(this.props.rootSelector);
	rootEl.classList.add("blur-for-modal");
};
// closeModal ================================================
closeModal = () => {
	const rootEl = document.querySelector(this.props.rootSelector);
	rootEl.classList.remove("blur-for-modal");

	// Send new state to parent which will set state and then pass
	// that new state back down as a prop, which will be set in componentWillReceiveProps
	this.props.portState({
		isOpen: false
	})
};

// toggleModal ================================================
toggleModal = e => {
	this.setState({ 
		isOpen: true 
	});
};


	render(){
		return(
			<Modal
					isOpen={this.state.isOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					contentLabel={this.props.contentLabel}
					portalClassName={this.props.portalClassName}
					className={this.props.className}
					overlayClassName={this.props.overlayClassName}
				>
					{this.props.children}

				</Modal>
		)
	}
}
export default BlanketModal;

BlanketModal.defaultProps = {
	isOpen: false,
	rootSelector: '#app',
	portalClassName: 'ws-modal-shit',
	className: {
		base: "ws-modal2",
		afterOpen: "ws-modal2_after-open",
		beforeClose: "ws-modal2_before-close"
	},
	overlayClassName: {
		base: "ws-modal-overlay",
		afterOpen: "ws-modal-overlay_after-open",
		beforeClose: "ws-modal-overlay_before-close"
	},
}


// Set Modal root
Modal.setAppElement("#app");
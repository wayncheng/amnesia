import React from "react"

const MenuToggle = props => {
	return (
		<a id="menu-toggle" className="burger-menu icon-wrap" alt="Open Menu" onClick={props.onClick} >
			<i className="acon acon-bars icon-burger-menu menu-icon"></i>
			{/* <img className="icon-burger-menu menu-icon" src="/graphics/burger-black-a-round.svg" alt="Menu Toggle"/> */}
		</a>
	);
};
export default MenuToggle;

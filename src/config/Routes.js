import React from "react";
import { Route, BrowserRouter, HashRouter, Switch, Redirect } from "react-router-dom";
import { 
	GameBoard,
	Socket, 
} from "..";


const Routes = (
		<BrowserRouter >
        <Switch>
            <Route path="/io" component={Socket} />
            <Route exact path="/" component={GameBoard} />
            <Route component={NoMatch} />
        </Switch>
    </BrowserRouter>
);
export default Routes;

const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
)
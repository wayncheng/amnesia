import React from "react";
import { Route, BrowserRouter, HashRouter, Switch, Redirect } from "react-router-dom";
import { Game } from "../";


const Routes = (
		<BrowserRouter >
        <Switch>
            <Route exact path="/" component={Game} />
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
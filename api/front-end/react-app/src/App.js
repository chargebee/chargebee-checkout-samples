import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import CheckoutNew from "./CheckoutNew.js";
import CheckoutExisting from "./CheckoutExisting";

class App extends Component {

  constructor(props) {
    super(props);
  }
 

  render() {
    return (<Router>
      <div>
        <Switch>
          <Route path="/checkout-new" component={CheckoutNew} />
          <Route path="/checkout-existing" component={CheckoutExisting}>
          </Route>
          <Route exact path="/" component={CheckoutNew} />
        </Switch>
      </div>
    </Router>)
  }
}

export default App;

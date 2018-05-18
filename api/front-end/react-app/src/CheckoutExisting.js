import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route, Link } from "react-router-dom";
import CheckoutExistingLogin from "./CheckoutExistingLogin";
import CheckoutExistingUpgrade from "./CheckoutExistingUpgrade";


export default class CheckoutExisting extends Component {
  componentWillMount() {
    this.props.history.push("/checkout-existing");
  }
  render() {
    return <Router>
      <div>
        <Switch>
          <Route path="/checkout-existing/login" component={CheckoutExistingLogin} />
          <Route path="/checkout-existing/profile" component={CheckoutExistingUpgrade}/>
          <Route exact path="/checkout-existing" component={CheckoutExistingLogin}/>
          <Route exact path="/checkout-existing/" component={CheckoutExistingLogin}/>
        </Switch>
      </div>
    </Router>
    // return <a href="javascript:void(0)" className="btn btn-success btn-lg" data-cb-type="checkout" data-cb-plan-id="comics-box" >subscribe</a>
  }
}
import React, { Component } from 'react';
import { Switch, HashRouter as Router, Route } from "react-router-dom";
import Example1 from "./components/example1/Example1.js";
import Example2 from "./components/example2/Example2.js";
import Example3 from "./components/example3/Example3.js";
import Example4 from "./components/example4/Example4.js";

class App extends Component {
  constructor(props) {
    super(props)
    window.Chargebee.init({
      site: "mannar-test",
      domain: "http://mannar-test.localcb.in:8080/",
      publishableKey: "test___dev__eZSpoLTEeykvCIfU9EOospwczgQLlGhJ"
    })
  }

  render() {
    return (
      <Router basename="/react/">
        <Switch>
          <Route path="/example1" component={Example1} />
          <Route path="/example2" component={Example2} />
          <Route path="/example3" component={Example3} />
          <Route path="/example4" component={Example4} />
          <Route exact path="/" component={Example1} />
        </Switch>
      </Router>
    )
  }
}

export default App;

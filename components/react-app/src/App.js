import React, { Component } from 'react';
import { Switch, HashRouter as Router, Route } from "react-router-dom";
import Example1 from "./components/example1/Example1.js";
import Example2 from "./components/example2/Example2.js";
import Example3 from "./components/example3/Example3.js";

class App extends Component {
  constructor(props) {
    super(props)
    window.Chargebee.init({
      site: "honeycomics-v3-test",
      publishableKey: "test_qoH22RugUvm5IcxoqUD5Svdcu9mX5figf"
    })
  }

  render() {
    return (<Router basename="/react/">
      <div>
        <Switch>
          <Route path="/example1" component={Example1} />
          <Route path="/example2" component={Example2} />
          <Route path="/example3" component={Example3} />
          <Route exact path="/" component={Example1} />
        </Switch>
      </div>
    </Router>)
  }
}

export default App;

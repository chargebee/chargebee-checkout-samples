import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const urlEncode = function(data) {
  var str = [];
  for (var p in data) {
      if (data.hasOwnProperty(p) && (!(data[p] == undefined || data[p] == null))) {
          str.push(encodeURIComponent(p) + "=" + (data[p] ? encodeURIComponent(data[p]) : ""));
      }
  }
  return str.join("&");
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {cbInstance: window.Chargebee.init({
      site: "vivek1-test"
    })};

    this.state.cbInstance.setPortalSession(() => {
      // we have used axios for performing http requests
            // Hit your end point that returns portal session object as response
      // This sample end point will call the below api
      // https://apidocs.chargebee.com/docs/api/portal_sessions#create_a_portal_session
      return axios.post("http://localhost:8000/api/generate_portal_session", urlEncode({})).then((response) => response.data);
    });

    this.handleCheckout = this.handleCheckout.bind(this);
    this.handleCheckoutExisting = this.handleCheckoutExisting.bind(this);
    this.handlePortal = this.handlePortal.bind(this);
    this.handleUpdatePM = this.handleUpdatePM.bind(this);
  }
  
  handleCheckout() {
    this.state.cbInstance.openCheckout({
      hostedPage() {
        return axios.post("http://localhost:8000/api/generate_checkout_new_url", urlEncode({plan_id: "cbdemo_scale"})).then((response) => response.data)
      },
      success(hostedPageId) {
        console.log(hostedPageId);
      },
      close() {
        console.log("checkout new closed");
      },
      step(step) {
        console.log("checkout", step);
      }
    })
  }

  handleCheckoutExisting() {
    this.state.cbInstance.openCheckout({
      hostedPage() {
        return axios.post("http://localhost:8000/api/generate_checkout_existing_url", urlEncode({plan_id: "cbdemo_scale"})).then((response) => response.data)
      },
      success(hostedPageId) {
        console.log(hostedPageId);
      },
      close() {
        console.log("checkout existing closed");
      },
      step(step) {
        console.log("checkout existing", step);
      }
    });
  }

  handlePortal() {
    this.state.cbInstance.createChargebeePortal().open({
      visit(visit) {
        console.log("portal visit", visit);
      }
    });
  }

  handleUpdatePM() {
    this.state.cbInstance.openCheckout({
      hostedPage() {
        return axios.post("http://localhost:8000/api/generate_update_payment_method_url", urlEncode({plan_id: "cbdemo_scale"})).then((response) => response.data)
      },
      close() {
        console.log("update payment method closed");
      }
    });
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title"></h1>
        </header>
        <div className="bodyContainer">
          <a href="#" onClick={this.handleCheckout}>Subscribe</a>
          <a href="#" onClick={this.handleCheckoutExisting}>Upgrade</a>
          <a href="#" onClick={this.handlePortal}>Customer Portal</a>
          <a href="#" onClick={this.handleUpdatePM}>Update payment method</a>
        </div>
      </div>
    );
  }
}

export default App;

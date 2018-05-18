import React, { Component } from 'react';
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

export default class CheckoutExistingUpgrade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cbInstance: window.Chargebee.init({
        site: "honeycomics-v3-test"
      }),
      loading: "",
      errorMsg: ""
    };
    this.upgrade = this.upgrade.bind(this);
  }
  upgrade(event) {
    this.setState({loading: true});
    this.state.cbInstance.openCheckout({
      hostedPage: () => {
        return axios.post("http://localhost:8000/api/generate_checkout_existing_url", urlEncode({})).then((response) => response.data)
      },
      success(hostedPageId) {
        console.log(hostedPageId);
      },
      close:() => {
        this.setState({loading: false});
        console.log("checkout new closed");
      },
      step(step) {
        console.log("checkout", step);
      }
    });
    event.preventDefault();
  }
  render() {
    return (
    <div className="jumbotron text-center">
      <div className="container">
        <h2><small>Hi</small> Kim,</h2>
        <span className="text-muted">Your subscription is currently in</span> trial.<br/><br/>
        <span className="text-muted">Do you want to upgrade your subscription to take full advantage of all our features? <br/><br/>  
        Click on </span>"Upgrade" <span className="text-muted">to enter your credit card details and upgrade to a paid subscription.</span><br/><br/>
        <div id="subscribe-form">
          <input type="submit" onClick={this.upgrade} className="btn btn-success" value="Upgrade"/>
        </div>
        <br/>
      </div>
    </div>
  )
  }
}
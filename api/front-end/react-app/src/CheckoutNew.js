import React, { Component } from 'react';

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

class CheckoutNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cbInstance: window.Chargebee.init({
        site: "honeycomics-v3-test"
      }),
      first_name: "",
      last_name: "",
      company: "",
      email: "",
      phone: "",
      loading: "",
      errorMsg: ""
    };
    this.handleCheckout = this.handleCheckout.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleCheckout(event) {
    this.setState({loading: true});
    this.state.cbInstance.openCheckout({
      hostedPage: () => {
        var data = {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
          phone: this.state.phone,
          company: this.state.company,
          plan_id: "cbdemo_scale"
        };
        return axios.post("http://localhost:8000/api/generate_checkout_new_url", urlEncode(data)).then((response) => response.data)
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

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div id="container" className="checkout container">
        <div id="customer-info" className="row">                
          <div className="col-sm-7" id="checkout_info">   
              <form id="subscribe-form" onSubmit={this.handleCheckout}>
                  <div className="page-header">
                      <h3>Tell us about yourself</h3>
                  </div>
                  <div className="row">
                      <div className="col-sm-6"> 
                          <div className="form-group">
                              <label htmlFor="first_name">First Name</label>
                              <input type="text" name="first_name" className="form-control" value={this.state.first_name} onChange={this.handleChange}/>
                          </div>
                      </div>
                      <div className="col-sm-6">
                          <div className="form-group">
                              <label htmlFor="last_name">Last Name</label>
                              <input type="text" name="last_name" className="form-control" value={this.state.last_name} onChange={this.handleChange}/>
                          </div>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-sm-6">
                          <div className="form-group">
                              <label htmlFor="email]">Email</label>
                              <input type="text" name="email" className="form-control" value={this.state.email} onChange={this.handleChange}/>
                          </div>
                      </div> 
                                                  
                      <div className="col-sm-6">
                          <div className="form-group">
                              <label htmlFor="phone">Phone</label>
                              <input type="text" name="phone" className="form-control" value={this.state.phone} onChange={this.handleChange}/>
                          </div>
                      </div>                   
                  </div> 
                  <div className="row">
                      <div className="col-sm-6">
                          <div className="form-group">
                              <label htmlFor="company">Company</label>
                              <input type="text" name="company"  className="form-control" value={this.state.company} onChange={this.handleChange}/>
                          </div>
                      </div>
                  </div>                        
                  <hr/>                            
                  {this.state.errorMsg && <p className="text-danger">There were errors while submitting</p>}
                  <div className="form-inline">
                      <div className="form-group">
                        <input type="submit" className="submit-btn btn btn-success btn-lg" value="Proceed to Payment"/>
                      </div>
                      <div className="form-group">
                        {this.state.loading && <span ref="loader" className="subscribe-process process" >Processing&hellip;</span>}
                      </div>
                  </div>                        
                </form>
          </div>
          <div className="col-sm-4 cb-order-list col-sm-offset-1">
              <div className="page-header">
                  <h3>Subscription Details</h3>
              </div>
              <div className="media">                    	
                  <img src="/assets/images/plan.png" alt="chargebee demo" className="pull-left" />
                  <div className="media-body">
                    <p className="h4">Marvel classics</p>
                      <p className="h4">$9 <small><em>per month</em></small></p>
                  </div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutNew;
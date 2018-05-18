import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'


export default class CheckoutExistingLogin extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const Button = withRouter(({ history }) => (
      <div className="form-group">
        <div className="col-sm-8 col-sm-offset-4">
          <button
            type='button'
            onClick={() => { history.push('/checkout-existing/profile') }}
            className="btn btn-success"
          >
            Login
          </button>
        </div>
      </div>
    ))
    
    return (
      <div className="container">
        <div className=" col-sm-6 col-sm-offset-3">
          <div className="panel panel-success">
            <div className="panel-heading">Login</div>
            <div className="panel-body">
              <div className="form-horizontal">
                <div className="form-group">
                  <label className="col-sm-4 control-label">User Name</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" placeholder="Enter User Name" value='kim' />
                    <small className="text-danger"></small>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-4 control-label">Password</label>
                  <div className="col-sm-8">
                    <input type="password" className="form-control" placeholder="Enter Password" value="thisismypassword" />
                    <small className="text-danger"></small>
                  </div>
                </div>
                <div className="form-group">                    
                  <div className="col-sm-8 col-sm-offset-4">
                    <Button/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
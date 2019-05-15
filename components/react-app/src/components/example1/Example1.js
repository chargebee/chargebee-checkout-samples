import React, { Component } from 'react';
import {CardComponent, CardNumber, CardExpiry, CardCVV} from "@chargebee/chargebee-js-react-wrapper";
import './Example1.css'

export default class Example1 extends Component {
  constructor(props) {
    super(props);
    // Create ref to assign card-component
    this.cardRef = React.createRef()

    this.state = {
      token: "",
      error: "",
      loading: false,
      firstName: "",
      options: {
        // Custom classes - applied on container elements based on field's state
        classes: {
          focus: 'focus',
          invalid: 'invalid',
          empty: 'empty',
          complete: 'complete',
        },

        style: {
          // Styles for default field state
          base: {
            color: '#333',
            fontWeight: '500',
            fontFamily: 'Roboto, Segoe UI, Helvetica Neue, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
      
            ':focus': {
              color: '#424770',
            },
      
            '::placeholder': {
              color: 'transparent',
            },
      
            ':focus::placeholder': {
              color: '#7b808c',
            },
          },
      
          // Styles for invalid field state
          invalid: {
            color: '#e41029',
      
            ':focus': {
              color: '#e44d5f',
            },
            '::placeholder': {
              color: '#FFCCA5',
            },
          },
        },

        // locale
        locale: 'en',

        // Custom placeholders
        placeholder: {
          number: "4111 1111 1111 1111",
          expiry: "MM / YY",
          cvv: "CVV"
        },

        // Custom fonts
        fonts: [
          'https://fonts.googleapis.com/css?family=Roboto:300,500,600'
        ]
      },
    }
    this.handleChange = this.handleChange.bind(this);
    this.tokenize = this.tokenize.bind(this);
  }

  tokenize = () => {
    this.setState({loading: true});

    // Call tokenize methods through  card component's ref
    this.cardRef.current.tokenize({}).then((data) => {
      this.setState({loading: false, token: data.token, error: ""});
    }).catch((error) => {
      this.setState({loading: false, token: "", error: "Problem while tokenizing your card details"});
    });
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    const { style, classes, locale, placeholder, fonts } = this.state.options;
    return (
    <div className="ex1-wrap">
      <div className="ex1-fieldset">
      <div className="ex1-field">                  
          <input name="firstName" className={ this.state.firstName ? "ex1-input val" : "ex1-input"} type="text" placeholder="John Doe" value={this.state.firstName} onChange={this.handleChange} />
          <label className="ex1-label">Name on Card</label><i className="ex1-bar"></i>
      </div>

      {/* Pass all options as props to card component  */}
      {/* Assign ref to call internal methods */}
      <CardComponent ref={this.cardRef} className="fieldset field"
        styles={style} 
        classes={classes} 
        locale={locale}
        placeholder={placeholder}
        fonts={fonts}
      >
        <div className="ex1-field">
          {/* Card number component */}
          <CardNumber className="ex1-input"/>
          <label className="ex1-label">Card Number</label><i className="ex1-bar"></i>
        </div>

        <div className="ex1-fields">
          <div className="ex1-field">
            {/* Card expiry component */}
            <CardExpiry className="ex1-input"/>
            <label className="ex1-label">Expiry</label><i className="ex1-bar"></i>
          </div>

          <div className="ex1-field">
            {/* Card cvv component */}
            <CardCVV className="ex1-input"/>
            <label className="ex1-label">CVC</label><i className="ex1-bar"></i>
          </div>

        </div>
      </CardComponent>

    </div>
    <button type="submit" className={ this.state.loading ? "submit ex1-button" : "ex1-button"} onClick={this.tokenize}>Pay $x & Tokenize</button>
    {this.state.error && <div className="error" role="alert">{this.state.error}</div>}
    {this.state.token && <div className="token" >{this.state.token}</div>}
  </div>);
  }
}
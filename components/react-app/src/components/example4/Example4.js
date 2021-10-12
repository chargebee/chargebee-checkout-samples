import React, { Component } from 'react';
import {CardComponent, CardNumber, CardExpiry, CardCVV} from "@chargebee/chargebee-js-react-wrapper";
import './Example4.css'

export default class Example4 extends Component {
  constructor(props) {
    super(props);
    // Create ref to assign card-component
    this.cardRef = React.createRef()

    this.state = {
      intent_id: "",
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
    this.authorizeWith3ds = this.authorizeWith3ds.bind(this);
  }

  urlEncode = (data) => {
    var str = [];
    for (var p in data) {
        if (data.hasOwnProperty(p) && (!(data[p] == undefined || data[p] == null))) {
            str.push(encodeURIComponent(p) + "=" + (data[p] ? encodeURIComponent(data[p]) : ""));
        }
    }
    return str.join("&");
  }

  createIntent = async () => {
    return fetch("http://localhost:8000/api/generate_payment_intent", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: this.urlEncode({
      amount: 500,
      currency_code: "INR",
      payment_method_type: 'card'
      })
    }).then((response) => response.json())
    .catch((err) => {
      console.log('error', err)
    });
  }

  authorizeWith3ds = async () => {
    this.setState({loading: true});

    const intent = await this.createIntent();
    const additionalData = {
      billingAddress: {
        firstName: "John",
        lastName: "Doe",
        phone: "123123123",
        addressLine1: " Aarti Chowk",
        addressLine2: "Gurdev Nagar",
        addressLine3: "",
        city: "Ludhiana",
        state: "Punjab",
        stateCode: "PB",
        countryCode: "IN",
        zip: "141001",
      },
      email:"a@ac.com",
      mandate: {
        requireMandate: true,
        description: 'mandate_description', // It could be plan name or plan id
      }
    };
    // Call authorizeWith3ds methods through  card component's ref
    this.cardRef.current.authorizeWith3ds(intent.payment_intent, additionalData).then((data) => {
      this.setState({loading: false, intent_id: data.id, error: ""});
    }).catch((error) => {
      this.setState({loading: false, intent_id: "", error: "Problem while tokenizing your card details"});
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
      <div className="ex1 container">
        <div className="ex4-wrap">
          <div className="ex4-fieldset">
          <div className="ex4-field">                  
              <input name="firstName" className={ this.state.firstName ? "ex4-input val" : "ex4-input"} type="text" placeholder="John Doe" value={this.state.firstName} onChange={this.handleChange} />
              <label className="ex4-label">Name on Card</label><i className="ex4-bar"></i>
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
            <div className="ex4-field">
              {/* Card number component */}
              <CardNumber className="ex4-input"/>
              <label className="ex4-label">Card Number</label><i className="ex4-bar"></i>
            </div>

            <div className="ex4-fields">
              <div className="ex4-field">
                {/* Card expiry component */}
                <CardExpiry className="ex4-input"/>
                <label className="ex4-label">Expiry</label><i className="ex4-bar"></i>
              </div>

              <div className="ex4-field">
                {/* Card cvv component */}
                <CardCVV className="ex4-input"/>
                <label className="ex4-label">CVC</label><i className="ex4-bar"></i>
              </div>

            </div>
          </CardComponent>

        </div>
        <button type="submit" className={ this.state.loading ? "submit ex4-button" : "ex4-button"} onClick={this.authorizeWith3ds}>Pay $x & authorizeWith3ds</button>
        {this.state.error && <div className="error" role="alert">{this.state.error}</div>}
        {this.state.intent_id && <div className="intent_id" >{this.state.intent_id}</div>}
      </div>
      </div>
    );
  }
}
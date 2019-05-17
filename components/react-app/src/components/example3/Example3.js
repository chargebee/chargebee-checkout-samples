import React, { Component } from 'react';
import {CardComponent, CardNumber, CardExpiry, CardCVV} from "@chargebee/chargebee-js-react-wrapper";
import './Example3.css'

export default class Example1 extends Component {
  constructor(props) {
    super(props);
    
    // Ref for card component
    this.cardRef = React.createRef()
    
    this.state = {
      token: "",
      loading: false,
      firstName: "",
      
      // To store validation error messages
      errorMessage: "",
      errors: {},

      // options for card component
      options: {
        // Custom classes - applied on container elements based on field's state
        classes: {
          focus: 'focus',
          invalid: 'invalid',
          empty: 'empty',
          complete: 'complete',
        },

        style: {
          base: {
            color: '#2a2d5b',
            fontWeight: '500',
            fontFamily: 'Raleway,-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',

            ':focus': {
              // color: '#424770',
            },

            '::placeholder': {
              color: '#9293AB',
              fontSize: '14px',
            },

            ':focus::placeholder': {
              color: '#666',
            },
          },
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

        // Custom fonts
        fonts: [
          'https://fonts.googleapis.com/css?family=Raleway:300,500,600'
        ]
      },
    }
  }

  tokenize = (e) => {
    e.preventDefault();
    this.setState({loading: true});
    // Call tokenize method through card component's ref
    this.cardRef.current.tokenize({}).then((data) => {
      this.setState({loading: false, token: data.token, errorMessage: ""});
    }).catch((error) => {
      this.setState({loading: false, token: "", errorMessage: "Problem while tokenizing your card details"});
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

  // Method to trigger on card component ready
  onReady = () => {
    console.log('card component ready')
  }

  // Method to trigger on field focus
  onFocus = (event) => {
    console.log(event.field, 'focused')
  }

  // Method to trigger on field blur
  onBlur = (event) => {
    console.log(event.field, 'blurred')
  }

  setLocale = (e) => {
    e.preventDefault();
    const locale = e.target.id;
    const options = this.state.options;
    options.locale = locale;
    this.setState({options});
  }

  // Validation error handling
  onChange = (event) => {
    const errors = this.state.errors;
    let errorMessage = '';

    if(event.error) {
      // If error is present, display the error
      errors[event.field] = event.error
      errorMessage = event.error.message
    } else {
      errors[event.field] = null
      // If there's no error, check for existing error
      const _errors = Object.values(errors).filter(val => val)
      
      // The errorObject holds a message and code
      // Custom error messages can be displayed based on the error code
      const errorObj = _errors.pop();

      // Display existing message
      if(errorObj) errorMessage = errorObj.message
      else errorMessage = ''
    }
    this.setState({
      errors,
      errorMessage,
    })
  }

  render() {
    const { firstName, loading, errorMessage, token } = this.state;
    const { style, classes, locale, fonts } = this.state.options;
    return (
      <div className="ex3 container">
        <div className="ex3-wrap">      
          <form id="payment">
            <div className="ex3-contain">
              <div className="ex3-fieldset">
                <div className="ex3-field">                  
                    <input name="firstName" className={ firstName ? "ex3-input val" : "ex3-input"} type="text" placeholder="John Doe" value={firstName} onChange={this.handleChange} />
                    <i className="ex3-bar"></i>                  
                </div>
                {/* Pass all options as props to card component */}
                {/* Assign ref to call internal methods */}
                <CardComponent ref={this.cardRef} 
                  styles={style} 
                  classes={classes} 
                  className="fieldset field"
                  locale={locale}
                  fonts={fonts}
                  onReady={this.onReady}
                  onChange={this.onChange}
                >       
                  {/* ^ Attach ready, change listeners to card component */}       

                  <div className="ex3-field">   
                    {/* Card number field */}
                    <CardNumber className="ex3-input" onFocus={this.onFocus} onBlur={this.onBlur}/>
                    <i className="ex3-bar"></i>                  
                  </div>
                  <div className="ex3-fields">
                    <div className="ex3-field">                    
                        {/* Card expiry field */}
                        <CardExpiry className="ex3-input" onFocus={this.onFocus} onBlur={this.onBlur}/>
                        <i className="ex3-bar"></i>                    
                    </div>
                    <div className="ex3-field">                    
                        {/* Card cvv field */}
                        <CardCVV className="ex3-input" onFocus={this.onFocus} onBlur={this.onBlur}/>
                        <i className="ex3-bar"></i>                 
                    </div>
                  </div>
                </CardComponent>
              </div>
            </div>
            <button className={ loading ? "submit ex3-button" : "ex3-button"} onClick={this.tokenize}>Pay $x & Tokenize</button>
            {errorMessage && <div className="error" role="alert">{errorMessage}</div>}
            {token && <div className="token" >{token}</div>}
            <h4 style={{marginTop: 30}}>Select Locale:</h4>
            <div className="language-palette" style={{marginTop: 15}}>
              <button id="en" className="ex3-button small" onClick={this.setLocale}>EN</button>
              <button id="fr" className="ex3-button small" onClick={this.setLocale}>FR</button>
              <button id="es" className="ex3-button small" onClick={this.setLocale}>ES</button>
              <button id="pt" className="ex3-button small" onClick={this.setLocale}>PT</button>
              <button id="it" className="ex3-button small" onClick={this.setLocale}>IT</button>
              <button id="de" className="ex3-button small" onClick={this.setLocale}>DE</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
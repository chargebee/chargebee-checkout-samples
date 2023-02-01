import React, { Component } from 'react';
import {CardComponent} from "@chargebee/chargebee-js-react-wrapper";
import './Example2.css'

export default class Example2 extends Component {
  constructor(props) {
    super(props);
    // Create a ref for card component
    this.cardRef = React.createRef()
    this.themes = THEMES;
    this.state = {
      token: "",
      error: "",
      loading: false,
      firstName: "",
      email: "",
      phone: "",
      // To change styles dynamically
      fontSize: 16,

      // Custom classes
      classes: {
        focus: 'focus',
        invalid: 'invalid',
        empty: 'empty',
        complete: 'complete',
      },
      
      // Custom styles
      styles: this.getIframeStyles(this.themes[0]),

      // Card icon toggle
      cardIcon: true,
    }
    this.handleChange = this.handleChange.bind(this);
    this.tokenize = this.tokenize.bind(this);
  }

  tokenize() {
    this.setState({loading: true});
    // Call tokenize method using card component's ref
    this.cardRef.current.tokenize({}).then((data) => {
      this.setState({loading: false, token: data.token, error: ""});
    }).catch((error) => {
      this.setState({loading: false, token: "", error: "Problem while tokenizing your card details"});
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  
  getIframeStyles = (theme) => {
    return {
      base: {
        color: theme['main-text'],
        fontWeight: '500',
        fontFamily: 'Lato,-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        iconColor: theme['main-text'],

        ':focus': {
          // color: '#424770',
        },

        '::placeholder': {
          color: theme['placeholder'],
        },

        ':focus::placeholder': {
          color: theme['placeholder-focused'],
        },

        ':-webkit-autofill': {
          webkitTextColor: theme['main-text'],
        }
      },
      invalid: {
        color: theme['invalid'] || '#FF7C4A',

        ':focus': {
          color: theme['invalid-focused'] || '#e44d5f',
        },
        '::placeholder': {
          color: theme['invalid-placeholder'] || '#FFCCA5',
        },
      },
    }
  }

  increaseFontSize = () => {
    const fontSize = this.state.fontSize + 1;
    this.setState({
      fontSize,
      styles: {
        ...this.state.styles,
        base: {
          ...this.state.styles.base,
          fontSize: `${fontSize}px`,
        }
      }
    })
  }

  // Update any of the props passed to card-component to trigger update
  decreaseFontSize = () => {
    const fontSize = this.state.fontSize - 1;
    this.setState({
      fontSize,
      styles: {
        ...this.state.styles,
        base: {
          ...this.state.styles.base,
          fontSize: `${fontSize}px`,
        }
      }
    })
  }

  setTheme = (event, index) => {
    event.preventDefault();
    const theme = this.themes[index];
    let root = document.documentElement;
    root.style.setProperty('--main-bg', theme['main-bg'])
    root.style.setProperty('--secondary-bg', theme['secondary-bg'])
    root.style.setProperty('--main-text', theme['main-text'])
    root.style.setProperty('--placeholder', theme['placeholder'])
    root.style.setProperty('--placeholder-focused', theme['placeholder-focused'])
    root.style.setProperty('--primary-btn', theme['primary-btn'])
    root.style.setProperty('--btn-text', theme['btn-text'])
    root.style.setProperty('--primary-btn-focus', theme['primary-btn-focus'])

    this.setState({
      styles: this.getIframeStyles(theme)
    });
  }

  toggleCardIcon = () => {
    this.setState({
      cardIcon: !this.state.cardIcon
    })
  }

  // Clear the contents of the fields
  clear = () => {
    this.cardRef.current.clear();
  }

  focus = () => {
    this.cardRef.current.focus();
  }

  onEscape = (event) => {
    console.log(event);
  }

  render() {
    const { cardIcon, styles, classes } = this.state;
    return (
      <div className="ex2 container">
        <div className="ex2-wrap">
          <div className="ex2-fieldset">
            <label className="ex2-field">                  
              <span className="ex2-label">Name</span>
              <input name="firstName" className={ this.state.firstName ? "ex2-input val" : "ex2-input"} type="text" placeholder="John Doe" value={this.state.firstName} onChange={this.handleChange} />
            </label>
            <label className="ex2-field">                  
              <span className="ex2-label">Email</span>
              <input name="email" className={ this.state.email ? "ex2-input val" : "ex2-input"} type="text" placeholder="john@comp.any" value={this.state.email} onChange={this.handleChange} />
            </label>
            <label className="ex2-field">                  
              <span className="ex2-label">Phone</span>
              <input name="phone" className={ this.state.phone ? "ex2-input val" : "ex2-input"} type="text" placeholder="+63 53242 32637" value={this.state.phone} onChange={this.handleChange} />
            </label>

            <label className="ex2-field">
              {/* Render card component in combined-mode */}
              <CardComponent ref={this.cardRef} className="ex2-input fieldset field"
                icon={cardIcon}
                styles={styles}
                classes={classes} 
                onKeyPress={(event) => console.log(event)}
              />
            </label>
          </div>
          <button type="submit" className={ this.state.loading ? "submit ex2-button" : "ex2-button"} onClick={this.tokenize}>Pay $x & Tokenize</button>
          {this.state.error && <div className="error" role="alert">{this.state.error}</div>}
          {this.state.token && <div className="token" >{this.state.token}</div>}
          <h4 className="title" >Change theme: </h4>
          <div className="theme-palette" style={{marginTop: 15}}>
            <button className="ex2-button primary-btn" onClick={this.toggleCardIcon}>Icon</button> &nbsp;
            <button id="theme-1" className="ex2-button" onClick={e => this.setTheme(e, 0)}>Theme1</button>
            <button id="theme-2" className="ex2-button" onClick={e => this.setTheme(e, 1)}>Theme2</button>
            <button id="theme-3" className="ex2-button" onClick={e => this.setTheme(e, 2)}>Theme3</button>
            <button id="theme-4" className="ex2-button" onClick={e => this.setTheme(e, 3)}>Theme4</button>
          </div>
          <h4 className="title" >Actions:</h4>
          <div className="theme-palette" style={{marginTop: 15}}>
            <button className="ex2-button" onClick={this.increaseFontSize}>+ Font size</button>
            <button className="ex2-button" onClick={this.decreaseFontSize}>- Font size</button>
            <button className="ex2-button" onClick={this.focus}>Focus</button>
          </div>
        </div>
      </div>
    );
  }
}

const THEMES = [
  {
    'main-bg': '#262E3A',
    'secondary-bg': '#3e4b5b',
    'main-text': '#fff',
    'placeholder': '#939aa3',
    'placeholder-focused': '#ccc',
    'primary-btn': '#6EEDB6',
    'btn-text': '#1C2026',
    'primary-btn-focus': 'rgb(70, 203, 145)',
    'invalid': '#FF7C4A',
    'invalid-focused': '#e44d5f',
    'invalid-placeholder': '#FFCCA5',
  },
  {
    'main-bg': '#D5DBE7',
    'secondary-bg': '#fff',
    'main-text': '#000',
    'placeholder': '#abacbe',
    'placeholder-focused': '#abacbe',
    'primary-btn': '#4773D2',
    'btn-text': '#fff',
    'primary-btn-focus': '#3361c3',
    'invalid': '#E94745',
    'invalid-focused': '#e44d5f',
    'invalid-placeholder': '#FFCCA5'
  },
  {
    'main-bg': '#fca571',
    'secondary-bg': '#fff',
    'main-text': '#252857',
    'placeholder': '#9293AB',
    'placeholder-focused': '#666',
    'primary-btn': '#252857',
    'btn-text': '#fff',
    'primary-btn-focus': '#191c4a',
    'invalid': '#E94745',
    'invalid-focused': '#e44d5f',
    'invalid-placeholder': '#FFCCA5'
  },
  {
    'main-bg': '#544FB0',
    'secondary-bg': '#fff',
    'main-text': '#35A9BD',
    'placeholder': 'ddd',
    'placeholder-focused': '#ddd',
    'primary-btn': '#35A9BD',
    'btn-text': '#fff',
    'primary-btn-focus': 'rgb(29, 138, 157)',
  }
]
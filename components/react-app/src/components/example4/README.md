# Chargebee Components React - Example 4 
### Scenarios covered
  * Initializing chargebee.js
  * Setting up Chargebee components in `fields-mode`
  * Style customization
  * Font customization
  * Input Placeholder customization
  * Setting locale
  * Authorizing payment with 3ds on submit

### Code breakdown
In your app.js
```jsx
// Initialize Chargebee before loading the card component
// Preferably before mount / in the constructor

class App extends Component {
  constructor() {
    ...
    // Initialize chargebee.js
    window.Chargebee.init({
      site: "mannar-test",
      publishableKey: "test___dev__cdF5IUqCBwUNpKZrueN3KcfAnBcdsKX1xK"
    })
    
    // Create ref for Card component
    this.CardRef = React.createRef()

    this.state = {
      // Set necessary options
      options: {
        classes: {...},
        fonts: {...},
        locale: {...},
        style: {...},
        placeholder: {...}
      }
      ...
    }
  }

  // Create Chargebee token on Submit
  onSubmit() {
    // Call the tokenize method through the ref
    this.CardRef.current.tokenize().then((data) => {
      console.log("Chargebee token:", data.token);
    })
    ...
  }

  render() {
    const { style, classes, locale, placeholder, fonts } = this.state.options;
    return (
      ...
      // Rendering card component in fields-mode
      <CardComponent ref={this.CardRef} 
          styles={style} 
          classes={classes} 
          className="fieldset field"
          locale={locale}
          placeholder={placeholder}
          fonts={fonts}
      >
        <CardNumber className="ex1-input" />
        <CardExpiry className="ex1-input"/>
        <CardCVV className="ex1-input"/>
      </CardComponent>
      <button onClick={this.onSubmit}>Pay $25</button>
      ...
    )
  }
}

```
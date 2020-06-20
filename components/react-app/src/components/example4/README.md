# Chargebee Components React - Example 4
### Scenarios covered
  * 3DS Authorization
  * Passing additional parameters to increase chances of frictionless checkout

### Code breakdown
In your app.js
```jsx
export default class Example1 extends Component {
  constructor(props) {
    super(props);

    // Create a ref to assign it to card-component
    this.cardRef = React.createRef()

    this.state = {
      intent: null,
      ...
      // To hold validation error messages
      errorMessage: "",
      errors: {},
      ...

      // Options for card component
      options: {
        classes: {...},
        style: {...},
        locale: 'en',
        placeholder: {...},
        fonts: [...]
      },
    }
    
  }

  createPaymentIntent = () => {
    // Make ajax call to server to create a paymentIntent
    this.setState({ intent: paymentIntent })
  }

  componentDidMount() {
    ...
    // Create and set the paymentIntent for the checkout
    this.createPaymentIntent()
  }

  authorize = () => {
    ...
    // Call the authorize method via card component's ref
    this.cardRef.current.authorizeWith3ds(this.state.intent).then(authorizedIntent => {
      // Payment Intent id can be used to create a subscription, create payment method, etc
      console.log(authorizedIntent.id)
      ...
    }).catch((error) => {
      ...
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

  // Validation error handling
  onChange = (event) => {
    
    const errors = this.state.errors;
    let errorMessage = '';

    if(event.error) {
      // If error is present, setState and display the error
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
    ...
    const { style, classes, locale, placeholder, fonts } = this.state.options;

    return (
      ...
      // Pass all options as props to card component
      // Assign ref to call internal methods
      <CardComponent ref={this.cardRef} 
        styles={style} 
        classes={classes} 
        className="fieldset field"
        locale={locale}
        placeholder={placeholder}
        fonts={fonts}
        onReady={this.onReady}
        onChange={this.onChange}
      >
        {/* ^ Attach listeners to card component */}
        ...
        
          {/* Attach focus and blur listeners to individual fields */}
          <CardNumber className="ex1-input" onFocus={this.onFocus} onBlur={this.onBlur}/>
          <CardExpiry className="ex1-input" onFocus={this.onFocus} onBlur={this.onBlur}/>
          <CardCVV className="ex1-input" onFocus={this.onFocus} onBlur={this.onBlur}/>
        ...
      </CardComponent>
      ...
    );
  }
}
```
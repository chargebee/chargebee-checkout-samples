# Example 1 
### Scenarios covered
  * Initializing chargebee.js
  * Setting up Chargebee components in `fields-mode`
  * Style customization
  * Font customization
  * Input Placeholder customization
  * Setting locale
  * Creating chargebee token on submit

### Run 
```bash
python -m SimpleHTTPServer 9000
```

### Code breakdown
In your `index.html`
```html
<html>
  <head>
    ...
    <!-- Include chargebee js script -->
    <script src="https://localhost:9443/v2/chargebee.js"></script>
    <script src="index.js"></script>
  </head>
  <body>
    <form>
      <!-- Specify container elements for mounting card elements -->
      <!-- Chargebee iframes get mounted here... -->
      ...
      <!-- Card Number container -->
      <div id="card-number" class="ex1-input"></div>
      <!-- Card Expiry container -->
      <div id="card-expiry" class="ex1-input"></div>
      <!-- Card CVV container -->
      <div id="card-cvc" class="ex1-input"></div>
      
      <!-- Container for displaying validation errors -->
      <div id="error" role="alert"></div>
    </form>
    ...
  </body>
</html>
```

In your `index.js`
```js
// On document ready
$(document).ready(function() {
  // Initialize chargebee with your Site & Publishable API Key 
  var cbInstance = Chargebee.init({
    site: "mannar-test",
    publishableKey: "test___dev__cdF5IUqCBwUNpKZrueN3KcfAnBcdsKX1xK"
  });

  var options = {
    // Custom fonts
    fonts: [
      'https://fonts.googleapis.com/css?family=Roboto:300,500,600'
    ],

    // CSS Classes that gets applied on the container elements on different field states
    classes: {
      focus: 'focus',
      invalid: 'invalid',
      empty: 'empty',
      complete: 'complete',
    },

    // Custom placeholders
    placeholder: {
      number: "4111 1111 1111 1111",
      expiry: "MM / YY",
      cvv: "123"
    },

    // Style customization
    style: {
      // Styles for default state
      base: {
        color: '#333',
        fontWeight: '500',
        fontFamily: 'Roboto, Segoe UI, Helvetica Neue, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',

        // Input text color on focus
        ':focus': {
          color: '#424770',
        },

        // Default placeholder color
        '::placeholder': {
          color: 'transparent',
        },

        // Placeholder color when focused
        ':focus::placeholder': {
          color: '#7b808c',
        },
      },

      // Styles applied when field is in an invalid state
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
  }

  // Load chargebee components
  cbInstance.load("components").then(() => {

    // Create a card component, with the options
    var cardComponent = cbInstance.createComponent("card", options);
    
    // Create card fields (fields-mode)
    cardComponent.createField("number")
      // Set the container element ID here
      .at("card-number");
    cardComponent.createField("expiry").at("card-expiry");
    cardComponent.createField("cvv").at("card-cvc");

    // Mount card component
    cardComponent.mount();

    ...
    cardComponent.tokenize().then(data => {
      // Get chargebee token here
      console.log(data.token) 
      ...
    })
    ...
  });
});
```


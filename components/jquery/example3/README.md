# Example 3 - Event listeners
## Scenarios covered
  * Set up event listeners
    * on ready
    * on focus
    * on blur
    * on change
  * Handling validation errors

### Run 
```bash
python -m SimpleHTTPServer 9000
```

### Code breakdown
```js

// Initializing Chargebee.js
var cbInstance = Chargebee.init({
  site: "mannar-test",
  publishableKey: "test___dev__cdF5IUqCBwUNpKZrueN3KcfAnBcdsKX1xK"
});

var options = {...}
// Creating a card
var cardComponent = cbInstance.createComponent("card", options);

// Creating individual fields (fields-mode)
var numberField = cardComponent.createField("number").at("card-number");
var expiryField = cardComponent.createField("expiry").at("card-expiry");
var cvvField = cardComponent.createField("cvv").at("card-cvc");

// Attaching listeners
/*
  Listeners can be attached to both card component and field instances.
  If using combined-mode, all listeners need to be attached to card component intance
  In case of fields-mode, the change listener can be attached either to card component or the field instance,
    the rest of the listeners need to be attached to the individual fields
*/

// On ready
// The ready listener receives the field/component instance as the argument, and is triggered after component is successfully mounted
numberField.on('ready', onReady)

// On focus
numberField.on('focus', onFocus)

// On blur
numberField.on('blur', onBlur)

// On change
// Do validation error handling
cardComponent.on('change', validationErrorHandler)

// Error handler
var errors = {}
function validationErrorHandler(event) {
  let error = document.getElementById('error')
  if(event.error) {
    // store the error message
    errors[event.field] = event.error
    // Display it in the DOM
    error.innerText = event.error.message
  } else {
    // Set error to null
    errors[event.field] = null
    
    // check for any other available errors
    let _errors = Object.values(errors).filter(val => val)
    
    // Display error message if any available
    if(_errors.length) error.innerText = _errors.pop().message
    else error.innerText = ''
  }
}


```
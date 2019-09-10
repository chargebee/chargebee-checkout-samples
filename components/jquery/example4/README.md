# Example 4 - 3DS Authorization
## Scenarios covered
  * Perform 3DS authorization
  * Passing additional parameters to authorizeWith3ds method to increase chances of frictionless checkout
  * Create subscription with Payment Intent ID

### Run 
```bash
python -m SimpleHTTPServer 9000
```

### Code breakdown
```js

// Initializing Chargebee.js
var cbInstance = Chargebee.init({
  site: "honeycomics-v3-test",
  publishableKey: "test_qoH22RugUvm5IcxoqUD5Svdcu9mX5figf"
});

var options = {...}
// Creating a card
var cardComponent = cbInstance.createComponent("card", options);

// Creating individual fields (fields-mode)
var numberField = cardComponent.createField("number").at("card-number");
var expiryField = cardComponent.createField("expiry").at("card-expiry");
var cvvField = cardComponent.createField("cvv").at("card-cvc");

var paymentIntent
function createPaymentIntent() {
  // Make an api call to server to create a paymentIntent
  ...
  paymentIntent = newPaymentIntent;
}

createPaymentIntent();

function createSubscription(intent) {
  // Make an api call to server to create a subscription using paymentIntent id, plan id and customer details
}

function onSubmit() {
  ...
    cardComponent.authorizeWith3ds(paymentIntent, additionalData).then(authorizedIntent => {
      return createSubscription(authorizedIntent)
    }).then(subscription => {
      console.log('subscription created successfully', subscription)
    }).catch(err => {
      console.error('Error occured', err)
    })
  ...
}


```
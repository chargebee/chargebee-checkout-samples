
document.addEventListener("DOMContentLoaded", function(e) {

  var chargebeeInstance = Chargebee.init({
    site: "siva-payment-test"
  });

  var threeDS;

  chargebeeInstance.load3DSHandler()
    .then(threeDSHandler => {
      threeDS = threeDSHandler;
      return createPaymentIntent({amount: 3001});
    })
    .then(paymentIntent => {
      threeDS.setPaymentIntent(paymentIntent);
    });

  var button = document.getElementById('submit-button');
  var form = document.getElementById("payment-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    button.setAttribute('disabled','');
    
    var status = document.getElementById("status");
    status.classList.add('error')
    status.innerHTML = `Please wait for 10 seconds, for completing the 3ds transaction. This happens only for test sites.`

    var card = getCardInput();
    threeDS.handleCardPayment({card: card}).then(paymentIntent => {
      status.classList.remove('error')
      status.innerHTML = `Payment is ${paymentIntent.status}`
      button.removeAttribute('disabled');
    }).catch((error) => {
      status.classList.add('error')
      status.innerHTML = `Failed to Authorize`;
      button.removeAttribute('disabled');
    });
  });

  var scenario = document.getElementById('scenario-chooser');
 
  scenario.addEventListener('change', function(e) {
    button.setAttribute('disabled','');
    var amount = e.target.value;
    var payload = {amount: amount}
    createPaymentIntent(payload).then((paymentIntent) => {
      threeDS.setPaymentIntent(paymentIntent);
      button.removeAttribute('disabled');
    })
  });

});

function getCardInput() {
  return {
    firstName: document.getElementById("cc-first-name").value,
    lastName: document.getElementById("cc-last-name").value,
    number: document.getElementById("cc-number").value.replace(/\s/g, ""),
    expiryMonth: document.getElementById("cc-month").value,
    expiryYear: document.getElementById("cc-year").value,
    cvv: document.getElementById("cc-cvv").value
  };
}
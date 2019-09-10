document.addEventListener("DOMContentLoaded", function(e) {
  var chargebeeInstance = Chargebee.init({
    site: "siva-payment-test"
  });

  var threeDS;

  chargebeeInstance.load3DSHandler()
    .then(threeDSHandler => {
      threeDS = threeDSHandler;
      return createPaymentIntent();
    })
    .then(paymentIntent => {
      threeDS.setPaymentIntent(paymentIntent);
    });

  var form = document.getElementById("payment-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    var card = getCardInput();
    threeDS.handleCardPayment({card: card}).then(paymentIntent => {
      var status = document.getElementById("status");
      status.classList.remove('error')
      status.innerHTML = `Payment is ${paymentIntent.status}`
    }).catch((error) => {
      var status = document.getElementById("status");
      status.classList.add('error')
      status.innerHTML = `Failed to Authorize`
    });
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

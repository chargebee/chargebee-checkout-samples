document.addEventListener("DOMContentLoaded", () => {

  var chargebeeInstance = Chargebee.init({
    site: "siva-payment-test"
  });

  var threeDS;
  var adyenCheckout;
  var cardElement;

  Promise.all([loadAdyenCardComponent(), chargebeeInstance.load3DSHandler()])
  .then ((arg) => {
    adyenCheckout = arg[0].adyenCheckout;
    cardElement = arg[0].cardElement;
    threeDS = arg[1];
    return createPaymentIntent();
  })
  .then(paymentIntent => {
    threeDS.setPaymentIntent(paymentIntent, {adyen: adyenCheckout});
  })

  var form = document.getElementById("payment-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    threeDS.handleCardPayment({element: cardElement}).then(paymentIntent => {
      var status = document.getElementById("status");
      status.classList.remove('error')
      status.innerHTML = `Payment is ${paymentIntent.status}`
    }).catch((error) => {
      console.log(error)
      var status = document.getElementById("status");
      status.classList.add('error')
      status.innerHTML = `Failed to Authorize`
    });
  });

});

function loadAdyenCardComponent() {
  return getAdyenOriginKey().then((originKey) => {
    return new AdyenCheckout({
      environment: "test",
      originKey: originKey, // Mandatory. originKey from Costumer Area,
    });
  }).then((adyenCheckout) => {
    let cardElement = adyenCheckout.create("card");
    cardElement.mount('#card-container');
    return {adyenCheckout, cardElement};
  });
}

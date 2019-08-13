function createAdyenCheckout(originKey) {
  adyenCheckout = new AdyenCheckout({
    environment: "test",
    originKey: originKey, // Mandatory. originKey from Costumer Area,
    onChange: function(data) {
      console.log("Adyen checkout on change", data);
    },
    onError: function(err) {
      console.log("Adyen Checkout Error", err);
    }
  });
  return adyenCheckout;
}

function createAdyenCard() {
  const selector = "#card-container";
  const styles = {
    base: {
      color: "black",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      fontFamily: "Helvetica"
    },
    error: {
      color: "red"
    },
    placeholder: {
      color: "#d8d8d8"
    },
    validated: {
      color: "green"
    }
  };

  const placeholders = {
    encryptedCardNumber: "5454 5454 5454 5454",
    encryptedExpiryDate: "10/30",
    encryptedSecurityCode: "737"
  };

  const options = {
    placeholders,
    styles,
    onLoad: function(data) {
      console.log("Adyen card loaded ", data);
    },
    onConfigSuccess: function(data) {
      console.log("Adyen card configured successfully", data);
    },
    onChange: function(data) {
      console.log("Adyen card status changed", data);
    },
    onError: function(err) {
      console.log("Adyen card error ", err);
    }
  };

  console.log("created adyen card");
  card = adyenCheckout.create("card", options);
  console.log("mounting card");
  card.mount(selector);
  return card;
}

document.addEventListener("DOMContentLoaded", () => {

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

  getAdyenOriginKey()
    .then(key => createAdyenCheckout(key))
    .then(() => createAdyenCard())
    .catch(err => {
      console.log("fatal error", err);
    });
});

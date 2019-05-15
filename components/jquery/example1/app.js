$(document).ready(function() {

  $("input").on("focus", function() {
    $(this).addClass("focus");
  });

  $("input").on("blur", function() {
    $(this).removeClass("focus");
  });

  $("input").on("keyup", function() {
    if($(this).val()) {
      $(this).removeClass("empty");
      $(this).addClass("val");
    }
    else {
      $(this).addClass("empty");
      $(this).removeClass("val");
    }
  });



  var cbInstance = Chargebee.init({
    site: "honeycomics-v3-test",
    publishableKey: "test_qoH22RugUvm5IcxoqUD5Svdcu9mX5figf"
  });

  var options = {
    fonts: [
      'https://fonts.googleapis.com/css?family=Roboto:300,500,600'
    ],

    // add classes for different states
    classes: {
      focus: 'focus',
      invalid: 'invalid',
      empty: 'empty',
      complete: 'complete',
    },

    // add placeholders
    placeholder: {
      number: "4111 1111 1111 1111"
    },

    // Set locale
    locale: 'en',

    style: {

      // Styles for default state
      base: {
        color: '#333',
        fontWeight: '500',
        fontFamily: 'Roboto, Segoe UI, Helvetica Neue, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',

        ':focus': {
          // color: '#424770',
        },

        '::placeholder': {
          color: '#abacbe',
        },

        ':focus::placeholder': {
          // color: '#7b808c',
        },
      },

      // Styles for invalid state
      invalid: {
        color: '#E94745',

        ':focus': {
          color: '#e44d5f',
        },
        '::placeholder': {
          color: '#FFCCA5',
        },
      },
    },
  }

  cbInstance.load("components").then(() => {

    // Create card
    var cardComponent = cbInstance.createComponent("card", options);
    // Create card fields
    cardComponent.createField("number").at("#card-number");
    cardComponent.createField("expiry").at("#card-expiry");
    cardComponent.createField("cvv").at("#card-cvc");

    // Mount card component
    cardComponent.mount();
    
    $("#payment").on("submit", function(event) {
      $("#submit-button").addClass("submit");
      event.preventDefault();
      cardComponent.tokenize().then(data => {
        $("#submit-button").removeClass("submit");
        $("#token").show();
        $("#error").hide();
        $("#token").html(data.token);
      }).catch(error => {
        $("#submit-button").removeClass("submit");
        // TODO get a proper error message
        $("#error").show();
        $("#error").html("Problem while tokenizing your card details");
        $("#token").hide();
        console.log(error);
      });
    });
  });
});
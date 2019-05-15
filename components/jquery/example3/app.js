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
      'https://fonts.googleapis.com/css?family=Raleway:300,500,600'
    ],

    // add classes for different states
    classes: {
      focus: 'focus',
      invalid: 'invalid',
      empty: 'empty',
      complete: 'complete',
    },

    // Set locale
    locale: 'en',

    style: {
      base: {
        color: '#2a2d5b',
        fontWeight: '500',
        fontFamily: 'Raleway,-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',

        ':focus': {
          // color: '#424770',
        },

        '::placeholder': {
          color: '#9293AB',
          fontSize: '14px',
        },

        ':focus::placeholder': {
          color: '#666',
        },
      },
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

  // To do a programmatic focus when field is mounted and ready
  function onReady (numberField) {
    console.log('number field ready');
    numberField.focus();
  }

  function onFocus (event) {
    console.log(`${event.field} focused`)
  }

  function onBlur (event) {
    console.log(`${event.field} blurred`)
  }

  // To store { [field]: [errorMessage] }
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

  cbInstance.load("components").then(() => {

    // Create card
    var cardComponent = cbInstance.createComponent("card", options);
    
    // Create card fields
    var numberField = cardComponent.createField("number").at("#card-number");
    var expiryField = cardComponent.createField("expiry").at("#card-expiry");
    var cvvField = cardComponent.createField("cvv").at("#card-cvc");

    // Attach listeners
    numberField.on('ready', onReady)

    numberField.on('focus', onFocus)
    expiryField.on('focus', onFocus)
    cvvField.on('focus', onFocus)

    numberField.on('blur', onBlur)
    expiryField.on('blur', onBlur)
    cvvField.on('blur', onBlur)

    // Change listeners can either be attached to the card-component or the individual fields
    /**
        cardComponent.on('change', validationErrorHandler)
      --- OR ---
        numberField.on('change', validationErrorHandler)
        expiryField.on('change', validationErrorHandler)
        cvvField.on('change', validationErrorHandler)
     */
    cardComponent.on('change', validationErrorHandler)

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

    $(".language-button").each(function() {
      $(this).on('click', function(e) {
        e.preventDefault();
        const locale = e.target.id;
        cardComponent.update({
          locale
        })
      })
    });

  });
});
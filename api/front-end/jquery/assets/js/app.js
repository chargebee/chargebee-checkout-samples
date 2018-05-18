$(document).ready(function() {
  var cbInstance = window.Chargebee.init({site: "honeycomics-v3-test"});
  $("#subscribe-form").on("submit", function(event) {
    event.preventDefault();
    $("#loader").show();
    $("#errorContainer").hide();
    cbInstance.openCheckout({
        hostedPage: function() {
          // Hit your end point that returns hosted page object as response
          // This sample end point will call the below api
          // You can pass hosted page object created as a result of checkout_new, checkout_existing, manage_payment_sources
          // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_new_subscription
          // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_existing_subscription
          // https://apidocs.chargebee.com/docs/api/hosted_pages#manage_payment_sources
          // If you want to use paypal, go cardless and plaid, pass embed parameter as false
          return $.ajax({
            method: "post",
            url: "http://localhost:8000/api/generate_checkout_new_url",
            data: $("#subscribe-form").serialize()
          });
        },
        loaded: function() {
          console.log("checkout opened");
        },
        error: function() {
          $("#loader").hide();
          $("#errorContainer").show();
        },
        close: function() {
          $("#loader").hide();
          $("#errorContainer").hide();
          console.log("checkout closed");
        },
        success: function(hostedPageId) {
          console.log(hostedPageId);
          // Hosted page id will be unique token for the checkout that happened
          // You can pass this hosted page id to your backend 
          // and then call our retrieve hosted page api to get subscription details
          // https://apidocs.chargebee.com/docs/api/hosted_pages#retrieve_a_hosted_page
        },
        step: function(value) {
            // value -> which step in checkout
            console.log(value);
        }
      });
  });

  $("#upgrade").on("click", function() {
    event.preventDefault();
    cbInstance.openCheckout({
      hostedPage: function() {
        // Hit your end point that returns hosted page object as response
        // This sample end point will call the below api
        // You can pass hosted page object created as a result of checkout_new, checkout_existing, manage_payment_sources
        // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_new_subscription
        // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_existing_subscription
        // https://apidocs.chargebee.com/docs/api/hosted_pages#manage_payment_sources
        // If you want to use paypal, go cardless and plaid, pass embed parameter as false
        return $.ajax({
          method: "post",
          url: "http://localhost:8000/api/generate_checkout_existing_url"
        });
      },
      loaded: function() {
        console.log("checkout opened");
      },
      error: function() {
      },
      close: function() {
        console.log("checkout closed");
      },
      success: function(hostedPageId) {
        console.log(hostedPageId);
        // Hosted page id will be unique token for the checkout that happened
        // You can pass this hosted page id to your backend 
        // and then call our retrieve hosted page api to get subscription details
        // https://apidocs.chargebee.com/docs/api/hosted_pages#retrieve_a_hosted_page
      },
      step: function(value) {
          // value -> which step in checkout
          console.log(value);
      }
    });
  });
});
angular.module('chargebeeDemo', [])
  .controller('chargebeeController', function($scope, $http) {
    var cbInstance = Chargebee.init({site: "vivek1-test"});
    cbInstance.setPortalSession(() => {
      // Hit your end point that returns portal session object as response
      // This sample end point will call the below api
      // https://apidocs.chargebee.com/docs/api/portal_sessions#create_a_portal_session
      return $http.post("http://localhost:8000/api/generate_portal_session", getFormUrlEncoded({}),
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function(response) {
        return response.data;
      });
    });

    var getFormUrlEncoded = function(toConvert) {
      const formBody = [];
      for (const property in toConvert) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(toConvert[property]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      return formBody.join('&');
    }

    $scope.openCheckout = function() {
      cbInstance.openCheckout({
        hostedPage: function(){
          // Hit your end point that returns hosted page object as response
          // This sample end point will call the below api
          // You can pass hosted page object created as a result of checkout_new, checkout_existing, manage_payment_sources
          // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_new_subscription
          // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_existing_subscription
          // https://apidocs.chargebee.com/docs/api/hosted_pages#manage_payment_sources
          // If you want to use paypal, go cardless and plaid, pass embed parameter as false
          return $http.post("http://localhost:8000/api/generate_checkout_new_url", getFormUrlEncoded({plan_id: 'cbdemo_scale'}), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function(response) {
            return response.data;
          });
        },
        loaded: function() {
          console.log("checkout opened");
        },
        close: function() {
            console.log("checkout closed");
        },
        success: function(hostedPageId){
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
    }

    $scope.openPortal = function() {
      cbInstance.createChargebeePortal().open({
        loaded: function(){
  
        },
        close: function(){
  
        },
        paymentSourceAdd: function(status){
          console.log("payment source add" + status);
        },
        paymentSourceUpdate: function(status){
          console.log("payment source update" + status);
        },
        paymentSourceRemove: function(status){
          console.log("payment source removed");
        },
        visit: function(value){
          console.log(value);
        }
      });
    }
  });
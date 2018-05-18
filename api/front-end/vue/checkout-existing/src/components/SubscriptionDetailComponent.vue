<template>
  <div class="jumbotron text-center">
    <div class="container">
      <h2><small>Hi</small> Kim,</h2>
      <span class="text-muted">Your subscription is currently in</span> trial.<br><br>
      <span class="text-muted">Do you want to upgrade your subscription to take full advantage of all our features? <br><br>  
      Click on </span>"Upgrade" <span class="text-muted">to enter your credit card details and upgrade to a paid subscription.</span><br><br>
      <div id="subscribe-form">
        <input type="submit" class="btn btn-success" value="Upgrade" @click="upgrade()"/>
      </div>
      <br>
    </div>
  </div>
</template>
<script>
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
var urlEncode = function(data) {
  var str = [];
  for (var p in data) {
    if (data.hasOwnProperty(p) && (!(data[p] == undefined || data[p] == null))) {
      str.push(encodeURIComponent(p) + "=" + (data[p] ? encodeURIComponent(data[p]) : ""));
    }
  }
  return str.join("&");
}

export default {
  mounted: function() {
    this.cbInstance = window.Chargebee.init({site: "honeycomics-v3-test"});
  },
  methods: {
    upgrade() {
      this.cbInstance.openCheckout({
        hostedPage: () => {
          // Hit your end point that returns hosted page object as response
          // This sample end point will call the below api
          // You can pass hosted page object created as a result of checkout_new, checkout_existing, manage_payment_sources
          // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_new_subscription
          // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_existing_subscription
          // https://apidocs.chargebee.com/docs/api/hosted_pages#manage_payment_sources
          // If you want to use paypal, go cardless and plaid, pass embed parameter as false
          return axios.post("http://localhost:8000/api/generate_checkout_existing_url", urlEncode({plan_id: "cbdemo_scale"})).then((response) => response.data)
        },
        loaded: function() {
          console.log("checkout opened");
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
    },
  }
}
</script>
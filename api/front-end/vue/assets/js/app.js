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
var app = new Vue({
  el: "#container",
  data: {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company:  "",
    errorMsg:"",
    loading: false
  },
  mounted: function() {
    this.cbInstance = window.Chargebee.init({site: "honeycomics-v3-test"});
  },
  methods: {
    next: function() {
      this.loading = true;
      this.cbInstance.openCheckout({
        hostedPage: () => {
          // Hit your end point that returns hosted page object as response
          // This sample end point will call the below api
          // You can pass hosted page object created as a result of checkout_new, checkout_existing, manage_payment_sources
          // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_new_subscription
          // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_existing_subscription
          // https://apidocs.chargebee.com/docs/api/hosted_pages#manage_payment_sources
          // If you want to use paypal, go cardless and plaid, pass embed parameter as false
          var data = {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            phone: this.phone,
            company: this.company,
            plan_id: "cbdemo_scale"
          }
          return axios.post("http://localhost:8000/api/generate_checkout_new_url", urlEncode(data)).then((response) => response.data);
        },
        loaded: function() {
          console.log("checkout opened");
        },
        close: () => {
          this.loading = false;
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
        },
        error: function(error) {
          this.errorMsg = error;
        }
      });
    }
  }
});

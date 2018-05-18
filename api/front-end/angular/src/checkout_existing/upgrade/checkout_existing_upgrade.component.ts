import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'checkout-existing-upgrade',
  templateUrl: './checkout_existing_upgrade.component.html',
  styleUrls: ['./checkout_existing_upgrade.component.css']
})
export class CheckoutExistingUpgradeComponent {
  cbInstance;
  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.cbInstance = window['Chargebee'].init({
      site: "honeycomics-v3-test"
    });
  }

  upgrade() {
    this.cbInstance.logout();
    this.cbInstance.openCheckout({
      hostedPage: () => {
        // Hit your end point that returns hosted page object as response
        // This sample end point will call the below api
        // You can pass hosted page object created as a result of checkout_new, checkout_existing, manage_payment_sources
        // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_new_subscription
        // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_existing_subscription
        // https://apidocs.chargebee.com/docs/api/hosted_pages#manage_payment_sources
        // If you want to use paypal, go cardless and plaid, pass embed parameter as false
        return this.http.post("http://localhost:8000/api/generate_checkout_existing_url", {}, {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})}).toPromise();
      },
      loaded: () => {
        console.log("checkout opened");
      },
      close: () => {
          console.log("checkout closed");
      },
      success: (hostedPageId) => {
        console.log(hostedPageId);
        // Hosted page id will be unique token for the checkout that happened
        // You can pass this hosted page id to your backend 
        // and then call our retrieve hosted page api to get subscription details
        // https://apidocs.chargebee.com/docs/api/hosted_pages#retrieve_a_hosted_page
      },
      step: (value) => {
          // value -> which step in checkout
          console.log(value);
      }
    });
  }
}
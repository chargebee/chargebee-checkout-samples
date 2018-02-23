import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  cbInstance;

  constructor(private http: HttpClient){

  }

  getFormUrlEncoded(toConvert) {
		const formBody = [];
		for (const property in toConvert) {
			const encodedKey = encodeURIComponent(property);
			const encodedValue = encodeURIComponent(toConvert[property]);
			formBody.push(encodedKey + '=' + encodedValue);
		}
		return formBody.join('&');
	}

  ngOnInit() {
    this.cbInstance = window['Chargebee'].init({
      site: "vivek1-test"
    });
    this.cbInstance.setPortalSession(() => {
      // Hit your end point that returns portal session object as response
      // This sample end point will call the below api
      // https://apidocs.chargebee.com/docs/api/portal_sessions#create_a_portal_session
      return this.http.post("http://localhost:8000/api/generate_portal_session", this.getFormUrlEncoded({}),
      {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})}).toPromise()
    });
  }

  openCheckout() {
    this.cbInstance.openCheckout({
      hostedPage: () => {
        // Hit your end point that returns hosted page object as response
        // This sample end point will call the below api
        // You can pass hosted page object created as a result of checkout_new, checkout_existing, manage_payment_sources
        // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_new_subscription
        // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_existing_subscription
        // https://apidocs.chargebee.com/docs/api/hosted_pages#manage_payment_sources
        // If you want to use paypal, go cardless and plaid, pass embed parameter as false

        return this.http.post("http://localhost:8000/api/generate_checkout_new_url", this.getFormUrlEncoded({plan_id: 'cbdemo_scale'}), {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})}).toPromise();
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

  openPortal() {
    this.cbInstance.createChargebeePortal().open({
      loaded: () => {

      },
      close: () => {

      },
      paymentSourceAdd: (status) => {
        console.log("payment source add" + status);
      },
      paymentSourceUpdate: (status) => {
        console.log("payment source update" + status);
      },
      paymentSourceRemove: (status) => {
        console.log("payment source removed");
      },
      visit: (value) => {
        console.log(value);
      }
    });
  }
}

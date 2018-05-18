import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'checkout-new',
  templateUrl: './checkout_new.component.html',
  styleUrls: ['./checkout_new.component.css']
})
export class CheckoutNewComponent {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  phone: string;
  cbInstance: any;
  loading: boolean;
  errMsg: boolean;

  constructor(private http: HttpClient, private ref: ChangeDetectorRef) {
  }

  getFormUrlEncoded(toConvert) {
		const formBody = [];
		for (const property in toConvert) {
      const encodedKey = encodeURIComponent(property);
      if(toConvert[property]) {
        const encodedValue = encodeURIComponent(toConvert[property]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
		}
		return formBody.join('&');
	}

  ngOnInit() {
    this.cbInstance = window['Chargebee'].init({
      site: "honeycomics-v3-test"
    });
  }

  openCheckout() {
    this.cbInstance.openCheckout({
      hostedPage: () => {
        this.loading = true;
        // Hit your end point that returns hosted page object as response
        // This sample end point will call the below api
        // You can pass hosted page object created as a result of checkout_new, checkout_existing, manage_payment_sources
        // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_new_subscription
        // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_existing_subscription
        // https://apidocs.chargebee.com/docs/api/hosted_pages#manage_payment_sources
        // If you want to use paypal, go cardless and plaid, pass embed parameter as false
        let data = {
          plan_id: "cbdemo_scale",
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          phone: this.phone,
          company: this.company
        }
        return this.http.post("http://localhost:8000/api/generate_checkout_new_url", this.getFormUrlEncoded(data), {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})}).toPromise();
      },
      loaded: () => {
        console.log("checkout opened");
      },
      error: () => {
        this.loading = false;
        this.ref.markForCheck();
        this.errMsg = true;
      },
      close: () => {;
        this.loading = false;
        this.ref.detectChanges();
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
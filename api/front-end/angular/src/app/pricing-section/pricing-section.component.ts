import { Component } from '@angular/core';
import { ApiService } from '../api.service';
declare var Chargebee: any;

@Component({
  selector: 'pricing-section',
  templateUrl: './pricing-section.component.html',
  styleUrls: ['./pricing-section.component.css']
})
export class PricingSection {
  title = 'Pricing Section';

  constructor(private apiService: ApiService) {}

  onSubscribe(plan: string) {
    const cbInstance = Chargebee.getInstance();
    cbInstance.openCheckout({
      hostedPage: () => {
        return new Promise((resolve, reject) => {
          this.apiService.createCheckoutForNewSubscription(plan).subscribe(hostedPage => resolve(hostedPage))
        })
      },
      success: function(hostedPageId: string) {
        console.log('hosted page success', hostedPageId);
      }
    });
  }
}

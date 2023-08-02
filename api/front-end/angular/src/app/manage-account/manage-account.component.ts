import { Component } from '@angular/core';
import { ApiService } from '../api.service';
declare var Chargebee: any;

@Component({
  selector: 'manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccount {
  title = 'Manage Account';

  constructor(private apiService: ApiService) {}

  checkoutForUpdatingSubscription() {
    const cbInstance = Chargebee.getInstance();
    cbInstance.openCheckout({
      hostedPage: () => {
        return new Promise((resolve, reject) => {
          this.apiService.createCheckoutForUpdatingSubscription('AzZTYOTlmtDUw3w4').subscribe(hostedPage => resolve(hostedPage))
        })
      },
      success: function(hostedPageId: string) {
        console.log('hosted page success', hostedPageId);
      }
    });
  }

  openCustomerPortal() {
    const cbInstance = Chargebee.getInstance();
    cbInstance.setPortalSession(() => {
      return new Promise(resolve => {
        return this.apiService.createPortalSession().subscribe(portalSession => resolve(portalSession))
      })
    });
    const cbPortal = cbInstance.createChargebeePortal();
    cbPortal.open({
      close() {
        console.log('portal closed')
      }
    });
  }

  openManagePaymentSources() {
    const cbInstance = Chargebee.getInstance();
    cbInstance.openCheckout({
      hostedPage: () => {
        return new Promise((resolve, reject) => {
          return this.apiService.createManagePaymentSources().subscribe(hostedPage => resolve(hostedPage))
        })
      },
      success: function(hostedPageId: string) {
        console.log('hosted page success', hostedPageId);
      }
    });
  }

}

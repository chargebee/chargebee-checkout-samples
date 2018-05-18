import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { CheckoutExistingComponent } from '../checkout_existing/checkout_existing.component';
import { CheckoutNewComponent } from '../checkout_new/checkout_new.component';
import { CheckoutExistingLoginComponent } from './../checkout_existing/login/checkout_existing_login.component';
import { CheckoutExistingUpgradeComponent } from './../checkout_existing/upgrade/checkout_existing_upgrade.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: 'checkout_new', component: CheckoutNewComponent },
  { path: 'checkout_existing', component: CheckoutExistingComponent, children: [
    {
      path: '', redirectTo: 'login', pathMatch: 'full'},
    {
      path: 'login', component: CheckoutExistingLoginComponent
    },
    {
      path: 'profile', component: CheckoutExistingUpgradeComponent
    }
  ] }
];


@NgModule({
  declarations: [
    AppComponent,
    CheckoutNewComponent,
    CheckoutExistingComponent,
    CheckoutExistingLoginComponent,
    CheckoutExistingUpgradeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from  '@angular/common/http';

import { AppComponent } from './app.component';
import { PricingSection } from './pricing-section/pricing-section.component';
import { ManageAccount } from './manage-account/manage-account.component';
@NgModule({
  declarations: [
    AppComponent,
    PricingSection,
    ManageAccount,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

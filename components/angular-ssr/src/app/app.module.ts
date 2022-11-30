import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ChargebeeJsAngularWrapperModule } from '@chargebee/chargebee-js-angular-wrapper';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Example1Component } from './example1/example1.component';

@NgModule({
  declarations: [
    AppComponent,
    Example1Component,
  ],
  imports: [
    FormsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    ChargebeeJsAngularWrapperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChargebeeJsAngularWrapperModule } from '@chargebee/chargebee-js-angular-wrapper';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Example1Component } from './example1/example1.component';
import { Example2Component } from './example2/example2.component';
import { Example3Component } from './example3/example3.component';

@NgModule({
  declarations: [
    AppComponent,
    Example1Component,
    Example2Component,
    Example3Component,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ChargebeeJsAngularWrapperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

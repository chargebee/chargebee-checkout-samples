import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-app';
  constructor() {
    window['Chargebee'].init({
      site: 'honeycomics-v3-test',
      publishableKey: 'test_qoH22RugUvm5IcxoqUD5Svdcu9mX5figf'
    });
  }
}

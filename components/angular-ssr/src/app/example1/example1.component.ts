import { Component } from '@angular/core';

@Component({
  selector: 'app-example1',
  templateUrl: './example1.component.html',
  styleUrls: ['./example1.component.scss']
})
export class Example1Component {
  firstName: string;
  loading: boolean;
  token: string;
  error: string;
  cbInstance: object;

  // To store card component instance from ready event
  cardComponent: any;

  // Custom styles
  styles = {
    // Styles for default state
    base: {
      color: '#333',
      fontWeight: '500',
      fontFamily: 'Lato, Segoe UI, Helvetica Neue, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',

      ':focus': {
        color: '#424770',
      },

      '::placeholder': {
        color: 'transparent',
      },

      ':focus::placeholder': {
        color: '#7b808c',
      },
    },

    // Styles for invalid state
    invalid: {
      color: '#e41029',

      ':focus': {
        color: '#e44d5f',
      },
      '::placeholder': {
        color: '#FFCCA5',
      },
    }
  };

  // Custom fonts
  fonts = [
    'https://fonts.googleapis.com/css?family=Lato:400,700'
  ];

  // Custom placeholder
  placeholder = {
    number: '4111 1111 1111 1111',
    expiry: 'MM / YY',
    cvv: 'CVV'
  };

  // Custom classes for container element
  classes = {
    focus: 'focus',
    invalid: 'invalid',
    empty: 'empty',
    complete: 'complete',
  };

  // Locale
  locale = 'en';

  constructor() { }

  ngAfterContentInit() {
    if (window != undefined) {
      window['Chargebee'].init({
        site: 'honeycomics-v3-test',
        publishableKey: 'test_qoH22RugUvm5IcxoqUD5Svdcu9mX5figf'
      });
      this.cbInstance = window['Chargebee'].getInstance();
    }
  }

  tokenize() {
    this.loading = true;
    // Use card component instance to call the tokenize method
    this.cardComponent.tokenize().then((data) => {
      this.token = data.token;
      this.loading = false;
      this.error = '';
    }).catch((error) => {
      this.loading = false;
      this.error = 'Problem while tokenizing your card details';
      this.token = '';
    });
  }

  // Receive the cardComponent instance on ready event
  setComponent(cardComponent) {
    this.cardComponent = cardComponent;
  }
}

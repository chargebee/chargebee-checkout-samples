import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { PaymentIntent, AdditionalData } from '@chargebee/chargebee-js-angular-wrapper/lib/types';

@Component({
  selector: 'app-example4',
  templateUrl: './example4.component.html',
  styleUrls: ['./example4.component.scss']
})
export class Example4Component implements OnInit {
  firstName: string;
  loading: boolean;
  token: string;
  intent: PaymentIntent;
  additionalData: AdditionalData;
  cardComponent: any;

  // To store validation errors
  errorMessage: string;
  errors: any = {};

  // Using change detector to update validation errors on change
  changeDetector: ChangeDetectorRef;

  locale = 'en';
  styles = {
    base: {
      color: '#2a2d5b',
      fontWeight: '500',
      fontFamily: 'Raleway,-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',

      ':focus': {
        // color: '#424770',
      },

      '::placeholder': {
        color: '#9293AB',
        fontSize: '14px',
      },

      ':focus::placeholder': {
        color: '#666',
      },
    },
    invalid: {
      color: '#e41029',

      ':focus': {
        color: '#e44d5f',
      },
      '::placeholder': {
        color: '#FFCCA5',
      },
    },
  };

  fonts = [
    'https://fonts.googleapis.com/css?family=Raleway:300,500,600'
  ];

  classes = {
    focus: 'focus',
    invalid: 'invalid',
    empty: 'empty',
    complete: 'complete',
  };

  // Dependency injection of Change detector
  constructor(changeDetector: ChangeDetectorRef) {
    this.changeDetector = changeDetector;
  }

  ngOnInit() {
    this.createPaymentIntent();
  }

  createPaymentIntent(payload: any = {}) {
    return fetch('http://localhost:4000/payment_intent', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(payload)
    }).then(response => response.json())
    .then(intent => {
      this.intent = intent;
      return intent;
    });
  }

  authorize() {
    this.loading = true;
    // Call tokenize method using card component instance
    this.cardComponent.authorizeWith3ds(this.intent, this.additionalData).then((authorizedIntent) => {
      this.intent = authorizedIntent;
      this.token = authorizedIntent.id;
      this.loading = false;
      this.errorMessage = '';
    }).catch((error) => {
      this.loading = false;
      this.errorMessage = 'Problem while tokenizing your card details';
      this.token = '';
    });
  }

  onChange(event) {
    // Validation Error handling
    if (event.error) {
      this.errors[event.field] = event.error;
      this.errorMessage = event.error.message;
    } else {
      this.errors[event.field] = null;
      // If there's no error, check for existing error
      const errors: Array<any> = Object.values(this.errors).filter(val => val);

      // The errorObject holds a message and code
      // Custom error messages can be displayed based on the error code
      const errorObj: any = errors.pop();

      // Display existing message
      if (errorObj) {
        this.errorMessage = errorObj.message;
      } else {
        this.errorMessage = '';
      }
    }
    this.changeDetector.detectChanges();
  }

  // Triggered on card component ready
  setComponent(component) {
    this.cardComponent = component;
  }

}

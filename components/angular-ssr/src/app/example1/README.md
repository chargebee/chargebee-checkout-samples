# Chargebee Components Angular - Example 1 
### Scenarios covered
  * Initializing chargebee.js
  * Setting up Chargebee components in `fields-mode`
  * Style customization
  * Font customization
  * Input Placeholder customization
  * Setting locale
  * Creating chargebee token on submit

### Code breakdown
In your `component.html`
```html
    <!-- To render Card component, use directive cbCardField -->
    <!-- Pass component options as attributes -->
    <div id="card-field" cbCardField class="fieldset field"
      [styles]="styles" 
      [classes]="classes" 
      [fonts]="fonts"
      [placeholder]="placeholder"
      [locale]="locale"
      (ready)="setComponent($event)"
    >
    <!-- ^ Use ready event to get the instance of the card component, for calling instance methods -->
    ...
      <!-- For rendering Number field, use cbNumberField directive -->
      <div id="number-field" cbNumberField class="ex1-input" ></div>
      <!-- For rendering Expiry field, use cbExpiryField directive -->
      <div id="expiry-field" cbExpiryField class="ex1-input"></div>
      <!-- For rendering CVV field, use cbCvvField directive -->
      <div id="cvv-field" cbCvvField class="ex1-input"></div>
    ...
      
      <button type="submit" class="ex1-button" (click)="tokenize()">Pay $25</button>
    </div>
```

In your `component.ts`
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-example1',
  templateUrl: './example1.component.html',
  styleUrls: ['./example1.component.scss']
})

export class Example1Component {
  ...
  // To store card component instance, (from ready event)
  cardComponent: any;

  // Custom styles
  styles = {
    // Styles for default field state
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

    // Styles for invalid field state
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

  // Custom classes
  classes = {
    focus: 'focus',
    invalid: 'invalid',
    empty: 'empty',
    complete: 'complete',
  };

  // Locale
  locale = 'en';

  constructor() { }

  tokenize() {
    this.loading = true;
    // Use the card component instance to call tokenize method
    // Additional data can also be passed to this method
    this.cardComponent.tokenize().then((data) => {
      ...
      console.log('Chargebee token', data.token);
    }).catch((error) => {
      ...
    });
  }

  setComponent(component) {
    this.cardComponent = component;
  }
}

```
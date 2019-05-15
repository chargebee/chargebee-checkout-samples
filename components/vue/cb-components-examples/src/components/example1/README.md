# Chargebee components Vue - Example 1 - Basics
### Scenarios covered
  * Initializing chargebee.js
  * Setting up Chargebee components in `fields-mode`
  * Style customization
  * Font customization
  * Input Placeholder customization
  * Setting locale
  * Creating chargebee token on submit

### Code breakdown

In your `example.vue` template
```html
<template>
  ...
    <!-- Pass options to card component  -->
    <!-- Assign a ref for calling internal methods -->
    <CardComponent ref="card" class="fieldset field" 
      :styles="styles" 
      :classes="classes" 
      :locale="locale" 
      :placeholder="placeholder" 
      :fonts="fonts"
    >
      <!-- Individual fields (fields-mode) -->
      <CardNumber class="ex1-input" />
      <CardExpiry class="ex1-input"/>
      <CardCvv class="ex1-input"/>
    </CardComponent>
    ...
    <button type="submit" class="ex1-button" @click="tokenize">Pay $25</button>
    ...
</template>
```

In your script
```js

import { CardComponent, CardNumber, CardExpiry, CardCvv } from '@chargebee/chargebee-js-vue-wrapper';

export default {
  name: 'Example1',
  components: {
    CardComponent,
    CardNumber,
    CardExpiry,
    CardCvv
  },

  methods: {
    // Method for tokenizing card details
    tokenize() {
      this.loading = true;
      
      // Call tokenize method through the card component ref
      // Additional data can be passed to the tokenize method
      this.$refs.card.tokenize({}).then((data) => {
        this.loading = false;
        this.token = data.token;
        ...
      }).catch((error) => {
        console.error(error);
        this.loading = false;
        ...
      });

    }

  },
  data() {
    return {
      // Custom classes
      classes: {
        focus: 'focus',
        invalid: 'invalid',
        empty: 'empty',
        complete: 'complete',
      },

      // Fonts
      fonts: [
        "https://fonts.googleapis.com/css?family=Lato:400,700"
      ],

      // Custom placeholders
      placeholder: {
        number: "4111 1111 1111 1111",
        cvv: "CVV",
        expiry: "MM / YY",
      },

      // locale
      locale: "en",

      // Custom styles for default and invalid field state
      styles: {
        
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

        invalid: {
          color: '#e41029',

          ':focus': {
            color: '#e44d5f',
          },
          '::placeholder': {
            color: '#FFCCA5',
          },
        },
      }
    }
  }
}
```


#  Chargebee components Vue - Example 4
## Scenarios covered
  * 3DS Authorization
  * Passing additional data for improving the chances of frictionless checkout 


### Code breakdown

In your `example.vue` template
```html
<template>
  ...
    <!-- Pass options to card component -->
    <CardComponent ref="card" class="fieldset field"
      :styles="styles" 
      :classes="classes" 
      @ready="onReady"
      @change="onChange"
    >
      <!-- ^ Add ready and change listener to card component -->

      <!-- Indivudual fields mode -->
      <!-- Attach listeners to detect focus, blur on each field -->
      <CardNumber class="ex3-input" 
        :placeholder="'4111 1111 1111 1111'" 
        @focus="onFocus" 
        @blur="onBlur"
      />
      <CardExpiry class="ex3-input" 
        @focus="onFocus" 
        @blur="onBlur"
      />
      <CardCvv class="ex3-input" 
        @focus="onFocus" 
        @blur="onBlur"
      />
    </CardComponent>
  ...
</template>
```

In your script
```js
import { CardComponent, CardNumber, CardExpiry, CardCvv } from '@chargebee/chargebee-js-vue-wrapper';

export default {
  name: 'Example3',

  components: {
    CardComponent,
    CardNumber,
    CardExpiry,
    CardCvv
  },

  methods: {
    tokenize() {
      // Call the tokenize method through the card component's ref
      this.$refs.card.tokenize({}).then((data) => {
        this.token = data.token;
        ...
      }).catch((error) => {
        console.log(error);
        ...
      });
    },

    // Called when component is mounted in the DOM & ready
    onReady() {
      console.log('card component ready');
    },

    // Called when a field is focused
    onFocus(event) {
      console.log(event.field, 'focused');
    },

    // Called when a field is blurred
    onBlur(event) {
      console.log(event.field, 'blurred');
    },

    // Called on every state change in the card component
    onChange(event) {
      // Check for validation errors
      if(event.error) {
        this.errors[event.field] = event.error
        
        // Display error message
        this.errorMessage = event.error.message
      } else {
        this.errors[event.field] = null
        // If there's no error, check for existing error
        const _errors = Object.values(this.errors).filter(val => val)
        
        // The errorObject holds a message and code
        // Custom error messages can be displayed based on the error code
        const errorObj = _errors.pop();

        // Display existing message
        if(errorObj) this.errorMessage = errorObj.message
        else this.errorMessage = ''
      }
    },

  },
  data() {
    return {
      ...
      // To store validation error messages
      errors: {
        number: null,
        expiry: null,
        cvv: null,
      },
      errorMessage: '',

      // Options for card component
      classes: {...},
      styles: {...},
    }
  },
  ...
}
```
# Chargebee components Vue - Example 2 - Programmatic actions
## Scenarios covered
  * Set up Chargebee components in `combined-mode`
  * Enable/Disable card icon
  * Perform programmatic actions
    * Focus on field
    * Clear all fields
    * Update styles dynamically


### Code breakdown

In your `example.vue` template
```html
<template>
    ...
    <!-- Pass options to card component & assign a ref to call internal methods -->
    <!-- Render card component in combined-mode  -->
    <CardComponent ref="card" class="ex2-input fieldset field" 
      :icon="cardIcon" 
      :styles="styles" 
      :fonts="fonts" 
      :classes="classes"
      @ready="onReady"
    />
      <!-- ^ Attach on ready callback -->
    ...
  </div>
</template>
```

In your script
```js
import { CardComponent } from '@chargebee/chargebee-js-vue-wrapper';

export default {
  name: 'Example2',

  components: {
    CardComponent
  },

  data() {
    // Options for card component
    return {
      styles: {...},
      fonts: {...},
      icon: true,
      classes: {...},
    }
  },

  methods: {
    tokenize() {
      ...
      // Call tokenize method using ref
      this.$refs.card.tokenize({}).then((data) => {
        ...
        this.token = data.token;
      }).catch((error) => {
        console.error(error);
        ...
      });
    },

    // Focus on the card component when its mounted and ready
    onReady(cardComponent) {
      this.$refs.card.focus();
    },

    // Programatically clear contents of the fields
    clear() {
      this.$refs.card.clear();
    },

    // Update options dynamically
    toggleCardIcon() {
      // Update any of the options passed to card component
      this.cardIcon = !this.cardIcon;
    }
  },

  ...
}
```


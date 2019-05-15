# Chargebee Components Angular - Example 2
### Scenarios covered
  * Set up Chargebee components in `combined-mode`
  * Enable/Disable card icon
  * Perform programmatic actions
    * Focus on field
    * Clear all fields
    * Update styles dynamically

### Code breakdown
In your `component.html`
```html
  ...
    <!-- Card component in combined-mode -->
    <!-- pass options as attributes -->
    <div cbCardField id="card-field" class="ex2-input fieldset field"
      [icon]="icon" 
      [styles]="styles" 
      [classes]="classes" 
      [fonts]="fonts" 
      (ready)="onReady($event)"
    >
      <!-- ^ Use ready event to get the card component instance -->
    </div>
  ...
```

In your `component.ts`
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-example2',
  templateUrl: './example2.component.html',
  styleUrls: ['./example2.component.scss']
})
export class Example2Component {
  // To store the card component instance
  cardComponent: any;

  // Options for card component
  styles = {...},
  fonts = {...},
  classes = {...},
  icon = true;

  constructor() { }

  tokenize() {
    ...
    // Use the card component instance from ready event to invoke the tokenize method
    this.cardComponent.tokenize().then((data) => {
      console.log(data.token);
      ...
    }).catch((error) => {
      
    });
  }

  // Any of the options passed to the card component can be updated dynamically.
  // For example: toggling the card icon
  toggleCardIcon = () => {
    this.icon = !this.icon;
  }

  // To clear the contents of the fields
  clear = () => {
    this.cardComponent.clear();
  }

  // Update Example: Change font size
  setFontSize = (fontSize) => {
    this.fontSize = fontSize;
    this.styles = {
      ...this.styles,
      base: {
        ...this.styles.base,
        fontSize: `${fontSize}px`
      }
    };
  }

  increaseFontSize = () => {
    this.setFontSize(this.fontSize + 1);
  }

  decreaseFontSize = () => {
    this.setFontSize(this.fontSize - 1);
  }

  // Use ready event to capture the card component instance
  onReady = (cardComponent) => {
    this.cardComponent = cardComponent;
    this.cardComponent.focus();
  }
}


```
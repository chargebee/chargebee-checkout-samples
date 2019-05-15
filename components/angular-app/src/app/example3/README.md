# Chargebee Components Angular - Example 3
### Scenarios covered
  * Set up event listeners
    * on ready
    * on focus
    * on blur
    * on change
  * Handling validation errors

### Code breakdown
In your `component.html`
```html
 <!-- To render Card field, use cbCardField directive -->
  <div id="card-field" cbCardField class="fieldset field" 
    [styles]="styles" 
    [classes]="classes" 
    [fonts]="fonts"
    [locale]="locale"
    (ready)="setComponent($event)"
    (change)="onChange($event)"
  >
  <!-- ^ Bind ready and change listeners -->
    <div id="number-field" cbNumberField class="ex1-input" 
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
    >
    <!-- ^ Bind focus and blur listeners -->
    </div>
    <div id="expiry-field" cbExpiryField class="ex1-input"
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
    ></div>
    <div id="cvv-field" cbCvvField class="ex1-input"
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
    ></div>
  </div>
```

In your `component.ts`
```ts
...
  // Triggered on card component ready
  setComponent(component) {
    this.cardComponent = component;
  }

  // Triggered on field focus
  onFocus(event) {
    console.log(event.field, 'focused');
  }

  // Triggered on field blur
  onBlur(event) {
    console.log(event.field, 'blurred');
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

...
```
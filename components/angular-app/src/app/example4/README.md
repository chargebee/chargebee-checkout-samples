# Chargebee Components Angular - Example 4
### Scenarios covered
  * 3DS Authorization
  * Passing additional data to authorize method

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
  > <!-- ^ Bind ready and change listeners -->
    <div id="number-field" cbNumberField class="ex1-input"></div>
    <div id="expiry-field" cbExpiryField class="ex1-input"></div>
    <div id="cvv-field" cbCvvField class="ex1-input"></div>
  </div>
```

In your `component.ts`
```ts
...
  // Triggered on card component ready
  setComponent(component) {
    this.cardComponent = component;
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
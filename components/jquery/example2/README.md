# Example 2
## Scenarios covered
  * Set up Chargebee components in `combined-mode`
  * Enable/Disable card icon
  * Perform programmatic actions
    * Focus on field
    * Clear all fields
    * Update styles dynamically

### Run 
```bash
python -m SimpleHTTPServer 9000
```

## Code breakdown
```js
// Creating card component (combined-mode)
var cardComponent = cbInstance.createComponent("card", options).at("card-combined"); 
cardComponent.mount();

// Programatically clear all the fields
cardComponent.clear();

// Dynamically update options
cardComponent.update({
  style: {
    base: {
      color: '#fff',
      fontSize: `18px`
    }
  }
})

// Programatically focus field
cardComponent.focus();

// Card Icon
  var options = {
    // Default value true
    // To disable card icon, set it expicitly to false
    icon: true,
    ...
  }

```

### Note:
All of the methods on card/field instance needs to be called only after component mount.

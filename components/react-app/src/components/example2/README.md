# Chargebee Components React - Example 2
### Scenarios covered
  * Set up Chargebee components in `combined-mode`
  * Enable/Disable card icon
  * Perform programmatic actions
    * Focus on field
    * Clear all fields
    * Update styles dynamically

### Code breakdown
In your app.js
```jsx

export default class Example2 extends Component {
  constructor(props) {
    super(props);
    // Create a ref for card component
    this.cardRef = React.createRef()
    
    this.state = {
      ...
      // options for card component
      classes: {...},
      styles: {...}
      cardIcon: true,
    }
    ...
  }

  tokenize() {
    this.setState({loading: true});
    // Call tokenize method using card component's ref
    this.cardRef.current.tokenize({}).then((data) => {
      console.log(data.token)
      ...
    }).catch((error) => {
      ...
    });
  }

  // Update any of the props passed to card-component to trigger update
  // For instance to increase the font size dynamically update the style prop
  increaseFontSize = () => {
    const fontSize = this.state.fontSize + 1;
    this.setState({
      fontSize,
      styles: {
        ...this.state.styles,
        base: {
          ...this.state.styles.base,
          fontSize: `${fontSize}px`,
        }
      }
    })
  }
  ...

  // Toggle for card-icon (update props)
  toggleCardIcon = () => {
    this.setState({
      cardIcon: !this.state.cardIcon
    })
  }

  // Clear the contents of the fields
  clear = () => {
    // call clear method through the ref
    this.cardRef.current.clear();
  }

  render() {
    const { cardIcon, styles, classes } = this.state;
    return (
      ...
      {/* Render card component in combined-mode */}
      <CardComponent ref={this.cardRef} className="ex2-input fieldset field"
        icon={cardIcon}
        styles={styles}
        classes={classes} 
      />
      ...
    );
  }
}
```
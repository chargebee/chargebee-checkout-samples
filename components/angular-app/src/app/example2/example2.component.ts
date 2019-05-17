import { Component, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-example2',
  templateUrl: './example2.component.html',
  styleUrls: ['./example2.component.scss']
})
export class Example2Component {
  firstName: string;
  email: string;
  phone: string;
  loading: boolean;
  token: string;
  error: string;
  cardComponent: any;
  fontSize = 16;
  themes = [
    {
      'main-bg': '#262E3A',
      'secondary-bg': '#3e4b5b',
      'main-text': '#fff',
      'placeholder': '#939aa3',
      'placeholder-focused': '#ccc',
      'primary-btn': '#6EEDB6',
      'btn-text': '#1C2026',
      'primary-btn-focus': 'rgb(70, 203, 145)',
      'invalid': '#FF7C4A',
      'invalid-focused': '#e44d5f',
      'invalid-placeholder': '#FFCCA5',
    },
    {
      'main-bg': '#D5DBE7',
      'secondary-bg': '#fff',
      'main-text': '#000',
      'placeholder': '#abacbe',
      'placeholder-focused': '#abacbe',
      'primary-btn': '#4773D2',
      'btn-text': '#fff',
      'primary-btn-focus': '#3361c3',
      'invalid': '#E94745',
      'invalid-focused': '#e44d5f',
      'invalid-placeholder': '#FFCCA5'
    },
    {
      'main-bg': '#fca571',
      'secondary-bg': '#fff',
      'main-text': '#252857',
      'placeholder': '#9293AB',
      'placeholder-focused': '#666',
      'primary-btn': '#252857',
      'btn-text': '#fff',
      'primary-btn-focus': '#191c4a',
      'invalid': '#E94745',
      'invalid-focused': '#e44d5f',
      'invalid-placeholder': '#FFCCA5'
    },
    {
      'main-bg': '#544FB0',
      'secondary-bg': '#fff',
      'main-text': '#35A9BD',
      'placeholder': 'ddd',
      'placeholder-focused': '#ddd',
      'primary-btn': '#35A9BD',
      'btn-text': '#fff',
      'primary-btn-focus': 'rgb(29, 138, 157)',
    }
  ];
  theme = this.themes[0];
  styles = this.getIframeStyles(this.theme);

  fonts = ['https://fonts.googleapis.com/css?family=Lato:300,500,600'];

  classes = {
    focus: 'focus',
    invalid: 'invalid',
    empty: 'empty',
    complete: 'complete',
  };

  placeholder = {
    number: 'Card number',
    cvv: '123',
    expiry: 'MM/YY',
  };

  icon = true;
  counter = 0;

  constructor(private sanitizer: DomSanitizer) { }
  @HostBinding('style')
  get style() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `
        --main-bg: ${this.theme['main-bg']};
        --secondary-bg: ${this.theme['secondary-bg']};
        --main-text: ${this.theme['main-text']};
        --placeholder: ${this.theme['placeholder']};
        --placeholder-focused: ${this.theme['placeholder-focused']};
        --primary-btn: ${this.theme['primary-btn']};
        --btn-text: ${this.theme['btn-text']};
        --primary-btn-focus: ${this.theme['primary-btn-focus']};
      `
    );
  }

  setTheme(event, index) {
    event.preventDefault();
    this.theme = this.themes[index];
    this.styles = this.getIframeStyles(this.theme);
  }

  getIframeStyles(theme) {
    return {
      base: {
        color: theme['main-text'],
        fontWeight: '500',
        fontFamily: 'Lato,-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        iconColor: theme['main-text'],

        ':focus': {
          // color: '#424770',
        },

        '::placeholder': {
          color: theme['placeholder'],
        },

        ':focus::placeholder': {
          color: theme['placeholder-focused'],
        },
      },
      invalid: {
        color: theme['invalid'] || '#FF7C4A',

        ':focus': {
          color: theme['invalid-focused'] || '#e44d5f',
        },
        '::placeholder': {
          color: theme['invalid-placeholder'] || '#FFCCA5',
        },
      },
    };
  }

  tokenize() {
    this.loading = true;
    this.cardComponent.tokenize().then((data) => {
      this.token = data.token;
      this.loading = false;
    }).catch((error) => {
      this.loading = false;
      this.error = 'Problem while tokenizing your card details';
    });
  }

  toggleCardIcon = () => {
    this.icon = !this.icon;
  }

  clear = () => {
    this.cardComponent.clear();
  }

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

  changePlaceholder = () => {
    const placeholders = [
      {
        number: 'Card number',
        cvv: '123',
        expiry: 'MM/YY',
      },
      {
        number: '41111 1111 1111',
        cvv: 'CVV',
        expiry: 'MM / YY',
      }
    ];
    this.counter = this.counter + 1;
    this.placeholder = placeholders[this.counter % 2];
  }

  onReady = (cardComponent) => {
    this.cardComponent = cardComponent;
    this.cardComponent.focus();
  }
}
